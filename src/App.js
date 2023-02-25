import { useState } from 'react';
import rain from './rain.png';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import Home from './Home';
import Graph from './Graph';



function App() {

  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:id' element={<Graph />} />
    </Routes>
  </BrowserRouter >
}

export default App;


export function Layout({ children }) {
  const params = useParams();
  const [current, setCurrent] = useState(params.id || "");
  const navigate = useNavigate();
  const nodeMap = {
    Node1: "6387e1a821033c5622c0f379",
    Node2: "63f0b6f59beaaf5bfa2754e3",
    Node3: "63f0b6fd9beaaf5bfa2754e5",
    Node4: "63f0b7039beaaf5bfa2754e7",
  }

  return <div className='py-10 bg-[#8FE0FF]/20 min-h-screen'>
    <h2 className='text-5xl font-bold flex items-center text-[#31255A] justify-center '><img className='h-20 mr-2' src={rain} alt="" /> Weather Wan</h2>
    <h5 className='text-[#54416D] text-xl text-center'>A lora based weather stattion</h5>

    <div className='max-w-lg mx-auto flex mt-24 relative'>
      {
        Object.entries(nodeMap).map(([field, value]) => {
          return <button className={`text-xl w-1/4`} onClick={() => { setCurrent(value); navigate("/" + value) }}>{field}</button>
        })
      }
      {
        current ? <span className={'absolute transition-all border-b-4 border-[#31255A] w-1/4 -bottom-1 '} style={{
          left: `${Object.values(nodeMap).indexOf(current) * 25}%`
        }}></span> : <></>}
    </div>
    {children}
  </div>
}