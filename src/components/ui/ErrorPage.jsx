import React from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../../animations/Error.json'; // adjust the path as needed

function ErrorPage({ message = "Something went wrong.", code = 404 }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-bluish-black text-white px-4 text-center overflow-hidden">
      <div className="w-60 sm:w-72 md:w-60 lg:w-60 mb-4">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-highlight-orange mb-1">{code}</h1>
      <p className="text-base sm:text-lg md:text-xl mb-4 px-2">{message}</p>
      <a
        href="/"
        className="px-5 py-2  bg-highlight-orange text-white rounded-xl shadow-md hover:bg-orange-700 transition text-sm sm:text-base"
      >
        Go Home
      </a>
    </div>
  );
}

export default ErrorPage;
