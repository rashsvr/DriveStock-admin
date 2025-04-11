import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingAnimation from './LoadingAnimation';

export const LoadingWrapper = ({ children }) => { // Named export
  const location = useLocation();
  const [isNavLoading, setIsNavLoading] = useState(false);

  useEffect(() => {
    setIsNavLoading(true);
    const timer = setTimeout(() => {
      setIsNavLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isNavLoading && <LoadingAnimation />}
      {children}
    </>
  );
};