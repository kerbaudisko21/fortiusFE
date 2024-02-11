import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import getApi from '../utility/api';

const UpdateProduct = () => {
    const { productId } = useParams<{ productId: string }>();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userAccessToken = userData ? userData.access_token : null;
    const navigate = useNavigate();
    let apiBaseUrl = getApi();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/v1/product/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${userAccessToken}`
                    }
                });

                const { name, price, description, image } = response.data.data.product;
                setName(name);
                setPrice(price);
                setDescription(description);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        if (!userData || userData.role != 'admin') {
            navigate('/login');
        }

        fetchProductData();
    }, [productId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !price || !description) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        try {
            let imageData: string | null = null;

            if (image) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    if (fileReader.result) {
                        imageData = fileReader.result.toString();
                        update(imageData);
                    }
                };
                fileReader.readAsDataURL(image);
            } else {
                update(null);
            }
        } catch (error) {
            setErrorMessage('Error updating product. Please try again later.');
        }
    };

    const update = async (imageData: string | null) => {
        try {
            const response = await axios.put(`${apiBaseUrl}/api/v1/product/update/${productId}`, {
                name: name,
                description: description,
                price: price,
                image: imageData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userAccessToken}`
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Product has been updated!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '/';
                });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setErrorMessage('Error updating product. Please try again later.');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-xl w-full bg-white shadow-md p-8 rounded-md">
                <h2 className="text-2xl font-bold mb-6">Update Product</h2>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-400 rounded-md px-4 py-2 w-full h-32 resize-none focus:outline-none focus:border-purple-500"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                        <input
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                            className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
