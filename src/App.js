import { useEffect, useMemo, useState, useRef } from 'react';
import rain from './rain.png';
import './App.css';

import { Chart } from 'react-charts';


const now = new Date();



function App() {

  const [socket, setSocket] = useState(false);
  const [dataValues, setData] = useState([]);

  const count = useRef(0);

  const dataHistory = useRef([
    [{ timestamp: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), data: 0 }],
    [{ timestamp: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), data: 0 }],
    [{ timestamp: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), data: 0 }],
    [{ timestamp: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), data: 0 }],])


  useEffect(() => {
    if (count.current === 0) {
      const websocket = new WebSocket(`${process.env.REACT_APP_API_URL}/ws`);
      websocket.onopen = e => {
        console.log("the websocket has connected successfull");
      }
      websocket.onmessage = e => {
        console.log('message  ')
        try {
          const message = JSON.parse(e.data);
          // console.log(message);  

          const time = new Date();
          setData(
            [
              {
                timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                data: message.data.temp || 0
              },
              {
                timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                data: message.data.humidity || 0
              },
              {
                timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                data: message.data.bar_pressure || 0
              },
              {
                timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                data: message.data.vapor_pressure || 0
              },
            ]
          )

        } catch (e) {

        }
      }

      setSocket(socket);
    }
  }, [])

  const [temperature, humidity, bar_pressure, vapor_pressure] = useMemo(
    () => {
      // console.log(dataValues);
      const prev = [...dataHistory.current];

      // prev.shift();

      if (dataValues.length !== 0) {
        dataValues.forEach((datum, ind) => {
          if (prev[ind].length === 10) {
            prev[ind].shift();
          }
          prev[ind].push({ ...datum })
        })
        dataHistory.current = prev;
      }

      console.log(prev)
      return prev;
    }, [dataValues]
  )
  // console.log(dataHistory.current);

  useEffect(() => { console.log("rerendering " + count.current + ' times'); count.current++ })

  useEffect(() => { console.log(socket) }, [socket])

  console.log(temperature, humidity, "temperer")

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.timestamp || '0',
    }),
    []
  )
  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => Number(datum.data || 0),
        elementType: 'area',
      },
    ],
    []
  )

  return (
    <div className='py-10 bg-[#8FE0FF]/20'>
        <h2 className='text-5xl font-bold flex items-center text-[#31255A] justify-center '><img className='h-20 mr-2' src={rain}/> Weather Wan</h2>
        <h5 className='text-[#54416D] text-xl text-center'>A lora based weather stattion</h5>

      <div className='w-full h-fit flex justify-center items-center p-5 md:p-20 flex-col'>
        <div className='grid grid-cols-2 justify-center gap-10'>
          <h1 className='text-center text-2xl'>Temp: {temperature[temperature.length - 1].data}<sup>o</sup> C</h1>
          <h1 className='text-center text-2xl'>Humidity: {humidity[humidity.length - 1].data} gm<sup>-3</sup></h1>
          <h1 className='text-center text-2xl'>Atm. pressure: {bar_pressure[bar_pressure.length - 1].data} Pa</h1>
          <h1 className='text-center text-2xl'>Vapor pressure: {vapor_pressure[vapor_pressure.length - 1].data} Pa</h1>
        </div>

        <div className='w-full h-[400px] mt-32'>
          <h1 className='text-xl'>Temperature</h1>
          <Chart options={{
            initialWidth: 300,
            data: [{ label: "temperature", data: [...temperature] }],
            primaryAxis,
            secondaryAxes
          }} />
        </div>

        <div className='w-full h-[400px]  mt-32'>
          <h1 className='text-xl'>Humidity</h1>
          <Chart options={{
            initialWidth: 300,
            data: [{ label: "humidity", data: [...humidity] }],
            primaryAxis,
            secondaryAxes
          }} />
        </div>

        <div className='w-full h-96  mt-32'>
          <h1 className='text-xl'>Bar Pressure</h1>
          <Chart options={{
            initialWidth: 300,
            data: [{ label: "bar pressure", data: [...bar_pressure] }],
            primaryAxis,
            secondaryAxes,
          }} />
        </div>

        <div className='w-full h-96  mt-32'>
          <h1 className='text-xl'>Vapour Pressure</h1>
          <Chart options={{
            initialWidth: 300,
            data: [{ label: "vapor pressure", data: [...vapor_pressure] }],
            primaryAxis,
            secondaryAxes
          }} />
        </div>

      </div>

    </div>
  );
}

export default App;
