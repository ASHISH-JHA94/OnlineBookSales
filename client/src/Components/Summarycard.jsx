import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 

const Summarycard = ({ summaryData }) => {
  return (
    <div className="mx-auto flex-col flex-wrap item-center  md:bg-dark-blue rounded-lg p-6 text-[#EEEEEE] max-w-[80%]" style={{ backgroundColor: '#243B55', borderRadius: '25px', padding: '24px', color: '#FFFFFF' }}>
      <h2 className="text-xl font-bold mb-4 mr-3">Performance</h2>

      {/* Income and Spendings Metrics */}
      <div className="flex md:justify-around mb-8 sm:mx-auto gap-4">
        <div>
          <p className="text-3xl font-bold">{Math.round(summaryData.totalIncome)}</p>
          <p className="text-sm opacity-70">Income</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{Math.round(summaryData.totalSpendings)}</p>
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
