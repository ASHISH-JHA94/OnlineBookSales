import React, { useEffect, useState } from "react";
import Spinner from "../Components/Spinner";
import Product from "../Components/Card/ProductCard";
import SearchBar from "../Components/SearchBar";
import PriceFilter from "../Components/PriceFilter";
import { useSearchBar } from "../Context/SearchBarContext";
import { usePriceFilter } from "../Context/PriceFilterContext";
import { useFilter } from "../Context/filterContext";
import { useToast } from '../Context/ToastContext';
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);

const theme = createTheme({
  palette: {
    violet: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
      contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
});

const Shop = () => {
    const API_URL = "https://old-book-sales.vercel.app/product/getAllProducts";
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);
    const { searchBarTerm } = useSearchBar();
    const { minPrice, maxPrice } = usePriceFilter();
    const { filter, setFilter } = useFilter();
    const { showToast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, [page, filter, minPrice, maxPrice]); // Include filter and price changes in dependencies

    const fetchProducts = async () => {
        if (loading) return; // Prevent multiple simultaneous requests
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=8`);
            const data = await response.json();
            console.log("Fetched data:", data); // Log fetched data to console
            setPosts((prevPosts) => [...prevPosts, ...data.products]); // Append new data to existing posts
            setHasMore(data.pagination && data.pagination.next); // Check if there's a next page in pagination
            showToast("success", "Products", "Data fetched successfully");
        } catch (error) {
            setError(true);
            showToast("error", "Products", error.message);
        }
        setLoading(false);
    };

    const filteredPosts = posts.filter((post) => {
        const name = post.name.toLowerCase().includes(searchBarTerm.toLowerCase());
        const priceMatch = post.price >= minPrice && post.price <= maxPrice;
        const categoryMatch = filter === '' || post.category === filter;
        return name && priceMatch && categoryMatch;
    });

    const handleScroll = () => {
        if (!loading && !error && hasMore) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            console.log("Scroll info:", scrollTop, scrollHeight, clientHeight); // Log scroll info to console
            if (scrollTop + clientHeight >= scrollHeight - 20) {
                setPage((prevPage) => prevPage + 1); 
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, error, hasMore]); // Include loading, error, and hasMore in dependencies

    return (
        <div className='mt-3 mx-auto'>
            <div className="flex md:justify-between  flex-col items-center flex-wrap gap-4">
                <SearchBar />
                <PriceFilter />
                {/* Filter Buttons */}
                <div className="flex gap-4 flex-wrap justify-center">
                    <ThemeProvider theme={theme}>
                        <Button
                            color="violet"
                            variant={filter === 'Action' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'Action' ? '' : 'Action')}
                        >
                            Action
                        </Button>
                        <Button
                            color="violet"
                            variant={filter === 'Romance' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'Romance' ? '' : 'Romance')}
                        >
                            Romance
                        </Button>
                        <Button
                            color="violet"
                            variant={filter === 'fiction' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'fiction' ? '' : 'fiction')}
                        >
                            Fiction
                        </Button>
                        <Button
                            color="violet"
                            variant={filter === 'NonFiction' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'NonFiction' ? '' : 'NonFiction')}
                        >
                            NonFiction
                        </Button>
                        <Button
                            color="violet"
                            variant={filter === 'Novel' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'Novel' ? '' : 'Novel')}
                        >
                            Novel
                        </Button>
                        <Button
                            color="violet"
                            variant={filter === 'Thriller' ? 'contained' : 'outlined'}
                            onClick={() => setFilter(filter === 'Thriller' ? '' : 'Thriller')}
                        >
                            Thriller
                        </Button>
                        {/* Add more filter buttons as needed */}
                    </ThemeProvider>
                </div>
            </div>
            {loading && <Spinner />} {/* Display spinner while loading */}
            {!loading && filteredPosts.length === 0 && <p>No Data Found</p>} {/* Display message if no data */}
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
                {filteredPosts.map((post) => (
                    <Product key={post._id} post={post} />
                ))}
            </div>
            {loading && <Spinner />} {/* Display spinner while loading */}
            {!loading && error && <p>Error fetching data</p>} {/* Display error message if fetch fails */}
            {!loading && !hasMore && <p>No more items to load</p>} {/* Display message when all items are loaded */}
        </div>
    );
};

export default Shop;
