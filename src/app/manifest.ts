import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ひなこ専用 スタバ5秒クイズ",
    short_name: "ひなこ5秒クイズ",
    description:
      "ひなこが5秒で正しいカスタム判断を鍛えるためのクイズアプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1215",
    theme_color: "#1f8a62",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
