import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import AreaChart from '../Components/AreaChart';
import Summarycard from '../Components/Summarycard';
import MetricsContainer from '../Components/metricCard/Metriccontainer';
import GreetingBox from '../Components/GreetingBox';
import AIWithText from '../Components/AIWithText';
import Orders from '../Components/Order';

export default function Dashboard() {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({ totalIncome: 0, totalSpendings: 0 });

  return (
    <div className='flex flex-col'>
      <div className='mr-[2rem] mt-5 flex flex-col lg:flex-row justify-between dashboard'>
        <div className="flex flex-col items-center justify-center">
          <div className="mid flex flex-col">
            <GreetingBox />
            <div className="flex lg:flex-row flex-col item-center justify-center mb-5">
              <AreaChart chartData={chartData} />
              <Summarycard summaryData={summaryData} />
            </div>
          </div>
          <MetricsContainer summaryData={summaryData} />
        </div>
        <div className="md:ml-8 ml-0">
          <AIWithText />
        </div>
      </div>
      <Orders setChartData={setChartData} setSummaryData={setSummaryData} />
    </div>
  );
}
