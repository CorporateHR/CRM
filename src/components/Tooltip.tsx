import { ReactNode, useState } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className="absolute z-10 p-2 -mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg 
                     transform -translate-y-full left-1/2 -translate-x-1/2 
                     before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 
                     before:bottom-[-5px] before:border-l-8 before:border-r-8 
                     before:border-t-8 before:border-t-gray-800 
                     before:border-l-transparent before:border-r-transparent"
        >
          {text}
        </div>
      )}
    </div>
  );
}
