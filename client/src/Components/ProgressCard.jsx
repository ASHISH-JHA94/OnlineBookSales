import React from 'react'
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

export default function ProgressCard({body,heading,percentage,color}) {
    
   

    return (
        <div style={{backgroundColor: color}} className={`progressCard p-3 m-2 rounded-[1.75rem] w-1/4 cursor-pointer`}>
            <div className="flex justify-between">
                <div className="">
                    <AutoGraphRoundedIcon />
                    <div className='text-sm'>Progress</div>
                    <div className='text-xl font-bold'>{body}</div>
                    <div style={{color: `${color}`}} className={`bg-blue-100 px-[4px] mt-[4px] w-fit rounded-full text-xs`}>
                        {heading}
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div style={{ width: 50, height: 50 }} >
                        <CircularProgressbar value={percentage} text={`${percentage}%`} styles={buildStyles({
                            textSize: '24px',
                            pathTransitionDuration: 0.5,
                            pathColor: `#fff`,
                            textColor: '#fff',
                            trailColor: 'transparent',
                        })} />
                    </div>
                </div>

            </div>
            <div className=" flex justify-between items-center font-bold text-xs">
                <span>Expand This</span>
                <span><IconButton><ArrowForwardIos fontSize="small" /></IconButton></span>
            </div>
        </div>
    )
}
