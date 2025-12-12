import React, { useState } from 'react';
import { FinancialPlanResponse, NewsResponse, UserInput } from '../types';
import FinancialNews from './FinancialNews';
import ChatAssistant from './ChatAssistant';
import InvestmentJourney from './InvestmentJourney';
import { 
  TrendingUp, 
  ShieldCheck, 
  Landmark, 
  AlertTriangle, 
  HelpCircle,
  PiggyBank,
  BookOpen,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialPlanProps {
  data: FinancialPlanResponse;
  newsData: NewsResponse | null;
  onReset: () => void;
  userInput: UserInput;
  onRefreshNews: () => void;
  isNewsRefreshing: boolean;
}

const FinancialPlan: React.FC<FinancialPlanProps> = ({ 
  data, 
  newsData, 
  onReset, 
  userInput,
  onRefreshNews,
  isNewsRefreshing
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'chat' | 'journey'>('concepts');
  
  const savings = Math.max(0, userInput.monthly_income - userInput.monthly_expenses);
  const chartData = [
    { name: 'Expenses', value: userInput.monthly_expenses, color: '#EF4444' }, // Red
    { name: 'Savings', value: savings, color: '#10B981' }, // Emerald
  ];

  // Construct context string for the chat assistant
  const chatContext = `
    User Profile:
    - Role/Category: ${userInput.category}
    - Age: ${userInput.age}
    - Monthly Income: ${userInput.monthly_income}
    - Monthly Expenses: ${userInput.monthly_expenses}
    - Location: ${userInput.location}
    - Risk Level: ${userInput.risk_level}
    - Main Goal: ${userInput.goal}
    - Language: ${userInput.language}

    Current Plan Summary:
    ${data.summary}
    
    Recommended Savings: ${data.recommended_plan.monthly_saving_amount}
    Investment Strategy: ${data.recommended_plan.investment_plan}
  `;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border-l-8 border-teal-500">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Financial Summary</h2>
        <p className="text-lg text-slate-600 leading-relaxed">{data.summary}</p>
        
        {/* Simple Visualizer */}
        <div className="h-64 w-full mt-6 bg-slate-50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-around">
            <div className="text-center md:text-left">
                <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Current Flow</p>
                <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Expenses: <span className="font-mono font-bold">₹{userInput.monthly_expenses}</span></p>
                    <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Potential Savings: <span className="font-mono font-bold">₹{savings}</span></p>
                </div>
            </div>
            <div className="h-full w-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Savings & Investment */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <PiggyBank className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Savings & Investment</h3>
          </div>
          <div className="space-y-4 flex-grow">
            <div>
              <p className="text-sm text-slate-500 font-semibold">Recommended Monthly Savings</p>
              <p className="text-lg font-medium text-slate-900">{data.recommended_plan.monthly_saving_amount}</p>
            </div>
             <div>
              <p className="text-sm text-slate-500 font-semibold">Emergency Fund</p>
              <p className="text-sm text-slate-700">{data.recommended_plan.emergency_fund_plan}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-slate-500 font-semibold mb-1">Investment Strategy</p>
              <p className="text-sm text-slate-800">{data.recommended_plan.investment_plan}</p>
            </div>
          </div>
        </div>

        {/* Insurance & Govt Schemes */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Protection & Benefits</h3>
          </div>
          <div className="space-y-4 flex-grow">
            <div>
              <p className="text-sm text-slate-500 font-semibold">Insurance</p>
              <p className="text-sm text-slate-800">{data.recommended_plan.insurance_recommendation}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-2">Government Schemes for You</p>
              <ul className="space-y-2">
                {data.recommended_plan.govt_schemes.map((scheme, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 bg-purple-50 p-2 rounded">
                        <Landmark className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        {scheme}
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Financial News Section */}
      {newsData && (
        <FinancialNews 
          data={newsData} 
          onRefresh={onRefreshNews}
          isRefreshing={isNewsRefreshing}
        />
      )}

      {/* Dynamic Learning & Chat Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col gap-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-600" />
                    Learn & Act
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Tools to help you understand and execute your plan.</p>
              </div>
              
              <div className="flex bg-slate-200 p-1 rounded-lg mt-4 md:mt-0 overflow-x-auto max-w-full">
                  <button 
                    onClick={() => setActiveTab('concepts')}
                    className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'concepts' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Concepts
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask Guide
                  </button>
                  <button 
                    onClick={() => setActiveTab('journey')}
                    className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'journey' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Briefcase className="h-4 w-4" />
                    Start Investing Journey
                  </button>
              </div>
           </div>
        </div>

        <div className="p-1">
            {activeTab === 'concepts' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 animate-fade-in">
                    {data.explanations.map((item, idx) => (
                        <div key={idx} className="bg-white p-6">
                            <h4 className="font-bold text-teal-700 mb-2">{item.topic}</h4>
                            <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'chat' && (
                <div className="p-4 bg-slate-100 animate-fade-in">
                    <ChatAssistant context={chatContext} />
                </div>
            )}

            {activeTab === 'journey' && (
                <div className="p-4 bg-indigo-50 animate-fade-in">
                    <InvestmentJourney context={chatContext} />
                </div>
            )}
        </div>
      </div>

      {/* Actionable Steps */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
        <h3 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Your Next Steps
        </h3>
        <div className="space-y-4">
            {data.steps_to_start.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                    </div>
                    <p className="text-slate-800 pt-1 font-medium">{step}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-100">
        <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Important Warnings
        </h3>
        <ul className="space-y-2">
            {data.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-700 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    {warning}
                </li>
            ))}
        </ul>
      </div>

      <div className="text-center pt-8 pb-12">
        <button 
            onClick={onReset}
            className="text-slate-500 hover:text-teal-600 font-medium transition flex items-center gap-2 mx-auto"
        >
            <HelpCircle className="h-4 w-4" />
            Start a new plan
        </button>
      </div>

    </div>
  );
};

export default FinancialPlan;