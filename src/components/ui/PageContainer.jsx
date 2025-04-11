import React from "react";
import Alert from "./Alert"; // Adjust the import path if necessary

const PageContainer = ({ title, alert, children }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      {title && (
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
          {title}
        </h2>
      )}

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={alert.onClose}
        />
      )}

      <div className="mt-4">{children}</div>
    </div>
  );
};

export default PageContainer;
