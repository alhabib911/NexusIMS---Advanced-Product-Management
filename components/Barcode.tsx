
import React from 'react';

interface BarcodeProps {
  value: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value }) => {
  // Generate a pattern of bars with varying widths to look like a real 1D barcode
  // We use the string value to derive a repeatable but realistic-looking sequence
  const bars = Array.from({ length: 60 }).map((_, i) => {
    const charCode = value.charCodeAt(i % value.length);
    // Determine bar width based on index and character code
    // Values: 1, 2, or 3 pixels
    const width = ((charCode + i) % 3) + 1;
    // Determine if it's a gap or a bar
    const isBar = (charCode * (i + 1)) % 5 !== 0;
    
    return { width, isBar };
  });

  return (
    <div className="flex flex-col items-center bg-white p-3 border border-gray-100 rounded-xl shadow-sm select-none">
      <div className="flex h-14 items-stretch bg-white px-2">
        {/* Guard bars (long bars at the beginning) */}
        <div className="flex h-16 -mt-1 gap-[1px]">
          <div className="w-[1.5px] bg-black" />
          <div className="w-[1.5px] bg-transparent" />
          <div className="w-[1.5px] bg-black" />
        </div>
        
        {/* Main data bars */}
        <div className="flex items-stretch gap-[1px] px-1">
          {bars.map((bar, i) => (
            <div 
              key={i} 
              className={`${bar.isBar ? 'bg-black' : 'bg-transparent'}`} 
              style={{ width: `${bar.width}px` }}
            />
          ))}
        </div>

        {/* Guard bars (long bars at the end) */}
        <div className="flex h-16 -mt-1 gap-[1px]">
          <div className="w-[1.5px] bg-black" />
          <div className="w-[1.5px] bg-transparent" />
          <div className="w-[1.5px] bg-black" />
        </div>
      </div>
      <div className="mt-2 text-[12px] font-medium text-gray-900 tracking-[0.3em] font-mono tabular-nums leading-none">
        {value}
      </div>
    </div>
  );
};
