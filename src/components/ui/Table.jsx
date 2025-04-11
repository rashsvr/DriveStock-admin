// components/Table.jsx
import React, { useState } from 'react';
import LoadingAnimation from '../function/LoadingAnimation';

const Table = ({
  data = [],
  columns = [],
  actions = [],
  loading = false,
  emptyMessage = 'No data found.',
  className = '',
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className={`text-white ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-md">
        <table className="table w-full table-zebra min-w-[600px]">
          <thead className="text-highlight-blue">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.hideOnMobile ? 'hidden lg:table-cell' : ''}>
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center text-gray-400 py-4"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item._id}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 ${col.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="py-3">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(item)}
                          className={`btn btn-sm ${action.className} ${
                            index > 0 ? 'ml-2' : ''
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <div className="text-center text-gray-400 py-4">{emptyMessage}</div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item._id}
              className="bg-[#2A3536] p-4 rounded-lg shadow-md border border-gray-700"
            >
              {columns.map((col) => (
                !col.hideOnMobile && (
                  <div key={col.key} className="flex justify-between py-1">
                    <span className="font-semibold text-highlight-blue">{col.label}:</span>
                    <span>{col.render ? col.render(item) : item[col.key]}</span>
                  </div>
                )
              ))}
              {actions.length > 0 && (
                <div className="flex justify-end space-x-2 mt-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => action.onClick(item)}
                      className={`btn btn-sm ${action.className}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-md bg-highlight-blue text-white disabled:opacity-50 px-4 py-2"
            >
              Previous
            </button>
            <div className="hidden sm:flex space-x-1">
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`btn btn-md ${
                      currentPage === page
                        ? 'bg-highlight-orange text-white'
                        : 'bg-highlight-blue text-white'
                    } px-4 py-2`}
                  >
                    {page}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className={`btn btn-md ${
                      currentPage === 1
                        ? 'bg-highlight-orange text-white'
                        : 'bg-highlight-blue text-white'
                    } px-4 py-2`}
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2">...</span>}
                  {Array.from(
                    { length: 3 },
                    (_, i) => Math.max(2, Math.min(totalPages - 2, currentPage - 1)) + i
                  )
                    .filter((page) => page < totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`btn btn-md ${
                          currentPage === page
                            ? 'bg-highlight-orange text-white'
                            : 'bg-highlight-blue text-white'
                        } px-4 py-2`}
                      >
                        {page}
                      </button>
                    ))}
                  {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`btn btn-md ${
                      currentPage === totalPages
                        ? 'bg-highlight-orange text-white'
                        : 'bg-highlight-blue text-white'
                    } px-4 py-2`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <select
              value={currentPage}
              onChange={(e) => goToPage(Number(e.target.value))}
              className="sm:hidden bg-[#2A3536] text-white border border-gray-700 rounded-md px-2 py-1"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <option key={page} value={page}>
                  Page {page}
                </option>
              ))}
            </select>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-md bg-highlight-blue text-white disabled:opacity-50 px-4 py-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;