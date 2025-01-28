import React from 'react';
import vedioHero from "../../assets/vedio/vedioHero.mp4"; // Ensure the file path and extension are correct

const VideoSection = () => {
    return (
        <div className="relative w-full h-screen bg-black">
            <video 
                className="absolute top-0 left-0 w-full h-full object-cover" 
                autoPlay 
                loop 
                muted
            >
                <source src={vedioHero} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoSection;
