import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import getApi from '../utility/api';

interface transactions {
    id: number;
    status: string;
    total_amount: number;
}

const UserOrder = () => {
    const [transactions, setTransactions] = useState<transactions[]>([]);
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

        fetchTransactions();
    }, [userData]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/transactions/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`
                }
            });

            setTransactions(response.data.data.transactions);
        } catch (error: any) {
            console.error('Error fetching transactions:', error.message);
        }
    };

    const handleCancel = async (transactionId: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to cancel this transaction.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`${apiBaseUrl}/transactions/cancel/${transactionId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${userAccessToken}`
                    }
                });

                Swal.fire({
                    title: 'Cancelled!',
                    text: 'The transaction has been cancelled.',
                    icon: 'success'
                });

                fetchTransactions();
            } catch (error: any) {
                console.error('Error cancelling transaction:', error.message);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while cancelling the transaction. Please try again later.',
                    icon: 'error'
                });
            }
        }
    };
    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
                {transactions.map((transaction, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                <div className="text-gray-700 text-sm font-bold mb-1">Order ID:</div>
                                <div className="text-lg text-gray-900">{transaction.id}</div>
                            </div>
                            <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                <div className="text-gray-700 text-sm font-bold mb-1">Status:</div>
                                <div className="text-lg text-gray-900">{transaction.status}</div>
                            </div>
                            <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                <div className="text-gray-700 text-sm font-bold mb-1">Total Amount:</div>
                                <div className="text-lg text-gray-900">Rp. {transaction.total_amount}</div>
                            </div>
                            {transaction.status === 'pending' && (
                                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                    <button
                                        onClick={() => handleCancel(transaction.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                            <div className="w-full sm:w-auto">
                                <Link
                                    to={`/userorderdetail/${transaction.id}`}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrder;
