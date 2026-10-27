import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('compiler', Path(__file__).parents[1] / 'scripts/compile-ready-design.py')
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)

class CompilerTests(unittest.TestCase):
    def test_strips_executable_markup_and_unsafe_links(self):
        nodes = compiler.parse_fragment('<main><script>alert(1)</script><a href="javascript:alert(1)" onclick="evil()">Link</a><img src="x" onerror="evil()"></main>')
        clean = compiler.sanitize(nodes[0])
        rendered = str(clean)
        self.assertNotIn('alert(1)', rendered)
        self.assertNotIn('onclick', rendered)
        self.assertNotIn('onerror', rendered)
        self.assertNotIn("'tag': 'script'", rendered)
    def test_retains_layout_and_escapable_text(self):
        node = compiler.sanitize(compiler.parse_fragment('<h1 class="text-3xl">Ideas &amp; knowledge</h1>')[0])
        self.assertEqual(node['attrs']['class'], 'text-3xl')
        self.assertEqual(node['children'], ['Ideas & knowledge'])
    def test_subject_modal_survives_outside_main(self):
        data = __import__('json').loads(compiler.compile_design()['src/content/ready-pages.json'])
        self.assertTrue(data['subject']['overlays'])
        self.assertEqual(data['subject']['overlays'][0]['tag'], 'dialog')
    def test_food_subject_maps_to_available_facet(self):
        data = __import__('json').loads(compiler.compile_design()['src/content/ready-pages.json'])
        links=[n for n in compiler.walk(data['home']['main']) if n['tag']=='a' and 'Food, Nutrition' in compiler.text(n)]
        self.assertEqual(links[0]['attrs']['href'], '/books?subject=Food%20%26%20Nutrition')
    def test_related_links_are_distinct_and_breadcrumbs_real(self):
        data = __import__('json').loads(compiler.compile_design()['src/content/ready-pages.json'])
        detail = data['detail']['main']
        links=[n for n in compiler.walk(detail) if n['tag']=='a' and 'View Details' in compiler.text(n)]
        self.assertEqual(len(set(n['attrs']['href'] for n in links)),3)
        breadcrumbs=[n for n in compiler.walk(detail) if n['tag']=='nav' and n['attrs'].get('aria-label')=='Breadcrumb'][0]
        self.assertEqual([n['attrs']['href'] for n in compiler.walk(breadcrumbs) if n['tag']=='a'][:2],['/','/books'])
    def test_rejects_unknown_tags(self):
        self.assertIsNone(compiler.sanitize({'tag':'iframe','attrs':{'src':'https://example.com'},'children':[]}))

if __name__ == '__main__': unittest.main()
