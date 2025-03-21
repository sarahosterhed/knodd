import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react"
import { Customer } from "../../types/Customer";
import { useCustomers } from "../../hooks/useCustomers";
import CheckoutContext from "../../contexts/CheckoutContext";
import { CheckoutActionType } from "../../reducers/CheckoutReducer";
import { useOrders } from "../../hooks/useOrders";
import { getFromLocalStorage, saveTolocalStorage } from "../../utils/localStorageUtils";

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
    const { dispatch } = useContext(CheckoutContext)
    const { fetchCustomerByEmailHandler, createCustomerHandler } = useCustomers();
    const { createOrderHandler, prepareOrderHandler } = useOrders();

    useEffect(() => {
        saveTolocalStorage("customerInput", customerInput);
    }, [customerInput]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { type, name, value } = e.target;
        if (type !== "tel") {
            setCustomerInput({ ...customerInput, [name]: value })
        } else {
            setCustomerInput({ ...customerInput, [name]: +value })
        }
        console.log("Customer Input", customerInput)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const customer = await fetchCustomerByEmailHandler(customerInput.email);

        if (customer !== null) {
            const { id } = customer;
            const newOrder = prepareOrderHandler(id);
            const orderResponse = await createOrderHandler(newOrder);
            console.log("create order response", orderResponse)
        } else {
            const { id } = await createCustomerHandler(customerInput);
            const newOrder = prepareOrderHandler(id)
            const orderResponse = await createOrderHandler(newOrder);
            console.log("create order response", orderResponse)
        }

        dispatch({
            type: CheckoutActionType.CHANGE_STAGE,
            payload: 2
        })
        localStorage.removeItem('customerInput');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstname" onChange={(e) => handleChange(e)} value={customerInput.firstname} />
            <input type="text" name="lastname" onChange={(e) => handleChange(e)} value={customerInput.lastname} />
            <input type="email" name="email" onChange={(e) => handleChange(e)} value={customerInput.email} />
            <input type="password" name="password" onChange={(e) => handleChange(e)} value={customerInput.password} />
            <input type="tel" name="phone" onChange={(e) => handleChange(e)} value={customerInput.phone} />
            <input type="text" name="street_address" onChange={(e) => handleChange(e)} value={customerInput.street_address} />
            <input type="text" name="postal_code" pattern="[0-9]{5}" onChange={(e) => handleChange(e)} value={customerInput.postal_code} />
            <input type="text" name="city" onChange={(e) => handleChange(e)} value={customerInput.city} />
            <input type="text" name="country" onChange={(e) => handleChange(e)} value={customerInput.country} />

            <button type="submit">Go to payment</button>
        </form>
    )
}
