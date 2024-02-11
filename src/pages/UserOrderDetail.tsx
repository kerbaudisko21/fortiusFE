import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import getApi from '../utility/api';

const UserOrderDetail = () => {
    const [orderDetail, setOrderDetail] = useState(null);
    let { transactionId } = useParams();
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userId = userData ? userData.user.id : null;
    const userAccessToken = userData ? userData.access_token : null;
    const navigate = useNavigate();
    let apiBaseUrl = getApi();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }

        fetchOrderDetail();
    }, [userData]);

    const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/v1/transactions/detail/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`
                }
            });
            setOrderDetail(response.data.data.transaction_items);
        } catch (error: any) {
            console.error('Error fetching order detail:', error.message);
        }
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Order Detail</h1>
                    <button
                        onClick={handleGoBack}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Go Back
                    </button>
                </div>
                {orderDetail ? (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Items:</label>
                        <ul className="divide-y divide-gray-200">
                            {orderDetail && orderDetail.length > 0 ? (
                                orderDetail.map((item, index) => (
                                    <li key={index} className="py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.product_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.quantity} x Rp. {item.price}
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="py-2">No items found</li>
                            )}
                        </ul>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default UserOrderDetail;
