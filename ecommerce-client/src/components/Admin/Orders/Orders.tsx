import { useContext, useEffect } from "react";
import { Link } from "react-router";
import OrderContext from "../../../contexts/OrderContext";
import { useOrders } from "../../../hooks/useOrders";
import { OrderActionType } from "../../../reducers/OrderReducer";

export const Orders = () => {
  const { orders, dispatch } = useContext(OrderContext)
  const { fetchOrdersHandler } = useOrders();

  useEffect(() => {
    const getData = async () => {
      const data = await fetchOrdersHandler();
      console.log(data);
      dispatch({
        type: OrderActionType.ORDERS_LOADED,
        payload: JSON.stringify(data),
      });
    };
    if (orders.length > 0) return;
    getData();
  });

  return (
    <div className="order-container">
      {orders.map((order) => (
        <Link to={`/admin/order/${order.id}`} key={order.id}>
          <div className="order-card">
            <p>Order ID: {order.id}</p>
            <p>Order Status: {order.order_status}</p>
            <p>Payment ID: {order.payment_id}</p>
            <p>Payment Status: {order.payment_status}</p>
            <p>Created at: {order.created_at}</p>
            <p>Total Price: {order.total_price} :-</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
