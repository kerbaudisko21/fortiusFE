import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import "../App.css";
import { AuthContext } from '../Context/AuthContext';
import Swal from "sweetalert2";

interface NavItem {
    name: string;
    path: string;
}

interface NavBarProps {
    imageSrcPath: string;
    navItems: NavItem[];
}

function NavBar({ imageSrcPath, navItems }: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { state, dispatch } = useContext(AuthContext);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Successfully logout!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = '/';
        })
    };

    return (
        <nav className="bg-customPurple shadow-md">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={imageSrcPath}
                        width="35"
                        height="35"
                        className="inline-block align-center"
                        alt=""
                    />
                </Link>
                <div className="md:hidden">
                    <button
                        className="text-customGray focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-customGray"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <div className={`bg-customGray hidden md:flex space-x-4 ${isOpen ? 'justify-center' : 'justify-end'}`}>
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="font-semibold text-customGray"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden md:flex space-x-4 items-center">
                    {state.user ? (
                        <div className="relative">
                            {state.user.user.role == 'admin' ? (
                                <></>
                            ) : (
                                <Link to="/cart">Cart</Link>
                            )}
                            <span
                                className="cursor-pointer mx-2"
                                onClick={toggleMenu}
                            >
                                {state.user.user.username ?? null}
                                <div
                                    className={`absolute top-full right-0 mt-2 w-40 bg-white border rounded-md shadow-lg ${isOpen ? '' : 'hidden'}`}
                                >
                                    <Link
                                        to=""
                                        className="block px-4 py-2 text-customGray hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </span>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
            <div className={`bg-gray-100 border-t border-gray-200 md:hidden overflow-hidden transition-max-height duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="container mx-auto px-4 py-2 flex flex-col items-center justify-center space-y-2 h-full">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="font-semibold text-customGray"
                        >
                            {item.name}
                        </Link>
                    ))}
                    {!state.user ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    ) :
                        <>
                            {state.user.user.role == 'admin' ? (<> </>) : (<Link to="/cart">Cart</Link>)}
                            <Link to="">{state.user.user.username ?? null}</Link>
                        </>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
