import { useEffect, useState, useRef } from 'react';
import Dictionary from './components/Dictionary';
import Chat from './components/Chat';

function App() {
  const [tool, setTool] = useState(0);

  const changeTool = (newTool) => {
    setTool(newTool);
  };

  return (
    <div className='relative flex flex-col justify-end h-[100svh] bg-gray-800'>
      {tool === 0 && <Dictionary changeTool={changeTool} />}
      {/* <Dictionary /> */}
      {tool === 1 && <Chat changeTool={changeTool}/>}
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