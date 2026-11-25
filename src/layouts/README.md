# `src/layouts/` — the frame around every page

`SiteLayout.jsx` wraps every route (see `App.jsx`):

```
<div class="app-shell">
  "Skip to content" link   → jumps keyboard users straight to the page content
  <Header />               → logo, menu, Contact button (components/navigation)
  <main id="main-content"> → the current page
  <Footer />               → logo, © year and name, social icons, Email link (components/layout)
  #route-announcer         → hidden live region; App.jsx writes the new page title here on navigation
</div>
```

There are no visual styles in this folder; the frame's styles are in `styles/global.css` and the header/footer CSS.
