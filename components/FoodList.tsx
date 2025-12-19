import React from 'react';
import { FoodItem } from '../types';
import { Trash2, Utensils } from 'lucide-react';

interface FoodListProps {
  items: FoodItem[];
  onDelete: (id: string) => void;
}

const FoodList: React.FC<FoodListProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
            <Utensils size={20} />
        </div>
        <p className="text-slate-400">No food logged today.</p>
        <p className="text-sm text-slate-300">Start by typing or snapping a photo!</p>
      </div>
    );
  }

  // Reverse to show newest first
  const displayItems = [...items].reverse();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 px-1">Today's Log</h3>
      {displayItems.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-300">
          
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Utensils size={20} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-slate-800 truncate pr-2">{item.name}</h4>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-slate-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-2">{item.quantity} • {item.mealType}</p>
            
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                {item.calories} kcal
              </span>
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                P: {Math.round(item.macros.protein)}g
              </span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                C: {Math.round(item.macros.carbs)}g
              </span>
              <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                F: {Math.round(item.macros.fat)}g
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
