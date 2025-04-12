import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from './PageContainer';

const ErrorPage = ({ message = 'An error occurred', code = 500, redirectUrl }) => {
  return (
    <PageContainer title={`Error ${code}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-red-500 mb-4">{message}</h3>
        {redirectUrl ? (
          <p className="text-white">
            <a href={redirectUrl} className="text-highlight-blue underline">
              Go to the correct site
            </a>
          </p>
        ) : (
          <Link to="/dashboard" className="btn btn-primary mt-4">
            Back to Dashboard
          </Link>
        )}
      </div>
    </PageContainer>
  );
};

export default ErrorPage;