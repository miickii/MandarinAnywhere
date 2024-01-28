import React, { useState, useEffect } from 'react';

const DemoComponent = () => {
    // Initialize state
    const [count, setCount] = useState(0);
    const [toggle, setToggle] = useState(false);

    console.log('1. Component function is called (Component is rendering or re-rendering)');

    // Effect without dependency array - Runs on mount and unmount
    useEffect(() => {
        console.log('2. useEffect - Component did mount (like componentDidMount in class)');
        // Cleanup function
        return () => {
            console.log('6. Cleanup - Component is unmounting (like componentWillUnmount in class)');
        };
    }, []);

    // Effect with dependencies - Runs on mount and whenever dependencies change
    useEffect(() => {
        console.log('3. useEffect with dependency [count] - Count has changed:', count);
    }, [count]);

    useEffect(() => {
        console.log('4. useEffect with dependency [toggle] - Toggle has changed:', toggle);
    }, [toggle]);

    const incrementCount = () => {
        setCount(count + 1);
    };

    const toggleSwitch = () => {
        setToggle(!toggle);
    };

    console.log('5. JSX is about to be returned (Component is rendering or re-rendering)');

    return (
        <div className='h-full flex justify-center items-center flex-col'>
            <div className='bg-gray-300 border-2 border-gray-400 px-2 py-1 text-black rounded-xl cursor-pointer' onClick={incrementCount}>Increment Count: {count}</div>
            <div className='bg-gray-300 border-2 border-gray-400 px-2 py-1 text-black rounded-xl cursor-pointer' onClick={toggleSwitch}>Toggle: {toggle ? 'ON' : 'OFF'}</div>
        </div>
    );
};

export default DemoComponent;