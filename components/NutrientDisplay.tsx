import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyGoal, MacroNutrients } from '../types';

interface NutrientDisplayProps {
  currentMacros: MacroNutrients;
  totalCalories: number;
  goal: DailyGoal;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue (Protein), Green (Carbs), Orange (Fat)

const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ currentMacros, totalCalories, goal }) => {
  const data = [
    { name: 'Protein', value: currentMacros.protein },
    { name: 'Carbs', value: currentMacros.carbs },
    { name: 'Fat', value: currentMacros.fat },
  ];

  const percentage = Math.min(100, Math.round((totalCalories / goal.calories) * 100));
  
  // Prevent empty chart visual
  const chartData = data.every(d => d.value === 0) 
    ? [{ name: 'Empty', value: 1 }] 
    : data;
    
  const chartColors = data.every(d => d.value === 0) 
    ? ['#e2e8f0'] 
    : COLORS;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Calories Progress */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-slate-800">{totalCalories}</span>
              <span className="text-sm text-slate-400 font-medium ml-1">/ {goal.calories} kcal</span>
            </div>
            <span className={`text-sm font-semibold ${percentage > 100 ? 'text-red-500' : 'text-emerald-600'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${percentage > 100 ? 'bg-red-400' : 'bg-emerald-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Macros Chart */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  paddingAngle={data.every(d => d.value === 0) ? 0 : 5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Protein: <b>{Math.round(currentMacros.protein)}g</b></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Carbs: <b>{Math.round(currentMacros.carbs)}g</b></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">Fat: <b>{Math.round(currentMacros.fat)}g</b></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NutrientDisplay;
