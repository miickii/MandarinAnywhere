import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { GrAdd } from "react-icons/gr"

const Dropdown = ({ style, placeholder, dropdownOptions, isMulti, defaultValues=[], isSearchable, canAddOptions, onChange }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [options, setOptions] = useState(dropdownOptions);
    // Set selected value to be defaultValues if isMulti is true. If isMulti is false, we still check for a default value
    const [selectedValue, setSelectedValue] = useState(isMulti ? defaultValues : (defaultValues.length > 0 ? defaultValues[0] : null));
    const [searchValue, setSearchValue] = useState("");
    const searchRef = useRef();
    const inputRef = useRef();

    // Everytime menu is displayed we reset the text and focus on the search bar
    useEffect(() => {
        setSearchValue("");
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);

    useEffect(() => {
        const handler = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        
        window.addEventListener("click", handler); // Hide menu if window is clicked
        return () => {
            window.removeEventListener("click", handler) // If it isn't removed again at each render, multiple listeners will get created
        }
    })

    // If the dropdown options passed from parent caller is changed we will update it here (if we a fetching the options from api, it won't be set instantly)
    useEffect(() => {
        setOptions(dropdownOptions);
    }, [dropdownOptions]);

    const handleInputClick = (e) => {
        setShowMenu(!showMenu);
    }

    const getDisplay = () => {
        if (!selectedValue || selectedValue.length === 0) {
            return <div className="my-auto">{placeholder}</div>;
        }
        if (isMulti) {
            return (
                <div className="flex flex-wrap gap-[6px] h-full overflow-y-auto">
                    {selectedValue.map((option, index) => (
                        <div key={index} className="bg-[#ddd] px-[6px] flex items-center rounded-md">
                            {option}
                            <span onClick={(e) => onTagRemove(e, option)} className="ml-1 text-xl cursor-pointer"><IoIosClose /></span>
                        </div>
                    ))}
                </div>
            );
        }
        return <div className="my-auto">{selectedValue}</div>;
    }

    const onSearch = (e) => {
        setSearchValue(e.target.value);
    }

    const getOptions = () => {
        if (!searchValue) {
            return options;
        }

        // If something is typed in search box, we only show options that match with search input
        return options.filter((o) => o.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0); // Shows all options that contain search value
    }

    const addOption = (option) => {
        options.push(option);
        console.log(options);
        onItemClick(option);
    }

    const removeOption = (option) => {
        // Return selectedValue with everything but option
        return selectedValue.filter((o) => o !== option);
    }

    const onTagRemove = (e, option) => {
        const newValue = removeOption(option);
        setSelectedValue(newValue);
        onChange(newValue);
    }

    const onItemClick = (option) => {
        let newValue
        if (isMulti) {
            if (selectedValue.findIndex((o) => o === option) >= 0) {
                // If value was already selected we should deselect it
                newValue = removeOption(option);
            } else {
                // If it wasnt already selected then set newValue to all selected values + this option
                newValue = [...selectedValue, option];
            }
        } else {
            newValue = option;
        }
        setSelectedValue(newValue);
        onChange(newValue);
    }

    const isSelected = (option) => {
        if (isMulti) {
            return selectedValue.filter((o) => o === option).length > 0; // returns true if option is in selectedValue
        }
        if (!selectedValue) {
            return false;
        }

        return selectedValue === option;
    }

    return (
        <div className="relative">
            {/* Input */}
            <div ref={inputRef} onClick={handleInputClick} className={`${style && style} text-gray-500 flex items-center justify-between py-2 px-3 border border-gray-300 rounded-md cursor-pointer relative`}>
                <div className="dropdown-text mr-4 h-full flex">{getDisplay()}</div>
                <div className={`duration-200 ${showMenu && "rotate-180"}`}>
                    <BsChevronDown />
                </div>
            </div>
            {/* Items */}
            {showMenu && (
                <div className="absolute w-full border border-gray-300 rounded-md overflow-auto max-h-40 bg-[#fff] z-10">
                    {isSearchable && (
                        <div className="p-1 bg-[#eee] relative">
                            <input onChange={onSearch} value={searchValue} ref={searchRef} className="p-[5px] rounded-md border border-[#ccc] w-full" />
                            {/* If the search input isn't any of the options, a button to add it as an option is added */}
                            {getOptions().length === 0 && searchValue.trim() !== "" && canAddOptions && (
                                <button className="absolute flex items-center top-2.5 right-4 w-6 h-6 bg-gray-100 border border-black rounded-full duration-300 add-button" onClick={() => addOption(searchValue)}>
                                    <span className="opacity-0 text-sm ml-2">Add</span>
                                    <GrAdd size={12} className="absolute right-[5px]" />
                                </button>
                            )}
                        </div>
                    )}
                    {getOptions().map((option, index) => (
                        <div onClick={() => onItemClick(option)} key={index} className={`p-2 cursor-pointer ${isSelected(option) ? "bg-[#0d6efd] text-white" : "hover:bg-[#9fc3f870]"}`}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    )
}

export default Dropdown;