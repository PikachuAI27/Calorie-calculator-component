import React, { useState, useRef } from 'react';
import { Camera, Search, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeImageFood, analyzeTextFood } from '../services/geminiService';
import { FoodItem } from '../types';
import CameraCapture from './CameraCapture';

interface FoodInputProps {
  onAddFood: (item: FoodItem) => void;
}

const FoodInput: React.FC<FoodInputProps> = ({ onAddFood }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'camera'>('text');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const result = await analyzeTextFood(inputText);
      const newItem: FoodItem = {
        id: crypto.randomUUID(),
        ...result,
        mealType: 'Snack', // Default, logic could be enhanced to detect time of day
        timestamp: Date.now()
      };
      onAddFood(newItem);
      setInputText('');
    } catch (e) {
        console.error(e);
      setError('Could not analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    setShowCamera(false);
    setError('');
    try {
      const result = await analyzeImageFood(base64);
      const newItem: FoodItem = {
        id: crypto.randomUUID(),
        imageUrl: base64,
        ...result,
        mealType: 'Lunch', // Default
        timestamp: Date.now()
      };
      onAddFood(newItem);
    } catch (e) {
        console.error(e);
      setError('Could not identify food. Try a clearer photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'text' ? 'text-emerald-600 bg-emerald-50/50 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}
          `}
        >
          <Search size={18} />
          Text Search
        </button>
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'camera' ? 'text-emerald-600 bg-emerald-50/50 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}
          `}
        >
          <Camera size={18} />
          Photo AI
        </button>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 size={40} className="animate-spin text-emerald-500 mb-4" />
            <p className="font-medium text-slate-700">Analyzing your food...</p>
            <p className="text-xs mt-1">Estimating calories & macros</p>
          </div>
        ) : (
          <>
            {/* Text Input Mode */}
            {activeTab === 'text' && (
              <div className="flex flex-col gap-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="E.g., 1 large banana and a cup of black coffee..."
                  className="w-full p-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none text-slate-700 placeholder-slate-400 outline-none h-32"
                />
                <button
                  onClick={handleTextAnalysis}
                  disabled={!inputText.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
                >
                  <Sparkles size={18} />
                  Calculate Calories
                </button>
              </div>
            )}

            {/* Camera Input Mode */}
            {activeTab === 'camera' && (
              <div className="flex flex-col gap-4">
                {showCamera ? (
                  <CameraCapture 
                    onCapture={handleImageAnalysis} 
                    onClose={() => setShowCamera(false)} 
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
                      <span className="font-medium text-slate-600">Take Photo</span>
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <span className="font-medium text-slate-600">Upload</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                )}
                <p className="text-center text-xs text-slate-400 mt-2">
                  Take a photo of your meal. AI will identify ingredients and portions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodInput;
