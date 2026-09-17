# The Rojgar Result — Reusable Template and Page Generation Guide

This file is the single source for page reuse and page generation instructions.

## Objective

When a blank page is requested for a category such as Answer Key, Results, Syllabus, Latest Jobs, Latest Results, Admit Cards, Upcoming Jobs, or other related pages:

- keep the site theme unchanged
- keep the shared header, footer and menu structure intact
- keep the page body intentionally empty or minimal if the user requests a blank HTML shell
- preserve the project’s layout styling and color system
- do not create unnecessary demo pages in the site root just to hold a page structure

## Reusable structure

Use the existing homepage/site layout pattern:

- common top navigation
- category menu/list
- shared header and footer
- consistent CSS and JavaScript assets
- same blue/red style and body design language

## Required page skeleton

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

  <!-- Open Graph / Social Media Meta -->
  <meta property="og:title" content="Page Title - The Rojgar Result">
  <meta property="og:description" content="Page description for The Rojgar Result">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://therojgarresult.com/page-name.html">

  <!-- CSS -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <!-- shared site navigation -->
    </nav>
  </header>

  <main>
    <!-- empty body area or requested content area -->
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
2. Reuse the same header, footer and menu structure for all page families.
3. Keep the body blank or empty when the user asks for a blank page shell.
4. Use the central project metadata layout and avoid changing the site design style.
5. Use one reusable page template instead of storing numerous demo HTML files.
6. If the user asks for latest related post pages, inspect this template and then generate pages from the same structure.

## Category mapping

The site should map categories such as:

- Latest Jobs
- Latest Results
- Admit Cards
- Answer Keys
- Syllabus
- Admission Forms
- Sarkari Yojana
- Upcoming Jobs

Each mapping should be represented in the root file family instead of creating standalone demo HTML pages.

## Content generation policy

When the user asks for a new page family based on a latest post or latest vacancy concern:

- read the instructions in this template file
- follow the requested category structure
- reuse code from the existing site pattern
- write the requested HTML pages directly in the root folder
- keep metadata titles, descriptions and canonical URLs consistent

## Important rule

Do not keep demo pages in the site root when the same reusable structure can be represented by this template file and generated HTML pages.
