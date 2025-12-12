export interface UserInput {
  category: string;
  monthly_income: number;
  monthly_expenses: number;
  age: number;
  location: string;
  risk_level: string;
  goal: string;
  language: 'en' | 'hi' | 'mr';
}

export interface RecommendedPlan {
  monthly_saving_amount: string;
  emergency_fund_plan: string;
  investment_plan: string;
  insurance_recommendation: string;
  govt_schemes: string[];
}

export interface ExplanationItem {
  topic: string;
  description: string;
}

export interface FinancialPlanResponse {
  summary: string;
  recommended_plan: RecommendedPlan;
  explanations: ExplanationItem[];
  steps_to_start: string[];
  warnings: string[];
}

export interface NewsSource {
  title: string;
  url: string;
}

export interface NewsResponse {
  summary: string;
  sources: NewsSource[];
}

export enum AppState {
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}