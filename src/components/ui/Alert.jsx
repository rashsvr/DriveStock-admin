import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react"; // Install via `npm install lucide-react`

const Alert = ({ type = "error", message, onClose }) => {
  const alertStyles = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
  };

  const iconPaths = {
    success: (
      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
      </svg>
    ),
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <motion.div
      role="alert"
      className={`flex items-start sm:items-center justify-between px-4 py-3 rounded-2xl shadow-md ${alertStyles[type]} mb-4`}
      variants={alertVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex items-start sm:items-center w-full">
        {iconPaths[type]}
        <span className="text-sm font-medium break-words max-w-xs sm:max-w-sm md:max-w-md">
          {message}
        </span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 rounded-full hover:bg-black/5 transition p-1 text-gray-600"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
