import { useContext } from "react";
import { cartActionType } from "../reducers/CartReducer";
import { CartItem } from "../types/CartItem";
import CartContext from "../contexts/CartContext";
import { Product } from "../types/Product";
import { useNavigate } from "react-router";
import "../styles/pages/Cart.css"

export const Cart = () => {
  const { cart, cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const handleChangeQuantity = (product: Product, quantity: number) => {
    cartDispatch({
      type: cartActionType.CHANGE_QUANTITY,
      payload: { product, quantity },
    });
  };

  const handleRemoveFromCart = (product: Product) => {
    cartDispatch({
      type: cartActionType.REMOVE_ITEM,
      payload: product,
    });
  };

  const handleResetCart = () => {
    cartDispatch({
      type: cartActionType.RESET_CART,
      payload: null,
    });
  };

  const totalSum = cart.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.quantity, 0)


  return (
    <div className="cart-page">
      <h2>Cart</h2>
      {cart.map((cartItem: CartItem) => (
        <div key={cartItem.product.id} className="cart-wrapper">
          <p className="product-name">{cartItem.product.name}</p>
          <div className="cart-item">
            <button
              onClick={() =>
                cartItem.product.id !== null &&
                handleChangeQuantity(cartItem.product, -1)
              }
            >
              -
            </button>
            <p>x {cartItem.quantity}</p>
            <button
              onClick={() =>
                cartItem.product.id !== null &&
                handleChangeQuantity(cartItem.product, 1)
              }
            >
              +
            </button>
            <p>{cartItem.product.price} kr</p>
            <button
              onClick={() =>
                handleRemoveFromCart(cartItem.product)
              }
              className="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-wrapper">
        <h4>Bag total</h4>
        {totalSum === 0 ? <p>Your bag is empty</p> : <h4>{totalSum} kr</h4>}

      </div>
      <button className="reset-button" onClick={handleResetCart}>Reset Cart</button>
      <div>
        <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
      </div>
    </div>
  );
};
