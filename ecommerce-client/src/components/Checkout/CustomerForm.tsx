import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react"
import { Customer } from "../../types/Customer";
import { useCustomers } from "../../hooks/useCustomers";
import { useOrders } from "../../hooks/useOrders";
import { getFromLocalStorage, saveTolocalStorage } from "../../utils/localStorageUtils";
import { useCheckout } from "../../hooks/useCheckout";
import CheckoutContext from "../../contexts/CheckoutContext";
import { CheckoutActionType } from "../../reducers/CheckoutReducer";
import { getClientSecret } from "../../services/checkoutService";

export const CustomerForm = () => {
    const storedCustomerInput = getFromLocalStorage('customerInput');
    const [customerInput, setCustomerInput] = useState<Customer>(storedCustomerInput || {
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        street_address: "",
        postal_code: "",
        city: "",
        country: "",
        created_at: ""
    });
    const { fetchCustomerByEmailHandler, createCustomerHandler, error } = useCustomers();
    const { checkoutDispatch } = useContext(CheckoutContext)
    const { createOrderHandler, prepareOrderHandler } = useOrders();
    const { prepareCheckoutPayloadHandler, checkoutCleanupHandler } = useCheckout();

    useEffect(() => {
        saveTolocalStorage("customerInput", customerInput);
    }, [customerInput]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInput({ ...customerInput, [name]: value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            let customer = await fetchCustomerByEmailHandler(customerInput.email);
            if (!customer) {
                customer = await createCustomerHandler(customerInput);
                if (!customer) return;
            }

            if (!customer) {
                console.error("Customer creation failed due to validation errors.");
                return;
            }

            const { id } = customer;
            const newOrder = prepareOrderHandler(id);
            const orderResponse = await createOrderHandler(newOrder);
            const orderId: number = orderResponse.id;
            const checkoutPayload = prepareCheckoutPayloadHandler(orderId, newOrder);
            const clientSecret = await getClientSecret(checkoutPayload);

            saveTolocalStorage("orderId", orderId);
            saveTolocalStorage("clientSecret", clientSecret);

            checkoutDispatch({
                type: CheckoutActionType.CHANGE_STAGE,
                payload: 2
            });
            checkoutCleanupHandler();

        } catch (error) {
            console.error("Checkout process failed:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="customer-form">
            <h2>Input Contact Details</h2>
            <input type="text" name="firstname" placeholder="First Name" onChange={(e) => handleChange(e)} value={customerInput.firstname} />
            <input type="text" name="lastname" placeholder="Last Name" onChange={(e) => handleChange(e)} value={customerInput.lastname} />
            <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e)} value={customerInput.email} />
            <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} value={customerInput.password} />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={(e) => handleChange(e)} value={customerInput.phone} />
            <input type="text" name="street_address" placeholder="Street Address" onChange={(e) => handleChange(e)} value={customerInput.street_address} />
            <input type="text" name="postal_code" placeholder="Postal Code" pattern="[0-9]{5}" onChange={(e) => handleChange(e)} value={customerInput.postal_code} />
            <input type="text" name="city" placeholder="City" onChange={(e) => handleChange(e)} value={customerInput.city} />
            <input type="text" name="country" placeholder="Country" onChange={(e) => handleChange(e)} value={customerInput.country} />

            {error && <p className="error-message">{error}</p>}


            <button className="submit-button" type="submit">Go to payment</button>
        </form>
    )
}
