const fonts = [
  new FontFace('Material Symbols Outlined', 'url("./assets/fonts/Material-Symbols/Material-Symbols-Outlined.woff2")'),
  new FontFace('Material Symbols Rounded', 'url("./assets/fonts/Material-Symbols/Material-Symbols-Rounded.woff2")'),
  new FontFace('Material Symbols Sharp', 'url("./assets/fonts/Material-Symbols/Material-Symbols-Sharp.woff2")'),
];

async function preloadMSFonts() {
  Promise.all(fonts).then((fonts) => {
    fonts.forEach((font) => document.fonts.add(font));
  });
}

export default preloadMSFonts;
