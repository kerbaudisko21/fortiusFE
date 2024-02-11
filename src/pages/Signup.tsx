import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import getApi from '../utility/api';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { loading, error, dispatch } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreeTerms(event.target.checked);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'REGIS_START' });
        let apiBaseUrl = getApi();

        try {
            let response = await axios.post(
                `${apiBaseUrl}/api/v1/register`,
                {
                    username: username,
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
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User has been created!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                dispatch({ type: 'REGIS_FAILURE' });
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('Error registering user. Please try again.');
            }
            dispatch({ type: 'REGIS_FAILURE' });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-customPurple">
            <div className="bg-white p-8 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold text-center text-customPurple mb-6">Sign Up</h2>
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
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
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={agreeTerms}
                                onChange={handleTermsChange}
                            />
                            <span className="ml-2 text-sm text-gray-600">I agree to the <a href="#" className="text-purple-500">terms and conditions</a></span>
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
