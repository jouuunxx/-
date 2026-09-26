import React from 'react';
import { Sparkles, BookOpen, MessageSquareText, Compass, Flower2, Bookmark, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  activeTab: 'match' | 'stories' | 'masters' | 'zen' | 'saved';
  setActiveTab: (tab: 'match' | 'stories' | 'masters' | 'zen' | 'saved') => void;
  savedCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  soundEnabled,
  setSoundEnabled,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD1] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Seal */}
        <div 
          onClick={() => setActiveTab('match')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#C23E32] to-[#9B2C22] flex items-center justify-center shadow-md shadow-[#C23E32]/20 group-hover:scale-105 transition-transform">
            <span className="font-serif text-white font-bold text-lg tracking-wider" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              泉
            </span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E5A93B] border-2 border-[#FAF7F2] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                心泉居
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-sm bg-[#C23E32]/10 text-[#C23E32] font-medium border border-[#C23E32]/20">
                古贤解忧馆
              </span>
            </div>
            <p className="text-xs text-[#7D766F] hidden sm:block">
              新式国风情绪疗愈 · 遇事不决寻古贤
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'match'
                ? 'bg-[#C23E32] text-white shadow-sm shadow-[#C23E32]/30'
                : 'text-[#615A52] hover:bg-[#EFE9DF] hover:text-[#2C2A29]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">灵犀问诊</span>
            <span className="md:hidden">问诊</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'stories'
                ? 'bg-[#0D828A] text-white shadow-sm shadow-[#0D828A]/30'
                : 'text-[#615A52] hover:bg-[#EFE9DF] hover:text-[#2C2A29]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">哲学小故事</span>
            <span className="md:hidden">故事</span>
            <span className="w-2 h-2 rounded-full bg-[#E5A93B]"></span>
          </button>

          <button
            onClick={() => setActiveTab('masters')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'masters'
                ? 'bg-[#C68A2E] text-white shadow-sm shadow-[#C68A2E]/30'
                : 'text-[#615A52] hover:bg-[#EFE9DF] hover:text-[#2C2A29]'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="hidden md:inline">先贤雅集</span>
            <span className="md:hidden">大师</span>
          </button>

          <button
            onClick={() => setActiveTab('zen')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'zen'
                ? 'bg-[#3E6B48] text-white shadow-sm shadow-[#3E6B48]/30'
                : 'text-[#615A52] hover:bg-[#EFE9DF] hover:text-[#2C2A29]'
            }`}
          >
            <Flower2 className="w-4 h-4" />
            <span className="hidden md:inline">心斋静息</span>
            <span className="md:hidden">静心</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === 'saved'
                ? 'bg-[#244B78] text-white shadow-sm shadow-[#244B78]/30'
                : 'text-[#615A52] hover:bg-[#EFE9DF] hover:text-[#2C2A29]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">解忧集</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C23E32] text-white text-xs flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? '音效开启' : '音效静音'}
            className="p-2 rounded-xl text-[#7D766F] hover:bg-[#EFE9DF] hover:text-[#2C2A29] transition-colors ml-1"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#3E6B48]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#A8A199]" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
