import { useEffect, useState, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';
import WordForm from './WordForm';

const Dictionary = ({ showMenu }) => {
    const [words, setWords] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [wordMeanings, setWordMeanings] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const inputElement = useRef();
    const [showAddModal, setShowAddModal] = useState(false);
    const [notInDB, setNotInDB] = useState(true);
  
    const search = async () => {
      if (text.trim().length === 0) return;
      setLoading(true);
      const response = await fetch("https://flask-production-2000.up.railway.app/search", {
          method: 'POST',
          body: JSON.stringify({
              text: text
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      });
      const result = await response.json();
      setLoading(false);
      console.log(result);
      if (result.length > 0) {
          setWords(result);
      }
    }

    const getCustom = async () => {
      const response = await fetch("https://flask-production-2000.up.railway.app/get-custom", {
          method: 'POST',
          body: JSON.stringify({
              word: selectedWord.chinese.trim()
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      });
      const result = await response.json();
      if (result.word) {
        selectedWord.traditional = result.word.traditional
        selectedWord.pinyin = result.word.pinyin
        selectedWord.english = result.word.english
        selectedWord.level = result.word.level
        selectedWord.categories = result.word.categories
        selectedWord.pos = result.word.pos
        selectedWord.frequency = result.word.frequency
        selectedWord.sentence_chinese = result.word.sentence_chinese
        selectedWord.sentence_pinyin = result.word.sentence_pinyin
        selectedWord.sentence_english = result.word.sentence_english
        setNotInDB(false);
      } else {
        setNotInDB(true);
      }
    }
  
    useEffect(() => {
      console.log(words);
    }, [words])
  
    useEffect(() => {
      if (selectedWord === null) {
        setWordMeanings([]);
        showMenu(true);
      } else {
        const meanings = selectedWord.english.split(";").map(word => word.trim());
        setWordMeanings(meanings);
        showMenu(false);
        getCustom(); // Check if the selected word is in the database, and if so, change selectedWord to the database version
      }
    }, [selectedWord])
  
    return <>
        {!selectedWord && <>
          {loading && (
              <div role="status" className='h-full flex justify-center items-center'>
                  <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
              </div>
          )}
          {!loading && <div className='flex-auto bg-gray-800 px-5 py-5 overflow-y-auto'>
              <div className='w-full flex flex-col gap-3'>
                {words.map((word, i) => (
                    <div key={i} className="relative bg-gray-900 flex flex-col items-center justify-center border-2 border-gray-400 rounded-lg cursor-pointer py-2 px-5" onClick={() => setSelectedWord(word)}>
                      <h1><span className='text-blue-300 font-bold text-3xl mr-2'>{word.chinese}</span><span className='text-gray-500 text-2xl'>{word.pinyin}</span></h1>
                      <h1 className="text-lg text-gray-300">{word.english}</h1>
                    </div>
                ))}
              </div>
            </div>
          }
          <div className='h-[70px] flex-none bg-gray-800 py-3 px-3'>
            <div className='relative h-full bg-gray-600 rounded-md py-2 px-2 border-2 border-gray-500'>
              <IoMdSend className="absolute right-3 top-1/2 -translate-y-1/2 text-interactives cursor-pointer focus:" size={20} onClick={search} />
              <input type="text" ref={inputElement} placeholder="Search" className='h-full w-full text-white bg-transparent focus:outline-none' onChange={e => setText(e.target.value)}></input>
            </div>
          </div>
        </>}
        {selectedWord && !showAddModal && <div className='h-full'>
          <div className='h-12 border-b-2 border-gray-500 bg-gray-700 flex justify-between'>
            <div className='flex items-center' onClick={() => setSelectedWord(null)}>
              <AiOutlineArrowLeft className='text-interactives mx-2' size={24}/>
              <h1 className='text-interactives text-xl'>{text}</h1>
            </div>
            <div className='flex items-center' onClick={() => setShowAddModal(true)}>
              <IoIosAdd className='text-interactives mx-2' size={28} />
            </div>
          </div>
          <div className='border-b-2 border-gray-500 mt-4 flex flex-col items-center'>
            <h1 className='text-blue-300 font-bold text-5xl'>{selectedWord.chinese}</h1>
            <h1 className='text-gray-500 text-3xl my-1'>{selectedWord.pinyin}</h1>
          </div>
          <div className='w-full border-b-2 border-gray-500 px-7 py-2'>
            <h1 className='text-white underline text-center mb-6 text-2xl'>Meanings</h1>
              {wordMeanings.map((m, i) => (
                <h1 key={i}><span className='text-xl font-bold text-white mr-2'>{i+1}</span><span className='text-xl text-gray-300'>{m}</span></h1>
              ))}
          </div>
          <div className='w-full border-b-2 border-gray-500 px-7 py-2'>
            <h1 className='text-white underline text-center mb-6 text-2xl'>Examples</h1>
              {selectedWord.examples.slice(0, Math.min(selectedWord.examples.length, 100)).map((example, i) => (
                <div key={i} className="mb-5 border-b-2 border-gray-500">
                  <h1 className='text-2xl text-blue-300'>{example.chinese}</h1>
                  <h1 className='text-lg text-gray-500'>{example.pinyin}</h1>
                  <h1 className='text-xl text-white'>{example.english}</h1>
                </div>
              ))}
          </div>
        </div>}
        {showAddModal && (
            <div className="w-full h-full">
                <WordForm word={selectedWord} onClose={() => setShowAddModal(false)} add={notInDB} />
            </div>
        )}
    </>
}

export default Dictionary