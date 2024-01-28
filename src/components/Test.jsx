import React, { useEffect, useState } from "react";
import English from "./English";
import Chinese from "./Chinese";

const Test = ({ levels, amount, categories, onNewTest}) => {
    const [testState, setTestState] = useState(-1); // -1: fetching data, 0: not started, 1: in progress, 2: ended
    const [loading, setLoading] = useState(false);

    const [words, setWords] = useState([]);
    const [displayChinese, setDisplayChinese] = useState(); // If true the player has to choose the correct english translation, if false the player has to choose the correct characters
    const [currWord, setCurrWord] = useState(null);
    const [currIndex, setCurrIndex] = useState(-1);

    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [wordCorrect, setWordCorrect] = useState(false); // default every round is not correct, will only be true after a correct guess
    const [guessed, setGuessed] = useState(false);

    const [srsUpdated, setSrsUpdated] = useState(false);

    const getTestData = async () => {
        setLoading(true);
        const response = await fetch("https://flask-production-2000.up.railway.app/get-test-words", {
            method: 'POST',
            body: JSON.stringify({
                options: [levels, amount, categories]
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        setLoading(false);

        // Because we split the chinese into list of characters in get_test_words(), word.chinese is an array where first element is the word and the second are its characters
        // We modify each word object so word.chinese just has the word in chinese, and word.characters has its characters
        data.forEach((entry) => {
            entry.characters = entry.chinese[1];
            entry.chinese = entry.chinese[0];
        });
        return data;
    }

    const updateSRS = async () => {
        const response = await fetch("https://flask-production-2000.up.railway.app/update-srs", {
            method: 'POST',
            body: JSON.stringify({
                correct: correctAnswers.map(answer => answer.id),
                wrong: wrongAnswers.map(answer => answer.id)
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const response2 = await fetch("https://flask-production-2000.up.railway.app/print-srs", {
            method: 'POST',
            body: JSON.stringify({
                words: correctAnswers.concat(wrongAnswers).map(answer => answer.id)
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    const updateWord = () => {
        // Update state variables
        setGuessed(false);

        const newWord = words[currIndex+1];
        setCurrWord(newWord);
        
        // Randomly choose a test type (but always set translateChinese to false if test type is "sentences")
        const translateChinese = Math.random() > 0.5;
        setDisplayChinese(translateChinese);
    }

    const next = () => {
        setWordCorrect(false);
        console.log(correctAnswers);
        console.log(wrongAnswers);
        if (currIndex + 1 < words.length) {
            updateWord();
        } else {
            // This means that the results button has been clicked
            setTestState(2);
            if (!srsUpdated) {
                updateSRS();
                setSrsUpdated(true);
            }
        }

        setCurrIndex(currIndex + 1);
    };

    const changeToFailed = () => {
        // Remove the word from correctAnswers and add it to wrongAnswers
        setCorrectAnswers(correctAnswers.slice(0, -1))
        setWrongAnswers([...wrongAnswers, currWord]);
        setWordCorrect(false); // Reset this variable to remove button to "fail word"
    }

    const guess = (correct) => {
        setGuessed(true);
        if (!correct) {
            setWrongAnswers([...wrongAnswers, currWord]);
        } else {
            setCorrectAnswers([...correctAnswers, currWord]);
            setWordCorrect(true); // Save such that it can be undone
        }
    };

    const reset = (newWords) => {
        setCurrIndex(-1);
        setWrongAnswers([]);
        setCorrectAnswers([]);

        setWords(newWords); // Init test words
        setTestState(0);
    };

    useEffect(() => {
        getTestData().then(words => {
            // Below code only get's executed when api response has arrived
            console.log("Received test words from api:\n", words);
            reset(words);
        });
    }, []);

    return <>
        {loading && (
            <div role="status" className="flex h-full justify-center items-center">
                <svg aria-hidden="true" className={`w-12 h-12 text-gray-200 fill-peach animate-spin`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        )}
        {!loading && <>
            {/* What to display before test has been started */}
            {testState === 0 && (
                <div className="flex h-full justify-center items-center">
                    <button className="focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-bright-green transition duration-150 ease-in-out hover:bg-dark-green bg-bright-green rounded text-white px-8 py-2 mr-4 text-xl" onClick={() => {
                        next();
                        setTestState(1);
                    }}>
                        Start
                    </button>
                </div>
            )}
            {/* What to display while test in progress */}
            {testState === 1 && <div className="h-full flex flex-col items-center">
                {/* Progress bar */}
                <div className='h-4 w-2/3 rounded-full bg-gray-600 mt-4'>
                    <div style={{ width: `${currIndex / (words.length-1) * 100}%`}} className={`h-full rounded-full bg-bright-green duration-300`}></div>
                </div>

                {/* Test */}
                {displayChinese && <Chinese allWords={words} currWord={currWord} onGuess={(correct) => guess(correct)} />}
                {!displayChinese && <English allWords={words} currWord={currWord} onGuess={(correct) => guess(correct)} />}

                {/* Example sentence containing word that shows up after guess */}
                {guessed && <div className={`${!displayChinese && "absolute bottom-0"} flex flex-col items-center w-full bg-gray-700 shadow-2xl rounded-t-xl`}>
                    {currWord.sentence_chinese.length > 0 && <div className="mt-4 text-center text-white w-10/12">
                        <h1>Example sentence:</h1>
                        <h1>{currWord.sentence_chinese}</h1>
                        <h1>{currWord.sentence_english}</h1>
                    </div>}
                    
                    <div className="flex justify-center items-center my-4">
                        {/* Next button that shows up after a guess has been made */}
                        <button className={`focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-bright-green transition duration-150 ease-in-out hover:bg-dark-green bg-bright-green rounded text-white px-8 py-2 mr-2 text-xl`}
                        onClick={next}>
                            {currIndex < words.length-1 ? "Next" : "Results"}
                        </button>
                        {wordCorrect && <button className={`h-2/3 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-red-400 transition duration-150 ease-in-out hover:bg-dark-green bg-red-400 rounded text-white px-2 py-0 text-sm`} onClick={changeToFailed}>
                                Fail
                            </button>
                        }
                    </div>
                </div>}
            </div>}

            {/* What to display after test */}
            {testState === 2 && (
                <div className="flex h-full justify-center items-center">
                    <article className={`bg-gray-900 text-center text-white shadow-2xl rounded-2xl p-5 border-gray-400 border-4`}>
                        <h1 className="font-bold text-3xl underline mb-16">Results</h1>
                        <h1 className="font-bold text-3xl mb-10">Correct: {words.length - wrongAnswers.length}/{words.length}</h1>
                        <div className="flex justify-center gap-10">
                            <button className={`bg-gray-700 border-2 border-gray-400 px-2 py-1 text-white rounded-md cursor-pointer ${wrongAnswers.length === 0 && "hidden"}`} onClick={() => reset(wrongAnswers)}>
                                Practice failed
                            </button>
                            <button className="bg-gray-700 border-2 border-gray-400 px-2 py-1 text-white rounded-md cursor-pointer" onClick={onNewTest}>New Test</button>
                        </div>
                    </article>
                </div>
            )}
        </>}
    </>
}

export default Test;