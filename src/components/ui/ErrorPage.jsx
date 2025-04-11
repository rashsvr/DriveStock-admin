import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../../animations/Error.json';

const ErrorPage = ({ message = 'Something went wrong', code = 500, redirectUrl }) => {
  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 text-center">
        <div className="card-body">
          <Lottie animationData={errorAnimation} loop={true} className="w-48 mx-auto" />
          <h2 className="text-2xl font-bold">Error {code}</h2>
          <p className="mt-2">{message}</p>
          {redirectUrl && (
            <p className="mt-4">
              Redirecting in 3 seconds... or{' '}
              <a href={redirectUrl} className="link link-primary">
                click here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;