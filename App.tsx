import React, { useState } from 'react';
import { UserInput, FinancialPlanResponse, NewsResponse, AppState } from './types';
import InputForm from './components/InputForm';
import FinancialPlan from './components/FinancialPlan';
import LoadingState from './components/LoadingState';
import { generateFinancialPlan, fetchFinancialNews } from './services/geminiService';
import { Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [planData, setPlanData] = useState<FinancialPlanResponse | null>(null);
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [lastInput, setLastInput] = useState<UserInput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isNewsRefreshing, setIsNewsRefreshing] = useState(false);

  const handleFormSubmit = async (input: UserInput) => {
    setAppState(AppState.LOADING);
    setLastInput(input);
    setErrorMsg("");
    setNewsData(null);
    
    try {
      // Fetch plan and news in parallel
      const [planResult, newsResult] = await Promise.all([
        generateFinancialPlan(input),
        fetchFinancialNews(input.category, input.language)
      ]);

      setPlanData(planResult);
      setNewsData(newsResult);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to generate plan. Please check your internet connection or API Key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleRefreshNews = async () => {
    if (!lastInput) return;
    
    setIsNewsRefreshing(true);
    try {
        const newsResult = await fetchFinancialNews(lastInput.category, lastInput.language);
        setNewsData(newsResult);
    } catch (error) {
        console.error("Error refreshing news:", error);
    } finally {
        setIsNewsRefreshing(false);
    }
  };

  const handleReset = () => {
    setAppState(AppState.FORM);
    setPlanData(null);
    setNewsData(null);
    setErrorMsg("");
    setIsNewsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 p-2 rounded-lg">
                 <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-teal-900">Arth Sakhi</span>
            </div>
            <div className="flex items-center">
                <span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                    AI Financial Guide
                </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {appState === AppState.FORM && (
            <div className="animate-fade-in space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 font-serif">
                        Master Your Money <br />
                        <span className="text-teal-600">Secure Your Future</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Arth Sakhi provides personalized financial advice tailored for Indian families, students, farmers, and business owners.
                    </p>
                </div>
                <InputForm onSubmit={handleFormSubmit} isLoading={false} />
            </div>
        )}

        {appState === AppState.LOADING && <LoadingState />}

        {appState === AppState.ERROR && (
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
                <p className="text-slate-600 mb-6">{errorMsg}</p>
                <button 
                    onClick={() => setAppState(AppState.FORM)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                >
                    Try Again
                </button>
            </div>
        )}

        {appState === AppState.RESULT && planData && lastInput && (
            <FinancialPlan 
                data={planData}
                newsData={newsData} 
                onReset={handleReset} 
                userInput={lastInput}
                onRefreshNews={handleRefreshNews}
                isNewsRefreshing={isNewsRefreshing}
            />
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Arth Sakhi. AI Advice can be incorrect. Please consult a professional before big decisions.</p>
      </footer>
    </div>
  );
};

export default App;