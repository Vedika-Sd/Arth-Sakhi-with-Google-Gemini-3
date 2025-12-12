import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full shadow-lg border-2 border-teal-100">
                <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
            </div>
        </div>
        <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Generating Your Plan...</h3>
            <p className="text-slate-500">Arth Sakhi is analyzing your profile to build the best financial roadmap for you.</p>
        </div>
    </div>
  );
};

export default LoadingState;