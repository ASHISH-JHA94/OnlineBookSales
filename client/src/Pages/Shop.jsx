import { Button } from '@mui/material';
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
import { BorderAllOutlined } from '@mui/icons-material';

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
    const API_URL = "http://localhost:8080/product/getAllProducts";
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const { searchBarTerm } = useSearchBar();
    const { minPrice, maxPrice } = usePriceFilter();
    const { filter, setFilter } = useFilter();
    const {showToast}=useToast();

    async function fetchProductData() {
        setLoading(true);

        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setPosts(data.products);
            showToast("success","Product","fetched Successfully");
        } catch (error) {
            console.log("Error occurred while fetching data");
            setPosts([]);
            showToast("error","Product",error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchProductData();
    }, []);

    const filteredPosts = posts.filter((post) => {
        const name = post.name.toLowerCase().includes(searchBarTerm.toLowerCase());
        const priceMatch = post.price >= minPrice && post.price <= maxPrice;
        const categoryMatch = filter === '' || post.category === filter;
        return name && priceMatch && categoryMatch;
    });

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
                    </ThemeProvider>
                </div>
            </div>
            {loading ? (
                <Spinner />
            ) : filteredPosts.length > 0 ? (
                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
                    {filteredPosts.map((post) => (
                        <Product key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>No Data Found</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
