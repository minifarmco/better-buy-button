export interface UtmParamsType {
  utm_alias?: string;
  utm_source?: string;
  utm_content?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
}

export interface ClassicEventType {
  eventName: string;
}
export interface AddToCartType extends UtmParamsType, ClassicEventType {
  data: {
    shopifyCheckoutId?: string;
    shopifyItemId: string;
    shopifyItemSku: string;
    shopifyItemTitle: string;
    addToCartValue: number;
  };
}

export interface InitiateCheckoutType extends UtmParamsType, ClassicEventType {
  data: {
    shopifyCheckoutId?: string;
    initiateCheckoutValue: number;
  };
}

export interface PurchasedCartType extends UtmParamsType, ClassicEventType {
  data: {
    shopifyCheckoutId?: string;
    shopifyCheckoutUrlId: string;
    event: string;
    purchasedCartValue: string;
  };
}

export interface PurchasedLineItemType extends UtmParamsType, ClassicEventType {
  data: {
    shopifyCheckoutId?: string;
    shopifyCheckoutUrlId: string;
    shopifyItemId: string;
    shopifyItemSku: string;
    shopifyItemTitle: string;
    addToCartValue: number;
  };
}
