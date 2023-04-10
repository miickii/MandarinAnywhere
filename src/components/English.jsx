import React, { useEffect, useState, useRef } from "react";

const English = ({ allWords, currWord, onGuess }) => {
    const [correctCharacters, setCorrectCharacters] = useState([]);
    const [choices, setChoices] = useState([]);
    const [guessed, setGuessed] = useState(false);
    const [selected, setSelected] = useState([]);
    // showHint turns true when player clicks on hint button
    const [showHint, setShowHint] = useState(false);
    // Each test type receives showHint boolean, and each test type component individually handles what to do when showHint=true
    const [hint, setHint] = useState("");

    function shuffleArray(arr) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled;
    }
    function getRandomSubarray(arr, size) {
        var shuffled = shuffleArray(arr);
        return shuffled.slice(0, Math.min(size, arr.length));
    }
    
    // What to do on each new word in test
    useEffect(() => {
        setCorrectCharacters(currWord.characters);
        setGuessed(false);
        setSelected([]);

        // store all words except for current word in array
        const notCurrent = allWords.filter(word => word.chinese !== currWord.chinese);

        // Select a random subset of the notCurrent array for the available choices (if this is a sentence test, we only include the words from the current sentence)
        const availableWords = getRandomSubarray(notCurrent, 5);

        // insert the current word to availableWords
        availableWords.push(currWord);

        // availableWords is now an array of words, we want to make it an array of each individual character
        const characters = [];
        availableWords.forEach((word) => word.characters.forEach((character) => characters.push(character)));

        setChoices(shuffleArray(characters));

        // Set test hint to be pinyin of word
        setHint("Pinyin: " + currWord.pinyin);
        setShowHint(false);
    }, [currWord]);

    const selectCharacter = (character, index) => {
        if (!guessed) {
            // Add character to selected characters
            setSelected([...selected, character]);

            // Remove character from choices
            const newChoices = [...choices];
            newChoices.splice(index, 1);
            setChoices(newChoices);
        }
    };

    const removeCharacter = (character, index) => {
        if (!guessed) {
            // Add character to choices
            setChoices([...choices, character]);

            // Remove from selected characters
            const newSelected = [...selected];
            newSelected.splice(index, 1);
            setSelected(newSelected);
        }
    };

    const characterIsCorrect = (character, index) => {
        return index < correctCharacters.length && character === correctCharacters[index];
    }

    const guess = () => {
        if (!guessed && selected.length > 0) {
            setGuessed(true);
            console.log(selected.join() === correctCharacters.join());
            onGuess(selected.join() === correctCharacters.join());
        }
    }

    return <div className="h-full">
        {/* Hint that can be activated */}
        <div className="flex flex-col h-1/2 items-center justify-end">
            {!guessed && <>
                <h1 className={`mb-1 text-white ${!showHint && "opacity-0"}`}>{hint}</h1>
                <button className="mb-3 text-xl font-semibold underline" onClick={() => setShowHint(!showHint)}>Hint</button>
            </>}
            <article className={`mb-20 bg-gray-500 min-w-[16rem] max-w-xs text-white text-center shadow-2xl rounded-2xl p-4 border-gray-400 border-4`}>
                <h1 className="font-bold text-3xl">{currWord.short_english}</h1>
                {guessed && <>
                    <h1 className="font-bold text-2xl mt-4 text-gray-700">{currWord.chinese} - {currWord.pinyin}</h1>
                </>}
            </article>
        </div>
        
        <div className="flex flex-col justify-end h-1/2 items-center">
            <div className="pb-2 min-w-[320px] h-10 border-b-4 border-gray-600 flex justify-start">
                {selected.map((character, i) => (
                    <article key={i} className={`text-white border-2 border-gray-400 font-bold w-fit text-center rounded-2xl h-8 px-4 mx-2 mb-4 flex items-center cursor-pointer ${guessed ? (characterIsCorrect(character, i) ? "bg-bright-green" : "!bg-red-400") : "bg-gray-900"}`} onClick={() => removeCharacter(character, i)}>
                        <h1 className="text-lg">{character}</h1>
                    </article>
                ))}
            </div>

            <div className="w-4/5 my-10 flex flex-wrap justify-center">
                {choices.map((character, i) => (
                    <article key={i} className="text-white border-2 border-gray-400 bg-gray-900 font-bold w-fit text-center rounded-2xl h-8 px-4 mx-2 mb-4 flex items-center cursor-pointer" onClick={() => selectCharacter(character, i)}>
                        <h1 className="text-lg">{character}</h1>
                    </article>
                ))}
            </div>

            <button className="w-10/12 mb-5 text-center text-md font-bold py-2 px-3 rounded-xl bg-bright-green focus:outline-none" onClick={guess}>
                CHECK
            </button>
        </div>
    </div>
}

export default English;