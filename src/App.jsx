import { useEffect, useState, useRef } from 'react'
import { IoMdSend } from 'react-icons/io';

function App() {
  const [words, setWords] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputElement = useRef();

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

  useEffect(() => {
    console.log(words);
  }, [words])


  return (
    <div className="height-available">
      <div className='relative flex flex-col justify-end h-screen bg-gray-800'>
        {loading && (
            <div role="status" className='flex-auto justify-center items-center'>
                <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        )}
        {!loading && <div className='flex-auto bg-gray-800 px-5 py-5 overflow-y-auto'>
            <div className='w-full flex flex-col gap-3'>
              {words.map((word, i) => (
                  <div key={i} className="relative h-20 bg-neutral-500 flex flex-col items-center justify-center border-2 border-gray-400 rounded-lg cursor-pointer p-5" onClick={() => console.log("hej")}>
                    <h1><span className='text-red-400 font-bold text-2xl mr-2'>{word.chinese}</span><span className='text-gray-700 text-xl'>{word.pinyin}</span></h1>
                    <h1 className="text-lg">{word.english}</h1>
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
      </div>
    </div>
  )
}

export default App
{/* <div x-show="open" class="flex justify-between items-center">
			<input type="text" class="w-full bg-gray-100 rounded p-2 mr-4 border focus:outline-none focus:border-blue-500" value="Hafiz Haziq">

			<div class="flex justify-center items-center space-x-2">
				<button type="button" @click="open = false" class="btn bg-gray-200 hover:bg-gray-300 px-4 py-2 font-medium rounded">
                    Cancel
                </button>
				<button type="button" class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-medium rounded"
                    >
                    Save
                </button>
			</div>
		</div> */}