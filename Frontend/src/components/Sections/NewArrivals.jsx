import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section_Heading from "./SectionsHeading/SectionHeading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./NewArrivals.css";

// --- Simple Card Component ---
const Card = ({ name, thumbnail, slug }) => {
  return (
    <div className="card">
      <Link to={`/product/${slug}`}>
        <img src={thumbnail} alt={name} className="card-img" />
        <h3 className="card-title">{name}</h3>
      </Link>
    </div>
  );
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        const newArrivals = data.filter((product) => product.newArrival);
        setProducts(newArrivals);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    arrows: true,
    dots: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="mt-12">
      <Section_Heading title="Featured Products" />
      <div className="new-arrivals-slider">
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="slider-item">
              <Card name={product.name} thumbnail={product.thumbnail} slug={product.slug} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewArrivals;
