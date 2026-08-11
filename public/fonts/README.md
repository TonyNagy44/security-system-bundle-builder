# Fonts

The design uses **Gilroy-SemiBold** and **Gilroy-Medium**. Gilroy is a licensed
typeface and is not redistributed in this repo.

Drop these two files here and the app picks them up with no code change:

- `Gilroy-Medium.woff2`  → body copy (weight 500)
- `Gilroy-SemiBold.woff2` → headings, titles, prices (weight 600)

Until they are present the stack falls back to Poppins, which is loaded from
Google Fonts in `index.html` and matches Gilroy's geometric proportions closely
enough that nothing reflows.
