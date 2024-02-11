import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import getApi from '../utility/api';

interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userAccessToken = userData ? userData.access_token : null;
    const userId = userData ? userData.user.id : null;
    let apiBaseUrl = getApi();

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(storedCartItems);
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const increaseQuantity = (index: number) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += 1;
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (index: number) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            updatedCart.splice(index, 1);
        }
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const checkout = () => {
        const totalAmount = calculateSubtotal();

        axios.post(`${apiBaseUrl}/checkout`, { userId, totalAmount, cartItems }, {
            headers: {
                'Authorization': `Bearer ${userAccessToken}`
            }
        })
            .then(() => {
                setCartItems([]);
                localStorage.removeItem('cartItems');
                alert('Checkout successful. Thank you for your purchase!');
            })
            .catch(() => {
                alert('An error occurred during checkout. Please try again later.');
            });
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cartItems.map((item, index) => (
                            <div key={index} className="border p-4">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-500">Price: Rp. {item.price}</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => decreaseQuantity(index)}
                                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(index)}
                                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-lg">Subtotal:</span>
                            <span className="text-lg">Rp. {calculateSubtotal()}</span>
                        </div>
                        <button
                            onClick={checkout}
                            className="mt-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
