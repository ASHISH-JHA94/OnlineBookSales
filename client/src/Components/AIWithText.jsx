import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TelegramIcon from '@mui/icons-material/Telegram';
import ClipLoader from "react-spinners/ClipLoader";
import { useLocation } from 'react-router-dom';


export default function AIWithText() {
    
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const location = useLocation();
    const [search, setSearch] = useState('Hello');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        aiRun();
    }, [location]);

    const aiRun = async () => {
        setLoading(true);
        setAiResponse('');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `${search}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            setAiResponse(text);
        } catch (error) {
            console.error('Error generating AI response:', error);
            setAiResponse('An error occurred while generating the response.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
        
    };

    const handleClick = (event) => {
        event.preventDefault();
        aiRun();
    };

    return (
        <div className='mx-auto h-2/3 my-4 w-[80%] md:h-[65vh] lg:w-[25vw] flex justify-center items-center flex-col'>
            <div className="rounded-lg border-l-2 border-y-2 border-r-4 border-[#1b1b25] border-solid response h-[100%] w-full text-xl bg-slate-100 p-3 m-3 overflow-auto">
                <div className="loading h-full">
                    {
                        loading && !aiResponse ?
                            <ClipLoader size={150} color={"#123abc"} loading={loading} /> :
                            <p>{aiResponse}</p>
                    }
                </div>
            </div>

            <form className="input m-2 flex justify-center items-center" onSubmit={handleClick}>
                <input className='form-control' placeholder='Ask Me Anything' onChange={handleChangeSearch} />
                <button className="ml-2 btn btn-primary" type="submit">
                    <TelegramIcon />
                </button>
            </form>
        </div>
    );
}
