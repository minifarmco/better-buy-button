import React from "react";
import Cookies from "js-cookie";
import { COLORS, SHOPIFY_CHECKOUT_ID_COOKIE } from "../../api/constants";
import { getCartContents } from "../../api/shopify-cart";
import { trackEvent } from "../../api/mixpanel";
import { AddToCartType } from "../../api/data-gov/models";

const VariantPicker = ({
  product,
  chosenVariant,
  quantity,
  setQuantity,
  setChosenVariant,
  showPrice,
  hideSingleDropdown,
  showQuantityInput,
}: {
  product: any;
  chosenVariant: any;
  quantity: number;
  setQuantity: Function;
  setChosenVariant: Function;
  showPrice?: Boolean;
  hideSingleDropdown?: Boolean;
  showQuantityInput?: Boolean;
}) => {
  const handleMenuClick = (e: any) => {
    const variant = product.variants.find((v: any) => v.id === e.target.value);
    setChosenVariant(variant);
  };

  const updateQuantity = (e: any) => {
    setQuantity(e.target.value);
  };

  const addToCart = (variant: any) => async () => {
    window.toggleCartVisibility(true);
    const lineItemsToAdd = [
      {
        variantId: variant.id,
        quantity: Number(quantity),
      },
    ];
    const checkoutId = Cookies.get(SHOPIFY_CHECKOUT_ID_COOKIE);
    const event: AddToCartType = {
      eventName: "AddToCart",
      data: {
        addToCartValue: Number(variant.price),
        shopifyItemTitle: variant.title,
        shopifyItemSku: variant.sku,
        shopifyItemId: variant.id,
        shopifyCheckoutId: checkoutId,
      },
    };
    trackEvent(event);
    await window.shopifyClient.checkout.addLineItems(
      window.checkoutId,
      lineItemsToAdd
    );
    const cartItems = await getCartContents();
    window.updateCartItems(cartItems);
    setTimeout(() => {
      setQuantity(1);
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {hideSingleDropdown && product.variants.length === 1 ? null : (
        <select
          id="select-variant"
          value={chosenVariant ? chosenVariant.id : ""}
          onChange={handleMenuClick}
          style={{
            height: "40px",
            fontSize: "0.9em",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            textOverflow: "ellipsis",
          }}
        >
          {product.variants.map((v: any, i: number) => (
            <option
              key={i}
              value={v.id}
              style={{
                height: "40px",
                fontSize: "1em",
                padding: "10px",
                width: "100%",
              }}
            >
              {v.title === "Default Title" ? product.title : v.title}
            </option>
          ))}
        </select>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "5px",
          alignItems: "stretch",
        }}
      >
        {showQuantityInput ? (
          <input
            value={quantity}
            onChange={updateQuantity}
            style={{
              width: "50px",
              height: "40px",
              maxHeight: "40px",
              minHeight: "40px",
              textAlign: "center",
              borderRadius: "5px 0px 0px 5px",
              marginRight: "-5px",
              border: `2px solid ${COLORS.green}`,
            }}
          />
        ) : null}

        <button
          onClick={addToCart(chosenVariant)}
          style={{
            flex: 1,
            minHeight: "40px",
            color: "white",
            backgroundColor: COLORS.green,
            fontWeight: "bold",
            fontSize: "1em",
            borderRadius: showQuantityInput ? "0px 5px 5px 0px" : "5px",
            border: `2px solid ${COLORS.green}`,
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

VariantPicker.defaultProps = {
  showPrice: true,
};

export default VariantPicker;
