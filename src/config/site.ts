// Identity/contact values come from PRD and the supplied handoff, not sample book data.
export const site = {
  name: "EdTech Publications",
  email: "edtechpublications@gmail.com",
  telephone: "+917408206291",
  telephoneLabel: "+91 74082 06291",
  location: "Lucknow, India",
};

// Add links only when their destination is implemented.
export const navigation = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/publish-with-us", label: "Publish With Us" },
  { href: "/contact", label: "Contact" },
] as const;
