import React, { useState, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web";
import HeroImg1 from "../../assets/img/hero-img1.jpg";
import HeroImg2 from "../../assets/img/hero-img2.jpg";
import HeroImg3 from "../../assets/img/hero-img3.jpg";
import HeroImg4 from "../../assets/img/hero-img4.jpg";

const HeroSection = () => {
    const images = [HeroImg1, HeroImg2, HeroImg3, HeroImg4];
    const [index, setIndex] = useState(0);

    const transitions = useTransition(index, {
        keys: index,
        from: { transform: "translateX(100%)" },
        enter: { transform: "translateX(0%)" },
        leave: { transform: "translateX(-100%)" },
        config: { tension: 220, friction: 30 }, // Adjust easing dynamics
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 4000); // 4 seconds

        return () => clearInterval(interval);
    }, [images.length]); // Added images.length to the dependency array

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {transitions((style, i) => (
                <animated.div
                    className="absolute w-full h-full"
                    style={{
                        ...style,
                        backgroundImage: `url(${images[i]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            ))}

            {/* Content */}
            {/* <main className="absolute top-0 left-0 w-full h-full flex flex-col justify-center z-10 px-10 lg:px-24 text-left">
                <div>
                    <h2 className="text-2xl text-white">Laptops / Desktops</h2>
                </div>
                <p className="mt-3 text-white sm:mt-5 sm:max-w-xl text-6xl">New Year Offers</p>
                <p className="mt-3 text-white sm:mt-5 sm:max-w-xl text-2xl">
                    HP / ASUS / LENOVO / DELL / MSI / APPLE
                </p>
                <button className="border rounded mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black w-44 h-12">
                    Shop Now
                </button>
            </main> */}
        </div>
    );
};

export default HeroSection;
