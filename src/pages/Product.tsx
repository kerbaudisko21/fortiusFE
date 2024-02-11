import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getApi from '../utility/api';

interface Product {
    productId: number;
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

const Product = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<{ product_id: number, name: string; price: number; quantity: number }[]>([]);
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const navigate = useNavigate();
    let apiBaseUrl = getApi();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/v1/products`);
                setProducts(response.data.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

        const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(storedCartItems);
    }, []);

    const addToCartFunction = (item: { product_id: number; name: string; price: number }) => {
        if (!userData) {
            navigate('/login');
        } else {
            const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);

            if (existingItemIndex !== -1) {
                const updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity += 1;
                setCartItems(updatedCartItems);
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            } else {
                setCartItems([...cartItems, { ...item, quantity: 1 }]);
                localStorage.setItem('cartItems', JSON.stringify([...cartItems, { ...item, quantity: 1 }]));
            }
        }

    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product_id={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        imageSrc={product.image}
                        onAddToCart={addToCartFunction}
                    />
                ))}
            </div>
        </div>
    );
}

export default Product;
