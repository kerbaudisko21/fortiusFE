import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import promotionBanner from '../assets/cake-promotion.jpg';
import ProductCard from '../components/ProductCard';
import axios from 'axios';


const Home = () => {
    const [products, setProducts] = useState([]);

    const sliderSettings = {
        infinite: false,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/products');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching best sellers:', error);
            }
        };

        fetchBestSellers();
    }, []);
    
    return (
        <div style={{ marginBottom: '50px' }}>
            <img src={promotionBanner} alt="Promotion Banner" style={{ width: '100%', height: 'auto', maxHeight: '550px' }} />

            <div>
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Our Products</h2>
                <Slider {...sliderSettings}>
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCard name={product.name} imageSrc={product.image} price={product.price} description={product.description} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Home;