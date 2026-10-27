export default function CatalogueSearch({ query = "" }: { query?: string }) {
  return (
    <form
      className="catalogue-search"
      role="search"
      action="/books"
      method="get"
    >
      <label htmlFor="catalogue-query">Search the catalogue</label>
      <div className="search-input-row">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          id="catalogue-query"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Title, author, ISBN or subject"
          maxLength={200}
        />
        <button className="button button-navy" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
