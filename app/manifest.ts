import type { MetadataRoute } from "next";

/** Lets phones install Kompas on the home screen and open it without the browser bars. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kompas — nauka angielskiego",
    short_name: "Kompas",
    description: "Angielski dla dzieci, nastolatków i dorosłych. Jeden program CEFR, trzy sposoby nauki.",
    lang: "pl",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    background_color: "#f9f6f1",
    theme_color: "#f9f6f1",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
