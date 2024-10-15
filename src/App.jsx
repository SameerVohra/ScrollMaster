import { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(100);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollInterval = useRef(null);

  const handleScroll = () => {
    setIsScrolling((prev) => !prev);
  };

  useEffect(() => {
    const startScroll = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(tabs);
        const tabId = tabs[0]?.id;
        if (tabId) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: (scrollSpeed) => {
              window.scrollInterval = setInterval(() => {
                window.scrollBy(0, scrollSpeed / 10);
              }, 100);
            },
            args: [speed],
          });
        }
      });
    };

    const stopScroll = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
              clearInterval(window.scrollInterval);
            },
          });
        }
      });
    };

    if (isScrolling) {
      startScroll();
    } else {
      stopScroll();
    }

    return () => stopScroll();
  }, [isScrolling, speed]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold">ScrollMaster</h1>

      <div className="w-3/4 md:w-1/2">
        <Slider
          aria-label="Scroll Speed"
          value={speed}
          step={10}
          marks
          min={50}
          max={500}
          onChange={(_, newVal) => setSpeed(newVal)}
          sx={{
            color: '#4ade80',
          }}
        />
        <p className="text-center mt-2 text-lg">
          Scroll Speed: <span className="font-semibold">{speed}</span>
        </p>
      </div>

      <button
        onClick={handleScroll}
        className={`px-6 py-2 rounded-lg text-lg font-medium transition-colors 
        ${isScrolling ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}`}
      >
        {isScrolling ? 'Stop Scrolling' : 'Start Scrolling'}
      </button>
    </div>
  );
}

export default App;
