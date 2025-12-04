import React from 'react';

const LoadingDots: React.FC = () => {
    return (
        <span className="inline-flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.15s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.3s]"></span>
        </span>
    );
};

export default LoadingDots;
