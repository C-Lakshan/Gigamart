import React from "react";
import Section_Heading from "./SectionsHeading/SectionHeading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./NewArrivals.css";

// --- Simple Card Component ---
const Card = ({ title, imagePath }) => {
  return (
    <div className="card">
      <img src={imagePath} alt={title} className="card-img" />
      <h3 className="card-title">{title}</h3>
    </div>
  );
};


// --- Items Data ---
const items = [
  {
    title: "Asus ROG Strix G16 G614JIR- i9",
    imagePath: require("../../assets/img/Asus ROG Strix G16 G614JIR- i9.webp"),
  },
  {
    title: "Lenovo IdeaPad Slim 3 15IRH8 – i7",
    imagePath: require("../../assets/img/Lenovo IdeaPad Slim 3 15IRH8 – i7.webp"),
  },
  {
    title: "Hp Victus fb2132Ax Gaming – Ryzen 7",
    imagePath: require("../../assets/img/Hp Victus fb2132Ax Gaming – Ryzen 7.jpg"),
  },
  {
    title: "Lenovo IdeaPad Slim 3 15IRH8 – i5",
    imagePath: require("../../assets/img/Lenovo IdeaPad Slim 3 15IRH8 – i5.webp"),
  },
  {
    title: "Lenovo IdeaPad 1 15IGL7 – Intel Celeron",
    imagePath: require("../../assets/img/Lenovo IdeaPad 1 15IGL7 – Intel Celeron.webp"),
  },
  {
    title: "Asus TUF A15 Gaming FA507NUR – Ryzen 7",
    imagePath: require("../../assets/img/Asus TUF A15 Gaming FA507NUR – Ryzen 7.jpg"),
  },
  {
    title: "Asus Vivobook Pro 15 Creator Q543MJ – Ultra9",
    imagePath: require("../../assets/img/Asus Vivobook Pro 15 Creator Q543MJ – Ultra9.webp"),
  },
  {
    title: "Lenovo Legion 9 Gaming 16IRX9 – i9",
    imagePath: require("../../assets/img/Lenovo Legion 9 Gaming 16IRX9 – i9.jpg"),
  },
  {
    title: "HP 15 fd0333TU – i5",
    imagePath: require("../../assets/img/HP 15 fd0333TU – i5.webp"),
  },
];

const NewArrivals = () => {
  // Updated slider settings to show 5 products at a time with manual scroll support.
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    arrows: true, // Show navigation arrows
    dots: false,  // Hide dots
    slidesToShow: 5, // Show 5 products at a time on desktop
    slidesToScroll: 1,
    // Enable manual scrolling via drag/swipe
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1200, // Slightly smaller screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900, // Tablet view
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // Mobile view
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Smaller mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-12">
    <>
      <Section_Heading title="Featured Products" />
      <div className="new-arrivals-slider">
        <Slider {...settings}>
          {items.map((item, index) => (
            <div key={index} className="slider-item">
              <Card title={item.title} imagePath={item.imagePath} />
            </div>
          ))}
        </Slider>
      </div>
    </>
    </div>
    
  );
};

export default NewArrivals;
