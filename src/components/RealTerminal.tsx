import React from 'react';

interface RealTerminalProps {
  className?: string;
  height?: string;
}

function RealTerminal({ className = '', height = 'h-64' }: RealTerminalProps) {
  return (
    <div className={`bg-black text-green-400 font-mono text-sm p-4 rounded-lg ${height} ${className}`}>
      <div className="mb-2">
        <span className="text-yellow-400">AI Builder Terminal</span>
      </div>
      <div className="space-y-1">
        <div>C:\AI Builder&gt; npm start</div>
        <div className="text-blue-400">Starting development server...</div>
        <div className="text-green-400">✓ Server running on port 3000</div>
        <div className="text-green-400">✓ Ready for development</div>
        <div className="mt-2">
          <span>C:\AI Builder&gt; </span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}

export default RealTerminal;

