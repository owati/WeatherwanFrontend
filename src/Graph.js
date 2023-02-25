import { useEffect, useMemo, useState, useRef } from 'react';
import rain from './rain.png';
import './App.css';

import { Chart } from 'react-charts';


import { useLocation, useParams } from 'react-router';
import { Layout } from './App';


const now = new Date();



function App() {

    const [socket, setSocket] = useState(false);
    const [dataValues, setData] = useState([]);
    const [current, setCurrent] = useState("6387e1a821033c5622c0f379");
    const {id} = useParams();

    const [newData, setnewData] = useState({
        temp: [],
        humidity: [],
        bar_pressure: [],
        vapor_pressure: []
    })

    const nodeMap = {
        Node1: "6387e1a821033c5622c0f379",
        Node2: "63f0b6f59beaaf5bfa2754e3",
        Node3: "63f0b6fd9beaaf5bfa2754e5",
        Node4: "63f0b7039beaaf5bfa2754e7",
    }

    const count = useRef(0);



    useEffect(() => {
        var websocket = new WebSocket(`${process.env.REACT_APP_API_URL}/ws/${id}`);
        websocket.onopen = e => {
            console.log("the websocket has connected successfull");
        }
        websocket.onmessage = e => {
            // console.log('message  ')
            try {
                const message = JSON.parse(e.data);
                console.log(message.data[0], "<=message"); 

                if (!message.data[0]) {
                    console.log(true)
                    setnewData({
                        temp: [],
                        humidity: [],
                        bar_pressure: [],
                        vapor_pressure: []
                    })
                    return;
                }

                console.log("continue")
                const data = { ...newData };

                Object.entries(data).forEach(([field, valuue]) => {
                    data[field] = message.data[0].history.map(mess => {
                        if (mess[field])
                            return {
                                data: mess[field],
                                timestamp: new Date(mess.date).toLocaleString()
                            }
                        return null;
                    }).filter(value => value)
                })

                setnewData(data)
                // setData(
                //   [
                //     {
                //       timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                //       data: message.data.temp || 0
                //     },
                //     {
                //       timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                //       data: message.data.humidity || 0
                //     },
                //     {
                //       timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                //       data: message.data.bar_pressure || 0
                //     },
                //     {
                //       timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString(),
                //       data: message.data.vapor_pressure || 0
                //     },
                //   ]
                // )

            } catch (e) {
                console.log(e.message)
            }

            setSocket(socket);
        }

        return function() {websocket?.close && websocket?.close()}
    }, [id])

    // const [temperature, humidity, bar_pressure, vapor_pressure] = useMemo(
    //   () => {
    //     // console.log(dataValues);
    //     const prev = [...dataHistory.current];

    //     // prev.shift();

    //     if (dataValues.length !== 0) {
    //       dataValues.forEach((datum, ind) => {
    //         if (prev[ind].length === 10) {
    //           prev[ind].shift();
    //         }
    //         prev[ind].push({ ...datum })
    //       })
    //       dataHistory.current = prev;
    //     }

    //     console.log(prev)
    //     return prev;
    //   }, [dataValues]
    // )
    // // console.log(dataHistory.current);

    const { temp: temperature, humidity, bar_pressure, vapor_pressure } = newData;

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

    return temperature.length ? (
        <Layout>
            <div className='py-10'>
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
        </Layout>
    ) : 
    <Layout>
    <div className='flex justify-center items-center flex-col h-96'>

        <img className='h-20 mr-2' src={rain} alt="" />
        <h2 className='text-lg mt-10 font-semibold'>Connecting to server...</h2>
        <h4 className='text-sm mt-5 text-center'>If this doesn't clear, it means this node has no history</h4>
    </div>
    </Layout>
}

export default App;