import React, { useState, useMemo } from 'react';
import { FoodItem, DailyGoal, MacroNutrients } from './types';
import FoodInput from './components/FoodInput';
import NutrientDisplay from './components/NutrientDisplay';
import FoodList from './components/FoodList';
import { Flame, Menu, ChevronRight } from 'lucide-react';

// Default daily goals
const DEFAULT_GOAL: DailyGoal = {
  calories: 2200,
  protein: 140,
  carbs: 250,
  fat: 70
};

const App: React.FC = () => {
  const [dailyLog, setDailyLog] = useState<FoodItem[]>([]);
  const [goal] = useState<DailyGoal>(DEFAULT_GOAL);

  const handleAddFood = (item: FoodItem) => {
    setDailyLog((prev) => [...prev, item]);
  };

  const handleDeleteFood = (id: string) => {
    setDailyLog((prev) => prev.filter(item => item.id !== id));
  };

  // Calculate totals
  const totals = useMemo(() => {
    return dailyLog.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      macros: {
        protein: acc.macros.protein + item.macros.protein,
        carbs: acc.macros.carbs + item.macros.carbs,
        fat: acc.macros.fat + item.macros.fat
      }
    }), { calories: 0, macros: { protein: 0, carbs: 0, fat: 0 } as MacroNutrients });
  }, [dailyLog]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Flame size={20} className="fill-current" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">NutriLens AI</h1>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-6">
        
        {/* Date Selector (Visual Only) */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</p>
            <h2 className="text-2xl font-bold text-slate-800">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
          </div>
          <button className="text-emerald-600 font-medium text-sm flex items-center gap-1">
            View History <ChevronRight size={16} />
          </button>
        </div>

        {/* Stats */}
        <NutrientDisplay 
          currentMacros={totals.macros} 
          totalCalories={totals.calories} 
          goal={goal} 
        />

        {/* Input */}
        <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Add Meal</h3>
            <FoodInput onAddFood={handleAddFood} />
        </div>

        {/* List */}
        <FoodList items={dailyLog} onDelete={handleDeleteFood} />

      </main>
      
      {/* Mobile Disclaimer */}
      <div className="max-w-xl mx-auto px-4 text-center mt-8 text-xs text-slate-400 pb-8">
        <p>Nutritional values are AI estimates. Not for medical use.</p>
      </div>

    </div>
  );
};

export default App;
