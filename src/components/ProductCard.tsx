import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { useLocation } from 'react-router-dom';

interface ProductCardProps {
    product_id: number;
    name: string;
    price: number;
    description: string;
    imageSrc: string;
    onAddToCart: (item: { product_id: number, name: string; price: number; quantity: number }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product_id, name, price, description, imageSrc, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState('');
    const location = useLocation();

    const handleAddToCart = () => {
        const item = { product_id, name, price, quantity };
        onAddToCart(item);
        setQuantity(1);
        setNotification(`${quantity} ${name}(s) added to cart successfully!`);
        setTimeout(() => {
            setNotification('');
        }, 2000);
    };

    const isHomePage = location.pathname === '/';

    return (
        <div className="mx-2 md:mx-4">
            <Card placeholder={""} className="w-full rounded-md md:w-85 bg-customPurple2">
                <CardHeader placeholder={""} shadow={false} floated={false} className="h-60 md:h-72">
                    <img
                        src={imageSrc}
                        alt="card-image"
                        className="h-full w-full object-cover rounded-t-md"
                    />
                </CardHeader>
                <CardBody placeholder={""}>
                    <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                        <Typography placeholder={""} color="blue-gray" className="font-medium ml-4 mt-2 md:mb-0 md:mr-2 md:flex-1 truncate">
                            {name}
                        </Typography>
                        <Typography placeholder={""} color="blue-gray" className="font-medium ml-4 mt-2 md:mb-0 md:mr-2 md:flex-1 truncate">
                            Rp. {price}
                        </Typography>
                    </div>
                    <Typography
                        placeholder={""}
                        variant="small"
                        color="gray"
                        className="font-normal opacity-75 truncate ml-4 mb-3"
                    >
                        {description}
                    </Typography>
                </CardBody>
                {!isHomePage && (
                    <CardFooter placeholder={""} className="pt-4 flex justify-center">
                        <Button
                            onClick={handleAddToCart}
                            placeholder={""}
                            ripple={false}
                            fullWidth={true}
                            className="bg-purple-500 w-50 flex justify-center rounded-md text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 py-3"
                        >
                            Add To Cart
                        </Button>
                    </CardFooter>
                )}
            </Card>
            {notification && <div className="mt-2 text-green-600">{notification}</div>}
        </div>
    );
};

export default ProductCard;
