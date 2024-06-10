import React from "react";
import { useSearchBar } from "../Context/SearchBarContext";


const SearchBar = () => {
    const { searchBarTerm, setSearchBarTerm } = useSearchBar();

    return (
        <input
            type="text"
            value={searchBarTerm}
            onChange={(e) => setSearchBarTerm(e.target.value)}
            placeholder="Search products..."
            className="border-2 border-black w-1/3 text-center bg-orange-200 text-black p-2 rounded-md placeholder-bold"
        />
    );
};

export default SearchBar;
