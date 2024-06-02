import React from 'react'
// import { useAuth } from './Auth';

export default function GreetingBox() {
  // const {userDetails} = useAuth();
  return (
    <div className='ml-[4rem]'>
        <div className="name">
            <span className="text-slate-500 font-bold hello">Hello, </span> <b className='text-black font-bold'>Ashish Jha</b> 👋
        </div>
        <div className="text-slate-400 text-sm greeting">
            Good morning, another wonderful day to design
        </div>
    </div>
  )
}
