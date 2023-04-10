import { useEffect, useState, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const Chat = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [text, setText] = useState("");
    const inputElement = useRef();
    const messagesEndRef = useRef(null)
    const [retrievingMessage, setRetrievingMessage] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory])
  
    const sendChat = async () => {
        if (text.trim().length === 0 || retrievingMessage) return;
        setRetrievingMessage(true);
        setChatHistory([...chatHistory, text]);
        inputElement.current.value = '';
        const response = await fetch("https://flask-production-2000.up.railway.app/chat", {
            method: 'POST',
            body: JSON.stringify({
                text: text
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
        console.log(result);
        setChatHistory([...chatHistory, text, result]);
        setRetrievingMessage(false);
    }

    const resetChat = async () => {
        const response = await fetch("https://flask-production-2000.up.railway.app/reset-chat", {
            method: 'POST',
            body: JSON.stringify({
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
    }

    useEffect(() => {
        resetChat();
    }, []);
  
    return <>
        <div className='h-full bg-gray-800 px-5 py-5 overflow-y-auto scrollbar'>
            <div className='h-full w-full flex flex-col gap-12'>
                {chatHistory.map((message, i) => (
                    <div key={i} className={`w-full flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-2 rounded-t-xl text-white border-2 border-gray-400 ${i % 2 === 0 ? "rounded-bl-xl bg-gray-900" : "rounded-br-xl bg-gray-500"}`}>
                            <h1 className="break-all">{message}</h1>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
        <div className='min-h-[70px] flex-none bg-gray-800 py-3 px-3'>
            <div className='relative h-full bg-gray-600 rounded-md py-2 px-2 border-2 border-gray-500'>
                <IoMdSend className="absolute right-3 bottom-1 -translate-y-1/2 text-interactives cursor-pointer focus:" size={20} onClick={sendChat} />
                <textarea type="text" rows="1" ref={inputElement} placeholder="Search" className='w-full break-all text-white bg-transparent focus:outline-none' onChange={e => setText(e.target.value)}></textarea>
            </div>
        </div>
    </>
}

export default Chat