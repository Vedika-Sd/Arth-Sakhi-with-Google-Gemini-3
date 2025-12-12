import React, { useState } from 'react';
import { UserInput } from '../types';
import { CATEGORIES, RISK_LEVELS, LANGUAGES } from '../constants';
import { ArrowRight, Wallet, User, Target, MapPin, Globe, ShieldAlert } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    category: CATEGORIES[0],
    monthly_income: 25000,
    monthly_expenses: 15000,
    age: 25,
    location: '',
    risk_level: 'Low',
    goal: '',
    language: 'en'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthly_income' || name === 'monthly_expenses' || name === 'age' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-teal-700 p-6 text-white">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
          <User className="h-6 w-6" />
          Tell us about yourself
        </h2>
        <p className="text-teal-100 mt-2">
          We need a few details to create your personalized financial roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={15}
              max={100}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Wallet className="h-4 w-4 text-teal-600" />
              Monthly Income (₹)
            </label>
            <input
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleChange}
              min={0}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Wallet className="h-4 w-4 text-red-500" />
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              name="monthly_expenses"
              value={formData.monthly_expenses}
              onChange={handleChange}
              min={0}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Location & Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-teal-600" />
              Location (City/State)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Pune, Maharashtra"
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>

           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Target className="h-4 w-4 text-teal-600" />
              Main Financial Goal
            </label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g. Buy a home, Kids education"
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Risk & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 text-teal-600" />
              Risk Appetite
            </label>
            <select
              name="risk_level"
              value={formData.risk_level}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              {RISK_LEVELS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Globe className="h-4 w-4 text-teal-600" />
              Preferred Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2 ${
            isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
          }`}
        >
          {isLoading ? 'Analyzing...' : (
            <>
              Generate Plan <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;