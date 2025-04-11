// LoadingAnimation.jsx
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../animations/loading.json"; // Your Lottie JSON file

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-32 h-32 md:w-48 md:h-48">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;