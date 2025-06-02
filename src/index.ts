// @ts-nocheck
import Blits from "@lightningjs/blits";
import App from "./App";

const appWidth = window.innerWidth;
const appHeight = window.innerHeight;

const appInstance = Blits.Launch(App, "app", {
  w: appWidth,
  h: appHeight,
  debugLevel: 1,
  inspector: true,
  defaultFont: "lato",
  fontScale: 0.5,

  // ✅ VOLVER A MSDF PERO CON CONFIGURACIÓN ESPECÍFICA
  fonts: [
    {
      family: "lato",
      type: "msdf", // Volver a MSDF
      file: "fonts/Lato-Regular.ttf",
    },
    {
      family: "raleway",
      type: "msdf",
      file: "fonts/Raleway-ExtraBold.ttf",
    },
    {
      family: "opensans",
      type: "msdf",
      file: "fonts/OpenSans-Medium.ttf",
    },
  ],
});

// @ts-ignore
window.APP = appInstance;

