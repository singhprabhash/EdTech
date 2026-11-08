"use client";
import { useState } from "react";
import {
  faqs,
  faqCategories,
  filterFaqs,
  faqStructuredData,
  type FaqCategory,
} from "../../../content/aeetds-support";
import { Icon } from "../ui";
export default function FaqExperience() {
  const [category, setCategory] = useState<FaqCategory>("all");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<readonly string[]>([]);
  const visible = filterFaqs(category, query);
  function reset() {
    setCategory("all");
    setQuery("");
  }
  return (
    <div className="support-faq-experience">
      {visible.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData(visible)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      )}
      <div className="support-faq-toolbar">
        <div
          className="support-faq-chips"
          role="group"
          aria-label="FAQ categories"
        >
          {faqCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
              <span>
                (
                {item.id === "all"
                  ? faqs.length
                  : faqs.filter((faq) => faq.category === item.id).length}
                )
              </span>
            </button>
          ))}
        </div>
        <div className="support-faq-search">
          <label htmlFor="faq-search" className="sr-only">
            Search questions and answers
          </label>
          <Icon name="search" className="text-[20px]" />
          <input
            id="faq-search"
            type="search"
            value={query}
            placeholder="Search questions and answers…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {(category !== "all" || query) && (
          <button className="support-clear" type="button" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      <p role="status" className="support-result-count">
        {visible.length} of {faqs.length} questions
      </p>
      <div className="support-faq-list">
        {visible.length ? (
          visible.map((faq) => {
            const expanded = opened.includes(faq.id);
            return (
              <article key={faq.id} className="support-faq-item">
                <h2>
                  <button
                    type="button"
                    id={`faq-trigger-${faq.id}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-answer-${faq.id}`}
                    onClick={() =>
                      setOpened((previous) =>
                        expanded
                          ? previous.filter((id) => id !== faq.id)
                          : [...previous, faq.id],
                      )
                    }
                  >
                    <span className="support-faq-number">
                      {String(
                        faqs.findIndex((item) => item.id === faq.id) + 1,
                      ).padStart(2, "0")}
                    </span>
                    <span className="support-faq-question">
                      <span className="support-faq-category">
                        {
                          faqCategories.find((item) => item.id === faq.category)
                            ?.label
                        }
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <span className="support-faq-chevron">
                      <Icon name="expand_more" className="text-[20px]" />
                    </span>
                  </button>
                </h2>
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  hidden={!expanded}
                  className="support-faq-answer"
                >
                  <p>{faq.answer}</p>
                </div>
              </article>
            );
          })
        ) : (
          <div className="support-faq-empty">
            <Icon name="search_off" className="text-[32px]" />
            <h2>No matching questions found.</h2>
            <button type="button" className="support-clear" onClick={reset}>
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
