import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import Swal from 'sweetalert2';
import getApi from '../utility/api';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

const AdminProduct = () => {
    const [products, setProducts] = useState<Product[]>([] as Product[]);
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userAccessToken = userData ? userData.access_token : null;
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

        if (!userData) {
            navigate('/login');
        } else {
            fetchProducts();
        }

    }, []);

    const handleDeleteProduct = async (productId: number) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this product!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });

            if (result.isConfirmed) {
                await axios.delete(`${apiBaseUrl}/api/v1/product/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${userAccessToken}`
                    }
                });

                Swal.fire('Deleted!', 'Your product has been deleted.', 'success').then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete the product.', 'error');
        }
    };

    const handleUpdateProduct = (productId: number) => {
        window.location.href = `/updateproduct/${productId}`;
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Admin Product List</h1>
            <div className="mb-4">
                <Link to="/addproduct">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Add Product
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="border border-gray-300 p-4 rounded-md">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-700">${product.price}</p>
                        <p className="text-gray-500">{product.description}</p>
                        <div className="flex mt-4">
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleUpdateProduct(product.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProduct;
