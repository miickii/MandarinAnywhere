import { useEffect, useState, useRef } from 'react';
import Dictionary from './components/Dictionary';
import Chat from './components/Chat';
import SelectTest from './components/SelectTest';
import DemoComponent from './components/DemoComponent';
import Database from './components/Database';

function App() {
  const [tool, setTool] = useState(0);
  const [showMenu, setShowMenu] = useState(true);

  const changeTool = (newTool) => {
    setTool(newTool);
  };

  return (
    <div className='relative flex flex-col justify-end h-[100svh] bg-gray-800'>
      {showMenu && <div className='py-2 border-b-2 border-gray-500 bg-gray-700 flex items-center justify-center gap-6'>
            <div className={`border-2 border-gray-400 px-2 py-1 text-white rounded-xl cursor-pointer ${tool===0 ? "bg-interactives" : "bg-gray-500"}`} onClick={() => changeTool(0)}>Dictionary</div>
            <div className={`border-2 border-gray-400 px-2 py-1 text-white rounded-xl cursor-pointer ${tool===1 ? "bg-interactives" : "bg-gray-500"}`} onClick={() => changeTool(1)}>Chat</div>
            <div className={`border-2 border-gray-400 px-2 py-1 text-white rounded-xl cursor-pointer ${tool===2 ? "bg-interactives" : "bg-gray-500"}`} onClick={() => changeTool(2)}>Test</div>
            <div className={`border-2 border-gray-400 px-2 py-1 text-white rounded-xl cursor-pointer ${tool===3 ? "bg-interactives" : "bg-gray-500"}`} onClick={() => changeTool(3)}>Database</div>
        </div>
      }
      {tool === 0 && <Dictionary showMenu={(show) => setShowMenu(show)} />}
      {/* <Dictionary /> */}
      {tool === 1 && <Chat />}
      {tool === 2 && <SelectTest />}
      {tool === 3 && <Database showMenu={(show) => setShowMenu(show)} />}
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