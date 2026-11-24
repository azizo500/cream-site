import { mkdir, writeFile } from "node:fs/promises";
const images = {
  "logo.png": "9vWrLCqDFMJqGm0dtTaTwQhSfY.png",
  "hero-cream.png": "8mwVOGKouEvoFnkNiZrs837Wda0.png",
  "about.png": "wmCXzdEsfReZS9bOMx9kVp75s.png",
  "hydration.png": "j5U8QS0oLP2zuhOjWgp2E2W7Kw.png",
  "renewal.png": "6sKC7maLZZ2bsiA98mqAnfaTXw.png",
  "radiance.png": "vhPIjQ2Y2CteUjTJDOP2tmjpU.png",
  "cleansing.png": "3SEfi7XglNRnoALVBMXfJLYuV6k.png",
  "before.png": "i8ccT8G4sOz9gPMb5VE4CmBk7E.png",
  "after.png": "MZBExz3UlnTvSO549iuukpom4o.png",
  "testimonial.png": "JwachjSf2UZoo2V0KPejvzbfw.png",
  "testimonial-2.png": "GO1XJ3wP7s96nDabnqAPObkEqNs.png",
  "testimonial-3.png": "Q8mjYJRWWOA2MFXf6s1WhAf3dc.png",
  "cream-in-hand.png": "wJKxY7MqxCI9L9fFWfj6vIcpo.png",
};
const fonts = {
  "tajawal-arabic.woff2": "tajawal/v12/Iura6YBj_oCad4k1nzSBC45I.woff2",
  "tajawal-latin.woff2": "tajawal/v12/Iura6YBj_oCad4k1nzGBCw.woff2",
  "naskh-arabic.woff2":
    "notonaskharabic/v44/RrQ5bpV-9Dd1b1OAGA6M9PkyDuVBePeKNaxcsss0Y7bwvc5Urqcyx_M.woff2",
  "naskh-latin.woff2":
    "notonaskharabic/v44/RrQ5bpV-9Dd1b1OAGA6M9PkyDuVBePeKNaxcsss0Y7bwvc5Uq6cy.woff2",
  "instrument-serif.woff2":
    "instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2",
};
await mkdir("public/images", { recursive: true });
await mkdir("public/fonts", { recursive: true });
await mkdir("public/video", { recursive: true });
const assets = [
  ...Object.entries(images).map(([name, id]) => [
    `public/images/${name}`,
    `https://framerusercontent.com/images/${id}`,
  ]),
  ...Object.entries(fonts).map(([name, path]) => [
    `public/fonts/${name}`,
    `https://fonts.gstatic.com/s/${path}`,
  ]),
  [
    "public/video/cream.mp4",
    "https://framerusercontent.com/assets/Mb7t0TTxqOGLYDNehPZrmflQBio.mp4",
  ],
];
await Promise.all(
  assets.map(async ([path, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    const data = Buffer.from(await response.arrayBuffer());
    await writeFile(path, data);
    console.log(`${path}: ${data.length} bytes`);
  }),
);
