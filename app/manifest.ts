import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Noir Cocktail Bar",
    short_name: "Noir",
    description: "Premium Cocktail Experience",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
  };
}
