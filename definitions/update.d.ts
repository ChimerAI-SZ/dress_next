export interface TypesClothingProps {
    onParamsUpdate: (newParams: {
      loadOriginalImage?: string | undefined;
      loadPrintingImage?: string | undefined;
      backgroundColor?: string | undefined;
      text?: string | undefined;
      loadFabricImage?: string | undefined;
    }) => void;
    flied?: string | undefined;
  }

  export interface Params {
    loadOriginalImage?: string;
    loadPrintingImage?: string;
    backgroundColor?: string;
    text?: string;
    loadFabricImage?: string;
    [key: string]: string | undefined;
  }
  