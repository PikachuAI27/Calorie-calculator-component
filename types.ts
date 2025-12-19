export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  quantity: string;
  confidence?: 'high' | 'medium' | 'low';
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  timestamp: number;
  imageUrl?: string;
}

export interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export enum AnalysisType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}
