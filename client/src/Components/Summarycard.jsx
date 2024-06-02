import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 

const Summarycard = ({ summaryData }) => {
  return (
    <div className="mx-auto w-full md:bg-dark-blue rounded-lg p-6 text-[#EEEEEE] max-w-[90%]" style={{ backgroundColor: '#243B55', borderRadius: '25px', padding: '24px', color: '#FFFFFF' }}>
      <h2 className="text-xl font-bold mb-4">Performance</h2>

      {/* Income and Spendings Metrics */}
      <div className="flex justify-around mb-8">
        <div>
          <p className="text-3xl font-bold">{summaryData.totalIncome}</p>
          <p className="text-sm opacity-70">Income</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{summaryData.totalSpendings}</p>
          <p className="text-sm opacity-70">Spendings</p>
        </div>
      </div>

      {/* Task List */}
      <div className='mb-10'>
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-green-500 mr-2" />
          <div>Use gen AI for creating Image </div>
        </div>
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-blue-500 mr-2" />
          <p>Choose from range of templates</p>
        </div>
        <div className="flex items-center">
          <FaCheckCircle className="text-orange-500 mr-2" />
          <p>T-shirt customization page</p>
        </div>
      </div>
    </div>
  );
};

export default Summarycard;
