export const SHOPIFY_CHECKOUT_ID_COOKIE = "shopifyCheckoutId_customCode";
export const UTM_PARAMS_MEMORY = "customBuyButton_utmParamsMemory";

export const SHOPIFY_DOMAIN = "mini-farm-usa.myshopify.com";
export const SHOPIFY_TOKEN = "517f81f798b0f394623272bbaf48aa09";

export const MIXPANEL_TOKEN = "ebc25be969ed7210cc25900815b1a2c1";

export const FIRESTORE_COLLECTION = "cartSessions";

export const LOADING_GIF_URL =
  "https://firebasestorage.googleapis.com/v0/b/mini-farm-storefront.appspot.com/o/Minifarm-ShopifyBuyJS%2Fe859db25667cf619a3952ca06cbb2627.gif?alt=media&token=a9372d89-bf24-42cc-b87e-e469de620ac6";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDoDBMNwHDwFM0fDNTac8EzjrAeBL3HgRU",
  authDomain: "mini-farm-storefront.firebaseapp.com",
  projectId: "mini-farm-storefront",
  storageBucket: "mini-farm-storefront.appspot.com",
  messagingSenderId: "261057012400",
  appId: "1:261057012400:web:9b690c1205c7ec88731175",
  measurementId: "G-Z9DNLWT1RR",
};

export type ProductType = {
  id: string;
  title: string;
  variants: Array<any>;
  images: Array<any>;
  descriptionHtml: string;
};
export const emptyProduct: ProductType = {
  id: "",
  title: "",
  variants: [],
  images: [],
  descriptionHtml: "",
};

declare global {
  interface Window {
    shopifyClient: any;
    checkoutId: string;
    addToFirestore: any;
    getFromFirestore: any;
    firestore: any;
    updateCartItems: Function;
    toggleCartVisibility: Function;
    mixpanel: any;
    fbq: any;
  }
}

window.shopifyClient = window.shopifyClient || null;
window.checkoutId = window.checkoutId || "";
window.addToFirestore = window.addToFirestore || {};
window.getFromFirestore = window.getFromFirestore || {};
window.firestore = window.firestore || {};
window.updateCartItems = window.updateCartItems || [];
window.toggleCartVisibility = window.toggleCartVisibility || [];
window.fbq = window.fbq || null;
window.mixpanel = window.mixpanel || {};

export const typesWorkaround = "";

export const COLORS = {
  green: "#4BB00D",
};
