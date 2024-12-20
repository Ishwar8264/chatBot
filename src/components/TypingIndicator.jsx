import React from 'react';
import { FaRobot } from 'react-icons/fa';

const TypingIndicator = () => (
  <div className='flex gap-2'>
    <div>
      <FaRobot size={24} />
    </div>
    <div className="my-2 text-gray-500 flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
    </div>
  </div>

);

export default TypingIndicator;
