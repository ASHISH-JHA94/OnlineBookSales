import React from "react";
import { usePriceFilter } from "../Context/PriceFilterContext";

const PriceFilter = () => {
  const { minPrice, maxPrice, setMinPrice, setMaxPrice } = usePriceFilter();

  const handleMinPriceChange = (e) => {
    setMinPrice(parseFloat(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseFloat(e.target.value));
  };

  return (
    <div className="flex justify-center
    flex-wrap gap-4">
      <div>
      <label htmlFor="minPrice" className="text-lg mt-2 font-medium mr-1">
        Min Price:
      </label>
      <input
        type="number"
        id="minPrice"
        value={minPrice}
        onChange={handleMinPriceChange}
        className="border border-black rounded px-2 py-1 w-32 text-lg "
      />
      </div>
      <div>
      <label htmlFor="maxPrice" className="text-lg mt-2 font-medium mr-1">
        Max Price:
      </label>
      <input
        type="number"
        id="maxPrice"
        value={maxPrice}
        onChange={handleMaxPriceChange}
        className="border border-black rounded px-2 py-1 w-32 text-lg "
      />
      </div>
    </div>
  );
};

export default PriceFilter;
