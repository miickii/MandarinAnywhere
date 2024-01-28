import { useEffect, useState, useRef } from 'react';
import { AiOutlineEdit } from "react-icons/ai";
import WordForm from './WordForm';

const Database = ({ showMenu }) => {
    const [words, setWords] = useState([]);
    const [displayWords, setDisplayWords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWord, setSelectedWord] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
  
    const getWords = async () => {
        const response = await fetch("https://flask-production-2000.up.railway.app/fetch-profile-data");
        const result = await response.json();

        setWords(result[0]);
        setDisplayWords(result[0]); // Initially show all words

        const tempCategories = result[1].map(category => category.name);
        setCategories(tempCategories);
    }

    const filterWords = () => {
        let filteredWords = words;
    
        if (selectedCategory) {
            // Filter words that include the selected category in their categories list
            filteredWords = filteredWords.filter(word => word.categories.includes(selectedCategory));
        }
    
        if (searchTerm) {
            // Further filter words based on the search term (case-insensitive)
            filteredWords = filteredWords.filter(word => 
                word.chinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
                word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                word.english.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    
        setDisplayWords(filteredWords);
    };
    
    useEffect(() => {
        filterWords();
    }, [selectedCategory, searchTerm]); // Re-run the filter whenever the category or search term changes     

    // What to do on first render
    useEffect(() => {
        getWords();
    }, [])
  
    return <>
        {!selectedWord && <>
            <div className='h-[70px] flex-none bg-gray-900 py-3 px-3 flex justify-between'>
                <input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-1/2 pl-3 pr-10 py-2 text-base bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
                />
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="ml-3 block w-1/2 pl-3 pr-10 py-2 text-base bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
                >
                    <option value="">All Categories</option>
                    {categories.map((category, idx) => (
                        <option key={idx} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className='flex-auto bg-gray-900 px-5 py-5 overflow-y-auto'>
                <div className='w-full flex flex-col gap-3'>
                    {displayWords.map((word, idx) => (
                        <div key={idx} className="relative p-4 border border-gray-700 rounded shadow-sm bg-gray-800">
                            <div className="absolute top-2 right-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 rounded-full h-6 w-6 flex items-center justify-center text-xs"
                            onClick={() => {
                                setSelectedWord(word);
                                setShowEditModal(true);
                                //showMenu(false);
                            }}>
                                <AiOutlineEdit />
                            </div>
                            <h3 className="text-lg font-bold text-white">{word.chinese}</h3>
                            <p className="text-sm text-gray-300">{word.pinyin}</p>
                            <p className="text-sm text-gray-200">{word.english}</p>
                            <div className="mt-2">
                                {word.categories.map((category, idx) => (
                                    <span key={idx} className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">{category}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>}
        
        {selectedWord && (
            <div className="w-full h-full relative">
                <WordForm word={selectedWord} add={false} onClose={() => {
                    setSelectedWord(null);
                    setShowEditModal(false);
                    //showMenu(true);
                }}/>
            </div>
        )}
    </>
}

export default Database
