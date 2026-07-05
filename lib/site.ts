export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://noir-cocktail-bar.vercel.app"
).replace(/\/$/, "");
