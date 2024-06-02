import React from 'react';
import Chart from 'react-apexcharts';

export default function AreaChart({ chartData }) {
  // Group orders by date and calculate total price for each date
  const dataByDate = chartData.reduce((acc, item) => {
    const date = item.date;
    const totalPrice = item.totalPrice;
    if (acc[date]) {
      acc[date] += totalPrice;
    } else {
      acc[date] = totalPrice;
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(dataByDate).sort();

  const seriesData = Object.values(dataByDate);

  const data = {
    series: [{
      name: 'Total Price',
      data: seriesData,
    }],
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: sortedDates
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        },
      },
    }
  };

  return (
    <div className='flex'>
      <Chart className="m-4" options={data.options} series={data.series} type='area' height={350} width={450} />
    </div>
  );
}
