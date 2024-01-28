import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Dropdown from "./Dropdown";

// Object to convert jieba POS to more readable identifier
const POS = {n: "noun", nr: "name", a: "adjective", an: "adjective", m: "measure word", q: "measure word", c: "conjunction", f: "location", ns: "place", v: "verb", vn: "verb", ad: "adverb", vd: "adverb", d: "adverb", u: "particle", r: "pronoun", t: "time", nw: "title", p: "preposition"};

/**
 * WordForm component for adding a word to the database.
 * 
 * Props:
 *  word: Word to be added to the database.
 *  onClose: Function that executes when modal is closed.
 *  add: Boolean that determines if the word is being added or edited.
 */
const WordForm = ({ word, onClose, add=true }) => {
    const [chinese, setChinese] = useState(word.chinese);
    const [pinyin, setPinyin] = useState(word.pinyin);
    const [english, setEnglish] = useState(word.english);
    const [level, setLevel] = useState(word.level ? word.level.toString() : null);

    const [sentenceChinese, setSentenceChinese] = useState(word.sentence_chinese);
    const [sentencePinyin, setSentencePinyin] = useState(word.sentence_pinyin);
    const [sentenceEnglish, setSentenceEnglish] = useState(word.sentence_english);

    const [selectedCategories, setSelectedCategories] = useState(() => {
        // If this word has a pos, add it to selectedCategories (if word.pos is None/undefined then POS[word.pos] will also be undefined)
        return POS[word.pos] ? [POS[word.pos]] : [];
    });
    const [categories, setCategories] = useState([]) // all categories currently in profile database (is set with a useEffect)

    const [loading, setLoading] = useState(false);

    const addToDB = async (e) => {
        e.preventDefault(); // prevent the form from being submitted and the page from being reloaded.

        setLoading(true);
        //const response = await fetch("/api/add-word", {
        const response = await fetch("https://flask-production-2000.up.railway.app/add-custom", {
            method: 'POST',
            body: JSON.stringify({
                word: [chinese.trim(), word.traditional, pinyin.trim(), word.pinyin_numbers, english.trim(), word.short_english, word.pos, word.frequency, level, selectedCategories],
                sentence: sentenceChinese + ";" + sentencePinyin + ";" + sentenceEnglish,
                add: add
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
        console.log(result);
        setLoading(false);

        // Close the modal
        onClose();
    };

    // Get's all of the categories currently in profile database
    // ["school", "hobby", "grammar"]
    const getCategories = async () => {
        const tempCategories = []

        // Already existing categories
        const response = await fetch("https://flask-production-2000.up.railway.app/get-categories");
        //const response = await fetch("/api/get-categories");
        const result = await response.json();
        for (let category of result) {
            tempCategories.push(category.name)
        }

        // If the word has a pos (part of speech) add that to categories available in categories dropdown
        if (word.pos in POS && !tempCategories.includes(POS[word.pos])) {
            tempCategories.push(POS[word.pos]);
        }
        
        setCategories(tempCategories);
    }

    const getCustom = async () => {
        const response = await fetch("https://flask-production-2000.up.railway.app/get-custom", {
            method: 'POST',
            body: JSON.stringify({
                word: chinese.trim()
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
        console.log(result);
    }

    // What to do on first render
    useEffect(() => {
        getCategories();
        getCustom(); // Check if word is already in database
    }, [])

    return (
        <form className="h-full w-full p-5 bg-gray-800 border border-gray-700" onSubmit={addToDB}>
            <IoIosClose size={40} className="cursor-pointer absolute top-0 right-0 mt-2 mr-3 text-gray-300 hover:text-gray-400 transition duration-150 ease-in-out" onClick={() => onClose()} />
    
            <h1 className="text-gray-200 text-xl font-bold mb-4">{add ? "Add Word" : "Edit Word"}</h1>
    
            <div className="flex w-full justify-between">
                <div className="w-[45%]">
                    <label className="text-gray-200 text-sm font-bold">Characters</label>
                    <input id="chinese" className="mb-5 mt-2 text-gray-200 bg-gray-700 focus:outline-none focus:border focus:border-blue-600 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-600 rounded border" value={chinese} onChange={e => setChinese(e.target.value)} />
                </div>
                <div className="w-[45%]">
                    <label className="text-gray-200 text-sm font-bold">Pinyin</label>
                    <input id="pinyin" className="mb-5 mt-2 text-gray-200 bg-gray-700 focus:outline-none focus:border focus:border-blue-600 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-600 rounded border" value={pinyin} onChange={e => setPinyin(e.target.value)} />
                </div>
            </div>
            
            <label className="text-gray-200 text-sm font-bold">English</label>
            <input id="english" className="mb-5 mt-2 text-gray-200 bg-gray-700 focus:outline-none focus:border focus:border-blue-600 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-600 rounded border" value={english} onChange={e => setEnglish(e.target.value)} />
    
            <div className="flex w-full justify-between mb-3">
                <div className="w-2/3">
                    <label className="text-gray-800 text-sm font-bold">Categories</label>
                    <Dropdown style="my-2" placeholder={"Categories"} dropdownOptions={categories} isMulti isSearchable defaultValues={selectedCategories} canAddOptions onChange={(value) => setSelectedCategories(value)} />
                </div>
                <div className="w-1/4">
                    <label className="text-gray-800 text-sm font-bold">Level</label>
                    <Dropdown style="my-2" placeholder={"Levels"} dropdownOptions={["1", "2", "3", "4", "5", "6"]} isSearchable defaultValues={ level ? [level] : [] } onChange={(value) => setLevel(value)} />
                </div>
            </div>
            
            <h1 className="text-gray-200 text-md font-bold">Example sentence</h1>
            <label className="text-gray-800 text-sm font-bold">Characters</label>
            <input id="sentence_chinese" className="mb-2 mt-1 text-gray-600 focus:outline-none focus:border focus:border-sky-blue font-normal w-full h-8 flex items-center pl-3 text-sm border-gray-300 rounded border" value={sentenceChinese} onChange={e => setSentenceChinese(e.target.value)} />
            <label className="text-gray-800 text-sm font-bold">Pinyin</label>
            <input id="sentence_pinyin" className="mb-2 mt-1 text-gray-600 focus:outline-none focus:border focus:border-sky-blue font-normal w-full h-8 flex items-center pl-3 text-sm border-gray-300 rounded border" value={sentencePinyin} onChange={e => setSentencePinyin(e.target.value)} />
            <label className="text-gray-800 text-sm font-bold">English</label>
            <input id="sentence_english" className="mb-2 mt-1 text-gray-600 focus:outline-none focus:border focus:border-sky-blue font-normal w-full h-8 flex items-center pl-3 text-sm border-gray-300 rounded border" value={sentenceEnglish} onChange={e => setSentenceEnglish(e.target.value)} />
    
            <div className="flex items-center justify-center w-full pt-2">
                <button type="submit" className="focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-600 transition duration-150 ease-in-out hover:bg-blue-700 bg-blue-600 rounded text-gray-200 px-8 py-2 mr-4 text-sm">
                    {!loading && (
                        <h1>{add ? "Add" : "Edit"}</h1>
                    )}
                    {loading && (
                        <div role="status">
                            <svg aria-hidden="true" className={`w-5 h-5 text-gray-200 fill-white animate-spin`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        </div>
                    )}
                </button>
                <button className="focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500 bg-gray-700 transition duration-150 text-gray-200 ease-in-out hover:border-gray-500 hover:bg-gray-600 border border-gray-600 rounded px-8 py-2 text-sm" onClick={() => onClose()}>Cancel</button>
            </div>
        </form>
    )
}

export default WordForm;