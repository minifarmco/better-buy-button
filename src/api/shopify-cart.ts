import Client from "shopify-buy";
import Cookies from "js-cookie";
import {
  SHOPIFY_CHECKOUT_ID_COOKIE,
  UTM_PARAMS_MEMORY,
  SHOPIFY_DOMAIN,
  SHOPIFY_TOKEN,
} from "./constants";
import type { InitiateCheckoutType } from "./data-gov/models";
import { extractCheckoutIdFromWebUrl } from "./helpers";
import { trackEvent } from "./mixpanel";

const initNewCheckout = async () => {
  // Initiate the cart with a checkoutId
  console.log("initNewCheckout...");
  const checkoutId = await window.shopifyClient.checkout
    .create()
    .then((checkout: any) => {
      return checkout.id;
    });
  window.checkoutId = checkoutId;
  console.log("checkoutId: ", checkoutId);
  Cookies.set(SHOPIFY_CHECKOUT_ID_COOKIE, checkoutId);
  window.checkoutId = checkoutId;
  initCartItems();
};

export const checkExistingShopifyClient = async () => {
  console.log("checkExistingShopifyClient...");
  // look for existing checkout in cookies
  const existingCheckoutId = Cookies.get(SHOPIFY_CHECKOUT_ID_COOKIE);
  console.log("existingCheckoutId: ", existingCheckoutId);
  if (existingCheckoutId) {
    // check if this checkout is already completed
    console.log("checking if checkout is already completed...");
    const existingCheckout = await window.shopifyClient.checkout
      .fetch(existingCheckoutId)
      .then((checkout: any) => {
        // Do something with the checkout
        return checkout;
      });
    console.log("existing order status url:", existingCheckout.orderStatusUrl);
    if (existingCheckout.orderStatusUrl) {
      // Initiate the cart with a checkoutId
      console.log("found existing order status url");
      initNewCheckout();
    } else {
      console.log("no existing order status url");
      window.checkoutId = existingCheckoutId;
    }
  } else {
    // Initiate the cart with a checkoutId
    initNewCheckout();
  }
};

export const initiateShopifyCart = async () => {
  console.log("Initiating new Shopify Checkout...");
  if (!window.shopifyClient) {
    console.log("Initiating new Shopify Checkout...");
    // Initializing the Shopify client
    const client = await Client.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: SHOPIFY_TOKEN,
    });
    window.shopifyClient = client;
    checkExistingShopifyClient();
  } else {
    console.error("window.shopifyClient was found");
    checkExistingShopifyClient();
  }
};

export const redirectToCheckout = (checkoutId: string) => {
  window.shopifyClient.checkout.fetch(checkoutId).then((checkout: any) => {
    const checkoutId = Cookies.get(SHOPIFY_CHECKOUT_ID_COOKIE);
    // save cookie utm_params + checkoutId to external database
    const currentUtmMemoryString: any = Cookies.get(UTM_PARAMS_MEMORY) || {};
    const currentUtmMemory = JSON.parse(currentUtmMemoryString);

    const urlPersistentCheckoutId = extractCheckoutIdFromWebUrl(
      checkout.webUrl
    );
    let params: any = {};
    const timestamp = new Date().getTime();
    Object.keys(currentUtmMemory).forEach((k) => {
      params[`${timestamp}_${k}`] = currentUtmMemory[k];
      params[`latest_${k}`] = currentUtmMemory[k];
    });
    params[`checkoutId`] = checkoutId;
    params[`checkoutUrlId`] = urlPersistentCheckoutId;
    window.addToFirestore({ id: urlPersistentCheckoutId, params });

    const event: InitiateCheckoutType = {
      eventName: "InitiateCheckout",
      data: {
        initiateCheckoutValue: Number(checkout.totalPrice),
      },
    };
    trackEvent(event);

    const webUrl = checkout.webUrl;
    const newTab = window.open(webUrl, "_blank");

    if (!newTab) {
      window.location.href = webUrl;
    }
  });
};

export const getCartContents = async () => {
  const checkoutId = Cookies.get(SHOPIFY_CHECKOUT_ID_COOKIE);
  return window.shopifyClient.checkout
    .fetch(checkoutId)
    .then((checkout: any) => {
      // Do something with the checkout
      return checkout.lineItems;
    });
};

export const initCartItems = async () => {
  const cartItems = await getCartContents();
  console.log("cartItems");
  console.log(cartItems);
  window.updateCartItems(cartItems);
};

const fetchNextPage = async (
  prevSet: Array<any>,
  cumulativeSet: Array<any>
): Promise<any> => {
  const nextSet = await window.shopifyClient
    .fetchNextPage(prevSet)
    .then((data: any) => {
      return data.model;
    });
  const updatedCumulativeSet = [...cumulativeSet, ...nextSet];
  if (nextSet.length > 0) {
    return fetchNextPage(nextSet, updatedCumulativeSet);
  }
  return updatedCumulativeSet;
};

export const fetchAllProducts = async () => {
  const allProducts = await window.shopifyClient.product
    .fetchAll()
    .then((products: any) => {
      return fetchNextPage(products, products);
    });
  console.log("fetchAllProducts");
  console.log(allProducts);
  return allProducts;
};
