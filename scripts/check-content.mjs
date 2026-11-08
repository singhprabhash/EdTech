import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Source guard only. Rendered links, catalogue schemas and content approval need
// separate feature-level checks; archived designs are deliberately outside scope.
export function checkContent(root) {
  if (!existsSync(root)) return [`${root}: missing source directory`];
  const files = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(tsx|jsx|html)$/.test(entry.name)) files.push(path);
    }
  }
  walk(root);
  if (files.length === 0) return [`${root}: no production source files`];
  const errors = [];
  for (const file of files.sort()) {
    const source = readFileSync(file, "utf8");
    if (/href\s*=\s*(?:["']#["']|\{\s*["']#["']\s*\})/.test(source))
      errors.push(`${file}: dead hash link`);
    if (/lorem\s+ipsum/i.test(source)) errors.push(`${file}: placeholder copy`);
  }
  return errors;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const errors = checkContent(resolve("src"));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Production app source guard passed (not catalogue approval).");
  }
}
