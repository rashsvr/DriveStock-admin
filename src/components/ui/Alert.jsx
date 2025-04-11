import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircleIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

const alertStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  },
};

const Alert = ({ type = "info", message, onClose }) => {
  const style = alertStyles[type] || alertStyles.info;

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        className={`flex items-start sm:items-center justify-between w-full px-4 py-3 border rounded-lg shadow-sm ${style.bg} ${style.border}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
        exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }}
      >
        <div className="flex items-start sm:items-center gap-2">
          {style.icon}
          <span className={`text-sm sm:text-base font-medium leading-snug max-w-full break-words ${style.text}`}>
            {message}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 p-1 rounded-full hover:bg-black/10 transition"
            aria-label="Close alert"
          >
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
