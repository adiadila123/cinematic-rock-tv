import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ROCK TV";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ro");
  const root = process.cwd();
  const fontDir = path.join(root, "node_modules/@fontsource/anton/files");
  const [antonLatin, antonExt, hero] = await Promise.all([
    readFile(path.join(fontDir, "anton-latin-400-normal.woff")),
    // Romanian ș/ț live in the latin-ext subset
    readFile(path.join(fontDir, "anton-latin-ext-400-normal.woff")),
    readFile(path.join(root, "public/images/hero-arena-stage.png")),
  ]);
  const heroSrc = `data:image/png;base64,${hero.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#060608",
          fontFamily: "Anton",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.75 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(6,6,8,0.2) 0%, rgba(6,6,8,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            padding: "40px 48px",
            borderRadius: 40,
            background: "rgba(24,24,31,0.55)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#dc143c",
                boxShadow: "0 0 24px #dc143c",
              }}
            />
            <div style={{ fontSize: 34, color: "#f6f5f2", letterSpacing: 2 }}>ROCK TV · LIVE 24/7</div>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 82,
              lineHeight: 1,
              color: "#f6f5f2",
            }}
          >
            {/* Uppercase in JS so satori resolves Ă/Ș/Ț glyphs from Anton */}
            {dict.hero.titleA.toLocaleUpperCase(lang)}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonLatin, style: "normal", weight: 400 },
        { name: "Anton", data: antonExt, style: "normal", weight: 400 },
      ],
    }
  );
}
