import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import getApi from '../utility/api';

interface Order {
    id: number;
    status: string;
}

const AdminOrder = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userAccessToken = userData ? userData.access_token : null;
    const navigate = useNavigate();
    let apiBaseUrl = getApi();

    useEffect(() => {
        if (userAccessToken) {
            fetchOrders();
        }

        if (!userData) {
            navigate('/login');
        }

    }, [userAccessToken]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`
                }
            });

            setOrders(response.data.data.transactions);
        } catch (error: any) {
            console.error('Error fetching orders:', error.message);
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(`${apiBaseUrl}/transactions/update_status/${orderId}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`
                }
            });

            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, status: newStatus };
                }
                return order;
            });
            setOrders(updatedOrders);
        } catch (error: any) {
            console.error('Error updating order status:', error.message);
        }
    };

    const handleDelete = async (orderId: number) => {
        try {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this order!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (confirmed.isConfirmed) {
                await axios.delete(`${apiBaseUrl}/transactions/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${userAccessToken}`
                    }
                });

                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);

                Swal.fire(
                    'Deleted!',
                    'Your order has been deleted.',
                    'success'
                );
            }
        } catch (error: any) {
            console.error('Error deleting order:', error.message);
            Swal.fire(
                'Error!',
                'Failed to delete the order.',
                'error'
            );
        }
    };



    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Admin Order List</h2>
            <table className="table-auto w-full border-collapse border border-gray-500">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-500 px-4 py-2">Order ID</th>
                        <th className="border border-gray-500 px-4 py-2">Status</th>
                        <th className="border border-gray-500 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td className="border border-gray-500 px-4 py-2">{order.id}</td>
                            <td className="border border-gray-500 px-4 py-2">{order.status}</td>
                            <td className="border border-gray-500 px-4 py-2">
                                {order.status !== 'cancelled' ? (
                                    <>
                                        {order.status === 'on progress' ? (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded mr-2"
                                            >
                                                Mark as Completed
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'on progress')}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded mr-2"
                                            >
                                                Mark as On Progress
                                            </button>
                                        )}
                                        <Link
                                            to={`/userorderdetail/${order.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded"
                                        >
                                            View Details
                                        </Link>
                                    </>
                                ) : (
                                    // Display delete button for cancelled orders
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default AdminOrder;
