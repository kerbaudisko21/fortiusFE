import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import getApi from '../utility/api';

const AddProduct = () => {
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
        if (!userData || userData.role != 'admin') {
            navigate('/login');
        }
    }, [userData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !price || !description || !image) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/addproduct`, {
                name: name,
                description: description,
                price: price,
                image: image
            }, {
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Product has been created!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '/';
                });
            }
        } catch (error) {
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-xl w-full bg-white shadow-md p-8 rounded-md">
                <h2 className="text-2xl font-bold mb-6">Add Product</h2>
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
                    <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
