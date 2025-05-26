// src/components/PriceRequest.js
import React from 'react';

const PriceRequest = () => {
  const numberOfRows = 5;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-24"> 
      <h2 className="text-xl font-bold mb-4">Price request form</h2>

      <div className="overflow-x-auto"> 
        <table className="w-full border-collapse border border-red-500">
          <thead>
            <tr>
              <th className="border border-red-500 p-3 bg-gray-100 text-center font-semibold">No.1</th>
              <th className="border border-red-500 p-3 bg-gray-100 text-center font-semibold">Item</th>
              <th className="border border-red-500 p-3 bg-gray-100 text-center font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
           
            {[...Array(numberOfRows)].map((_, index) => (
              <tr key={index}>
                <td className="border border-red-500 p-3 h-12 bg-gray-100"></td> 
                <td className="border border-red-500 p-3 h-12 bg-gray-100"></td>
                <td className="border border-red-500 p-3 h-12 bg-gray-100"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceRequest;