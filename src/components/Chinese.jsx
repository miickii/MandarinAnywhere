import React, { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

const Chinese = ({ allWords, currWord, onGuess }) => {
    const [choices, setChoices] = useState([]);
    const [guessedWord, setGuessedWord] = useState(null);
    // showHint turns true when player clicks on hint button
    const [showHint, setShowHint] = useState(false);
    // Each test type receives showHint boolean, and each test type component individually handles what to do when showHint=true
    const [hint, setHint] = useState("");

    function getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, Math.min(size, arr.length));
    }

    const guess = (choice) => {
        if (!guessedWord) {
            setGuessedWord(choice);
            onGuess(choice.chinese === currWord.chinese);
        }
    }

    // What to do on each new word in test
    useEffect(() => {
        setGuessedWord(null);

        // store all words except for current word in array
        const notCurrent = allWords.filter(word => word.chinese !== currWord.chinese);

        // Select a random subset of the notCurrent array for the available choices
        const availableChoices = getRandomSubarray(notCurrent, 3);

        // insert the current word at a random position in available choices
        availableChoices.splice(Math.floor(Math.random() * (availableChoices.length + 0.99)), 0, currWord);

        setChoices(availableChoices);

        // Set test hint to be pinyin of word
        setHint("Pinyin: " + currWord.pinyin);
    }, [currWord]);

    return <div className="h-full">
        <div className="flex flex-col h-1/2 items-center justify-end">
            {/* Hint that can be activated */}
            {!guessedWord && <>
                <h1 className={`mb-1 text-white ${!showHint && "opacity-0"}`}>{hint}</h1>
                <button className="mb-3 text-xl font-semibold underline" onClick={() => setShowHint(!showHint)}>Hint</button>
            </>}
            <article className={`bg-gray-500 min-w-[16rem] max-w-xs text-white text-center shadow-2xl rounded-2xl p-4 border-gray-400 border-4`}>
                <h1 className="font-bold text-3xl">{currWord.chinese} <span className={`text-2xl ${!guessedWord && "hidden"}`}>- {currWord.pinyin}</span></h1>
                {guessedWord && <h1 className="font-bold text-2xl my-2 text-black">{currWord.short_english}</h1>}
            </article>
        </div>
        
        <div className="h-1/2 flex items-end justify-center">
            <div className="w-5/6 flex flex-wrap justify-center gap-2 mb-2">
                {choices.map((choice, i) => (
                    <article key={i} className={`text-white border-2 border-gray-400 font-bold w-fit text-center rounded-2xl px-4 py-1 mb-1 flex items-center cursor-pointer duration-300 hover:scale-110 ${guessedWord ? (choice === guessedWord && (guessedWord === currWord ? "bg-bright-green" : "bg-red-400")) : "bg-gray-900"}`} onClick={() => guess(choice)}>
                        <h1 className="text-sm">{choice.short_english}</h1>
                    </article>
                ))}
            </div>
        </div>
    </div>
}

export default Chinese;