import { Params } from "@definitions/update";
import {
  dressVariation20PCT,
  dressPatternVariation,
  dressVariation50PCT,
  dressPrintingTryon,
  generatePrintingFromPrompt,
} from "@lib/request/generate"; // B1 全维度保持80%(77s)

export const workflow = async (p: Params) => {
  const {
    loadOriginalImage,
    loadPrintingImage,
    backgroundColor,
    text,
    loadFabricImage,
  } = p;
  console.log(
    loadPrintingImage,
    backgroundColor,
    text?.trim() === "",
    loadFabricImage,
    "jieguo",
    Boolean(
      loadPrintingImage &&
        backgroundColor === "#fdfdfb" &&
        text === "" &&
        !loadFabricImage
    )
  );
  if (
    loadPrintingImage &&
    backgroundColor === "#fdfdfb" &&
    !text &&
    !loadFabricImage
  ) {
    console.log(2);
  } else if (backgroundColor) {
    console.log(3);
  } else if (text) {
    console.log(4);
  } else if (loadFabricImage) {
    console.log(5);
  } else {
    console.log(1);
    // await dressVariation20PCT(p);
    // await dressPatternVariation(p);
    // await dressVariation50PCT(p);
    // await dressPrintingTryon(p);
  }
};
