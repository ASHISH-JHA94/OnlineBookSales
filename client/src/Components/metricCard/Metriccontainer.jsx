import React from 'react';
import MetricCard from './Metriccard.jsx';

const MetricsContainer = ({ summaryData }) => {
  return (
    <div className="bg-beige p-6 rounded-3xl shadow-md flex w-4/5 items-center space-x-4" style={{ backgroundColor: '#243B55' }}>
      <div className='flex flex-col items-left m-2  text-white'>
        <h2 className="text-lgflex font-bold mb-3">Engagement</h2>
        <span className="text-md flex">General statistic of user engagement processes.</span>
      </div>
      <div className="flex gap-8 md:flex-row flex-col">
        <MetricCard label="Total Income" value={Math.round(summaryData.totalIncome)} IconComponent="MoneyIcon" trend="up" />
        <MetricCard label="Total Spendings" value={Math.round(summaryData.totalSpendings)} IconComponent="SpendingsIcon" trend="down" />
      </div>
    </div>
  );
};

export default MetricsContainer;
