import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error, dispatch } = useContext(AuthContext);
    const [notification, setNotification] = useState<string | null>(null);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'LOGIN_START' });

        try {
            if (!isValidEmail(email)) {
                setNotification('Please enter a valid email address.');
                return;
            }

            let response = await axios.post(
                'http://localhost:8000/api/v1/login',
                {
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                window.location.href = '/';
            } else {
                setNotification('Login failed. Please check your credentials and try again.');
                dispatch({ type: 'LOGIN_FAILURE' });
            }
        } catch (err) {
            setNotification('Login failed. Please try again later.');
            dispatch({ type: 'LOGIN_FAILURE' });
        }
    }

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-customPurple">
            <div className="bg-white p-8 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold text-center text-customPurple mb-6">Login</h2>
                {notification && <div className="text-red-500 mb-4">{notification}</div>}
                <form onSubmit={handleLoginSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
