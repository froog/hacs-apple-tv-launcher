#!/usr/bin/env node
// Regenerate src/assets/icons.ts from the PNGs in src/assets/.
//
// The card ships as a single-file library bundle (vite.config.ts), so loose
// asset files would never be served alongside it. Inlining as data URIs is what
// makes the built-in icons load.
//
// Usage: npm run generate:icons

import { readFileSync, writeFileSync } from "node:fs";

const ICONS = [
  ["settingsIcon", "settings.png", "com.apple.TVSettings"],
  ["searchIcon", "search.png", "com.apple.TVSearch"],
  ["singIcon", "sing.png", "com.apple.Sing"],
  ["computersIcon", "computers.png", "com.apple.TVHomeSharing"],
];

let out = `// Built-in tvOS app icons, inlined as data URIs.
//
// GENERATED FILE — do not edit by hand.
// Run \`npm run generate:icons\` after changing anything in src/assets/.
//
// Inlined rather than imported because the card builds as a single-file library
// bundle, so loose asset files would not be served alongside it.
//
// Provenance: extracted from tvOS 26.6 (build 23L773) via
// research/tvos-icon-extraction. This is Apple's artwork, shipped here rather
// than redrawn — see research/README.md.
`;

for (const [name, file, bundle] of ICONS) {
  const base64 = readFileSync(
    new URL(`../src/assets/${file}`, import.meta.url),
  ).toString("base64");
  out += `\n/** ${bundle} */\nexport const ${name} =\n  "data:image/png;base64,${base64}";\n`;
}

writeFileSync(new URL("../src/assets/icons.ts", import.meta.url), out);
console.log(`generated src/assets/icons.ts from ${ICONS.length} PNGs`);
