import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Dropdown from "./Dropdown";
import Test from "./Test";

const SelectTest = () => {
    // Variables for test options
    const [levels, setLevels] = useState(["1", "2", "3", "4", "5", "6"]);
    const [wordAmount, setWordAmount] = useState(5);

    const [custom, setCustom] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [started, setStarted] = useState(false);
    // testSeed is updated if the user requests a new test, which will reload the Test component
    const [testSeed, setTestSeed] = useState(0);

    
    const getCategories = async () => {
        // Already existing categories
        const response = await fetch("https://flask-production-2000.up.railway.app/get-categories");
        const result = await response.json();
        
        setCategories(result.map((category) => category.name));
    }

    const resetOptions = () => {
        e.preventDefault();
        setLevels([]);
        setSelectedCategories([]);
        setWordAmount(5);
        setCustom(false);
    }

    const updateLevels = (levels) => {
        if (levels.length == 0) {
            setLevels(["1", "2", "3", "4", "5", "6"]);
        } else {
            setLevels(levels);
        }
    };

    const startTest = (e) => {
        e.preventDefault();

        if (selectedCategories.length <= 0) {
            setSelectedCategories(categories);
        }
        setStarted(true);
    }

    const reloadTest = () => {
        setTestSeed(prevSeed => prevSeed + 1);
    }

    // What to do on first render
    useEffect(() => {
        getCategories();
    }, []);

    return <>
        {/* TEST SELECT */}
        {!started && <div className="relative h-full flex justify-center items-center">
            <div className="h-10/12 w-10/12">
                <form className="relative py-5 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400" onSubmit={startTest}>
                    <h1 className="text-gray-800 text-xl font-bold mb-4">Options</h1>

                    <h1 className="text-gray-800 font-bold">Levels</h1>
                    <Dropdown style="my-2" placeholder={"Levels"} dropdownOptions={["1", "2", "3", "4", "5", "6"]} isMulti onChange={(value) => updateLevels(value)} />

                    <h1 className="mt-6 font-bold">Words: {wordAmount}</h1>
                    <RangeSlider min={5} max={100} step={5}
                        className="single-thumb my-2"
                        defaultValue={[0, wordAmount]}
                        thumbsDisabled={[true, false]}
                        rangeSlideDisabled={true}
                        onInput={(e) => setWordAmount(e[1])} />

                    <div className="flex items-center mt-20 mb-6">
                        <label className="text-gray-800 text-xl mr-4">Custom</label>
                        <div className={`relative w-14 h-7 rounded-full ${custom ? "bg-blue-500" : "bg-gray-200"}`} onClick={() => setCustom(!custom)}>
                            <span className={`absolute w-2/5 h-4/5 bg-white rounded-full top-[3px] left-1 transition-all duration-300 ${custom && "left-[30px]"}`}></span>
                        </div>
                    </div>

                    {custom && <>
                        <h1 className="text-gray-800 font-bold">Categories</h1>
                        <Dropdown style="my-2" placeholder={"Categories"} dropdownOptions={categories} isMulti isSearchable onChange={(value) => setSelectedCategories(value)} />
                    </>}
                    
                    <div className="flex items-center justify-center w-full pt-2 mt-8">
                        <button type="submit" className="focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-bright-green transition duration-150 ease-in-out hover:bg-dark-green bg-bright-green rounded text-white px-8 py-2 mr-4 text-sm">
                            Start Test
                        </button>
                        <button className="focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-400 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm" onClick={resetOptions}>Reset</button>
                    </div>
                </form>
            </div>
        </div>
        }
        {/* TEST IN PROCESS */}
        {started && <Test key={testSeed} levels={levels} amount={wordAmount} categories={selectedCategories} onNewTest={reloadTest}/>}
    </>
}

export default SelectTest;