import React, { useState } from 'react';
import { MessageSquareText, BookOpen, Quote, Sparkles, Feather } from 'lucide-react';
import { MasterProfile, MasterId } from '../types/healing';
import { MASTERS } from '../data/masters';
import { sound } from '../utils/audio';

interface MasterHallProps {
  onStartChat: (masterId: MasterId) => void;
  onReadStory: (masterId: MasterId) => void;
  soundEnabled: boolean;
}

export const MasterHall: React.FC<MasterHallProps> = ({
  onStartChat,
  onReadStory,
  soundEnabled,
}) => {
  const [activeMasterId, setActiveMasterId] = useState<MasterId>('su_shi');
  const masters = Object.values(MASTERS);
  const activeMaster = MASTERS[activeMasterId];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] text-[#C23E32] text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>五贤坐堂 · 专属心药</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          先贤雅集堂
        </h2>
        <p className="text-xs sm:text-sm text-[#615A52]">
          每一位先贤，都在各自的时代穿透了最深沉的困厄与风雨。择一高贤，促膝论道，解开尘封心结。
        </p>
      </div>

      {/* Masters Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {masters.map((m) => {
          const isActive = m.id === activeMasterId;
          return (
            <button
              key={m.id}
              onClick={() => {
                setActiveMasterId(m.id);
                if (soundEnabled) sound.playWoodenFish();
              }}
              className={`p-3 sm:p-4 rounded-3xl border text-center transition-all flex flex-col items-center gap-2 group ${
                isActive
                  ? 'bg-white shadow-md scale-102'
                  : 'bg-[#FAF7F2]/60 hover:bg-white border-[#E8DFD1]'
              }`}
              style={{
                borderColor: isActive ? m.themeColor.primary : undefined,
              }}
            >
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shadow-xs group-hover:scale-105 transition-transform"
                style={{ borderColor: m.themeColor.primary }}
              >
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {m.name}
                </h4>
                <p className="text-[11px] text-[#877E75] truncate max-w-[100px]">
                  {m.dynasty} · {m.courtesyName}
                </p>
              </div>

              <span 
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: m.themeColor.tagBg,
                  color: m.themeColor.badgeText,
                }}
              >
                {m.title.split('·')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Master Full Showcase Detail Card */}
      {activeMaster && (
        <div 
          className="rounded-3xl border bg-white p-6 sm:p-10 shadow-sm animate-in fade-in duration-300 relative overflow-hidden"
          style={{ borderColor: activeMaster.themeColor.border }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Portrait & Title */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div 
                className="w-52 h-52 rounded-3xl overflow-hidden border-4 shadow-xl"
                style={{ borderColor: activeMaster.themeColor.primary }}
              >
                <img
                  src={activeMaster.avatarUrl}
                  alt={activeMaster.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {activeMaster.name}
                </h3>
                <p className="text-xs text-[#877E75] mt-1">
                  {activeMaster.dynasty} · {activeMaster.courtesyName}
                </p>
                <p 
                  className="text-xs font-semibold mt-2 px-3 py-1 rounded-full inline-block"
                  style={{
                    backgroundColor: activeMaster.themeColor.badgeBg,
                    color: activeMaster.themeColor.badgeText,
                  }}
                >
                  {activeMaster.title}
                </p>
              </div>

              {/* Specialties */}
              <div className="w-full text-left bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD1] space-y-2">
                <span className="text-xs font-bold text-[#877E75] block">
                  专治心境病症：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMaster.specialty.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-white border border-[#E8DFD1] text-[#554E46]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-2 pt-2">
                <button
                  onClick={() => onStartChat(activeMaster.id)}
                  className="w-full py-3 rounded-2xl text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: activeMaster.themeColor.primary }}
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>与【{activeMaster.name}】促膝清谈</span>
                </button>

                <button
                  onClick={() => onReadStory(activeMaster.id)}
                  className="w-full py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#2C2A29] border border-[#E8DFD1] font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#0D828A]" />
                  <span>阅读【{activeMaster.name}】治愈故事</span>
                </button>
              </div>
            </div>

            {/* Right Column: Bio & Core Philosophies */}
            <div className="lg:col-span-8 space-y-6">
              {/* Bio & Personality */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeMaster.themeColor.primary }}></span>
                  先贤平生与心性
                </h4>
                <p className="text-xs sm:text-sm text-[#554E46] leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD1]">
                  {activeMaster.bio}
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] text-xs text-[#7A6E63]">
                  <strong>疗愈风格：</strong> {activeMaster.personality}
                </div>
              </div>

              {/* Signature Quotes with Modern Meaning */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
                  <Quote className="w-4 h-4 text-[#C23E32]" />
                  千古定心金句与现代启示
                </h4>
                <div className="space-y-3">
                  {activeMaster.signatureQuotes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#C23E32]/30 transition-colors space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm sm:text-base text-[#2C2A29]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                          “{item.quote}”
                        </span>
                        <span className="text-[11px] text-[#877E75]">
                          {item.source}
                        </span>
                      </div>
                      <p className="text-xs text-[#615A52] leading-relaxed">
                        <strong>现代心理解析：</strong> {item.modernMeaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Preview */}
              <div 
                className="p-4 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: activeMaster.themeColor.bgLight,
                  borderColor: activeMaster.themeColor.border,
                }}
              >
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#2C2A29]">
                    坐堂专属心药 · 【{activeMaster.prescriptionTitle}】
                  </h5>
                  <p className="text-xs text-[#615A52] mt-0.5">
                    {activeMaster.prescriptionEffect}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
