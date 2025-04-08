import React, { useState, useEffect } from 'react';

const ResponsiveTest = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Determine device type
    const width = window.innerWidth;
    if (width < 640) {
      setDeviceType('Mobile');
    } else if (width < 1024) {
      setDeviceType('Tablet');
    } else {
      setDeviceType('Desktop');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowSize.width]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Responsive Testing</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Device Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Screen Width:</p>
            <p className="text-lg">{windowSize.width}px</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Screen Height:</p>
            <p className="text-lg">{windowSize.height}px</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Device Type:</p>
            <p className="text-lg">{deviceType}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">User Agent:</p>
            <p className="text-sm break-words">{navigator.userAgent}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Responsive Elements Test</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Grid Layout</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded">Item 1</div>
              <div className="bg-blue-100 p-4 rounded">Item 2</div>
              <div className="bg-blue-100 p-4 rounded">Item 3</div>
              <div className="bg-blue-100 p-4 rounded">Item 4</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Flex Layout</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-green-100 p-4 rounded flex-1">Flex Item 1</div>
              <div className="bg-green-100 p-4 rounded flex-1">Flex Item 2</div>
              <div className="bg-green-100 p-4 rounded flex-1">Flex Item 3</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Typography</h3>
            <h1 className="text-4xl mb-2">Heading 1</h1>
            <h2 className="text-3xl mb-2">Heading 2</h2>
            <h3 className="text-2xl mb-2">Heading 3</h3>
            <p className="text-base mb-2">Regular paragraph text</p>
            <p className="text-sm">Small text</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Form Elements</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Text input" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Select option 1</option>
                <option>Select option 2</option>
                <option>Select option 3</option>
              </select>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md">
                Button
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Touch Interaction Test</h2>
        <div 
          className="w-full h-40 bg-indigo-100 rounded-lg flex items-center justify-center touch-action-manipulation"
          onTouchStart={() => console.log('Touch started')}
          onTouchMove={() => console.log('Touch moved')}
          onTouchEnd={() => console.log('Touch ended')}
        >
          <p className="text-center">Touch this area to test touch events</p>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;
