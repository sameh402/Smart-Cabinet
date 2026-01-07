
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.5 : 1;
  const color = "#00337C"; // Corporate Blue from image
  
  return (
    <div className="flex flex-col items-center select-none" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <div className="flex items-center gap-4 w-full justify-center">
        {/* Left Double Lines */}
        <div className="flex flex-col gap-[4px] flex-grow min-w-[40px]">
          <div style={{ height: '3px', backgroundColor: color }}></div>
          <div style={{ height: '3px', backgroundColor: color }}></div>
        </div>

        {/* Logo Center Part */}
        <div className="flex items-center gap-3">
          {/* Blue Drop */}
          <svg width="45" height="55" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0C50 0 0 65 0 92C0 118 22.5 130 50 130C77.5 130 100 118 100 92C100 65 50 0 50 0Z" fill={color} />
            <path d="M40 85C40 95 35 110 25 110C15 110 15 95 25 80C30 75 40 85 40 85Z" fill="white" opacity="0.4" />
          </svg>
          
          {/* DOT Stencil Text */}
          <div className="flex items-center font-black text-6xl tracking-tighter" style={{ color: color, fontFamily: 'sans-serif' }}>
            {/* Custom D with gap */}
            <div className="relative flex items-center">
              <span>D</span>
              <div className="absolute w-full h-[6px] bg-[#f8fafc] top-1/2 -translate-y-1/2"></div>
            </div>
            {/* Custom O with gap */}
            <div className="relative flex items-center mx-1">
              <span>O</span>
              <div className="absolute w-full h-[6px] bg-[#f8fafc] top-1/2 -translate-y-1/2"></div>
            </div>
            <span>T</span>
          </div>
        </div>

        {/* Right Double Lines */}
        <div className="flex flex-col gap-[4px] flex-grow min-w-[40px]">
          <div style={{ height: '3px', backgroundColor: color }}></div>
          <div style={{ height: '3px', backgroundColor: color }}></div>
        </div>
      </div>
      
      <p className="text-xl font-black tracking-[0.05em] mt-2 whitespace-nowrap uppercase italic" style={{ color: color }}>
        DIAMOND OILFIELD TECHNOLOGY
      </p>
    </div>
  );
};

export default Logo;
