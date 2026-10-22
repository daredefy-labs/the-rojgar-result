# The Rojgar Result — Single Project Template

This file is the one source of truth for page structure, project rules, and content generation.

## Project summary

The Rojgar Result website is a static government job and exam information portal. It includes root HTML pages for:

- Home
- Latest Jobs
- Latest Results
- Admit Cards
- Answer Keys
- Syllabus
- Admission Forms
- Sarkari Yojana
- Upcoming Jobs
- About Us
- Contact Us
- Privacy Policy
- Terms and Conditions
- Disclaimer

## Design theme

- Use the same blue/red site style across all pages.
- Keep header, navigation, footer, cards, and spacing consistent.
- Follow the current layout language used by the site.
- Keep metadata, Open Graph tags, canonical URL, and JSON-LD structure consistent.

## Rule for demo content

- The `demo/` folder is only for reference or layout testing.
- Do not push demo pages to the live site root.
- Prefer generating official pages directly inside the root folder.
- Do not create extra demo HTML files in the root when a reusable template can be used instead.

## Reusable page structure

Use the same structure for all root pages:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - The Rojgar Result</title>
  <meta name="description" content="Page description for The Rojgar Result">
  <meta name="keywords" content="The Rojgar Result, Sarkari Result, latest jobs">
  <link rel="canonical" href="https://therojgarresult.com/page-name.html">

  <meta property="og:title" content="Page Title - The Rojgar Result">
  <meta property="og:description" content="Page description for The Rojgar Result">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://therojgarresult.com/page-name.html">

  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <!-- shared site navigation -->
    </nav>
  </header>

  <main>
    <!-- page content -->
  </main>

  <footer>
    <!-- shared footer -->
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

## Page generation rules

1. Create one HTML page per requested page family.
2. Reuse the same header, footer, menu, CSS, and JS assets.
3. Keep the body clean and consistent with the project design.
4. Write new pages in the root project folder, not in the site root as demo files.
5. Use the same metadata pattern for title, description, keywords, Open Graph values, and canonical links.
6. If the user asks for related post cards, keep the structure consistent with the site and the template.

## Category mapping

Examples of page families:

- Latest Jobs
- Latest Results
- Admit Cards
- Answer Keys
- Syllabus
- Admission Forms
- Sarkari Yojana
- Upcoming Jobs

## Content generation policy

When a new page is requested:

- follow this template
- keep the site theme unchanged
- reuse existing code patterns
- generate the live page in the root folder
- keep demo content inside the `demo/` folder only when explicitly needed for reference

## Final rule

Use this single file as the standard and do not maintain duplicate project guidance files. The public site should remain in the root folder, while the `demo/` folder is kept only as a reference/testing area.
