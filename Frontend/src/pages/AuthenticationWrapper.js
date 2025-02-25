import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "../components/Navigation/Navigation";
import Spinner from "../components/Spinner/Spinner";
import BckgImage from "../assets/img/bg-2.png";
import VideoSource from "../assets/vedio/type.mp4";

const AuthenticationWrapper = () => {
  const isLoading = useSelector((state) => state?.commonState?.loading);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-100 to-purple-400">
      <Navigation variant="auth" />

      {/* Main Container */}
      <div className="flex items-center justify-center h-full w-full p-4 md:p-12">
        {/* Authentication Card */}
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden h-[600px]">
          {/* Left Side - Authentication Form */}
          <div className="w-full md:w-1/2  flex flex-col justify-center items-center h-full">
            <Outlet />
          </div>

          {/* Right Side - Video Background */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-100 h-full">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            >
              <source src={VideoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>


      {/* Full-Screen Spinner */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default AuthenticationWrapper;
