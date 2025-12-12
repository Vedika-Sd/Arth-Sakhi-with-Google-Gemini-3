import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Loader2, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { NewsResponse } from '../types';

interface FinancialNewsProps {
  data: NewsResponse;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const FinancialNews: React.FC<FinancialNewsProps> = ({ data, onRefresh, isRefreshing }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expansion state when data changes (e.g. user refreshes)
  useEffect(() => {
    setIsExpanded(false);
  }, [data]);

  if (!data) return null;

  // Determine if text is long enough to warrant truncation
  const isLongText = data.summary.length > 400;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl group">
      
      {/* Loading Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl fade-in">
          <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-subtle">
             <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
             <span className="text-sm font-semibold text-slate-600">Updating news...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 shadow-sm group-hover:scale-105 transition-transform">
                <Newspaper className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">Market Pulse</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Live Updates</span>
                </div>
            </div>
        </div>
        <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="group/btn flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all border border-transparent hover:border-orange-100 focus:ring-2 focus:ring-orange-200 outline-none"
            title="Refresh News"
        >
            <span className="text-xs font-semibold hidden sm:inline-block">Refresh</span>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-5 relative z-10">
        {data.summary ? (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 relative">
                <div 
                  className={`prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium transition-all duration-500 ease-in-out ${
                    !isExpanded && isLongText ? 'max-h-48 overflow-hidden' : ''
                  }`}
                >
                    {/* Basic parsing to handle bullet points and paragraphs nicely */}
                    {data.summary.split('\n').map((line, i) => {
                        const cleanLine = line.trim();
                        if (!cleanLine) return <div key={i} className="h-2" />;
                        
                        // Check if line looks like a list item or header
                        const isListItem = cleanLine.startsWith('-') || cleanLine.startsWith('•') || /^\d+\./.test(cleanLine);
                        const isHeader = cleanLine.startsWith('#') || cleanLine.startsWith('**');

                        return (
                            <p 
                                key={i} 
                                className={`
                                    ${isListItem ? 'pl-3 border-l-2 border-orange-200 mb-2' : 'mb-3'} 
                                    ${isHeader ? 'font-bold text-slate-900 mt-4 mb-2' : ''}
                                    last:mb-0
                                `}
                            >
                                {cleanLine.replace(/^[-•#*]+\s*/, '')}
                            </p>
                        );
                    })}
                </div>
                
                {/* Gradient Fade for Collapsed State */}
                {!isExpanded && isLongText && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-xl" />
                )}

                {/* Read More / Less Button */}
                {isLongText && (
                  <div className={`flex justify-center ${!isExpanded ? 'absolute bottom-2 left-0 right-0 z-10' : 'mt-4'}`}>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-white/90 hover:bg-white text-orange-600 text-xs font-bold uppercase tracking-wide border border-orange-200 rounded-full shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="h-3 w-3" /></>
                      ) : (
                        <>Read More <ChevronDown className="h-3 w-3" /></>
                      )}
                    </button>
                  </div>
                )}
            </div>
        ) : (
             <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No news updates available at the moment.
             </div>
        )}

        {/* Sources Footer */}
        {data.sources && data.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sources & Further Reading</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.sources.map((source, idx) => (
                    <a 
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-2 px-3 py-2 bg-white hover:bg-orange-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:border-orange-200 hover:text-orange-700 transition-all shadow-sm hover:shadow-md max-w-full"
                        title={source.title}
                    >
                        <span className="truncate max-w-[200px]">{source.title}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FinancialNews;