import React, { useState, useEffect, useRef } from 'react';
import { Flower2, Play, Pause, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface ZenSpaceProps {
  soundEnabled: boolean;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

const BLESSINGS = [
  '功德 +1',
  '烦恼 -1',
  '内耗 -1',
  '自在 +1',
  '从容 +1',
  '清欢 +1',
  '放下 +1',
  '心定 +1',
];

export const ZenSpace: React.FC<ZenSpaceProps> = ({ soundEnabled }) => {
  const [tapCount, setTapCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('zen_taps') || '0', 10);
  });
  const [isAutoTapping, setIsAutoTapping] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const autoIntervalRef = useRef<any>(null);

  // Breathing Guide State
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Wooden fish tap
  const handleTapWoodenFish = (e?: React.MouseEvent) => {
    if (soundEnabled) sound.playWoodenFish();

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    localStorage.setItem('zen_taps', nextCount.toString());

    // Random blessing text
    const text = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];
    const id = Date.now() + Math.random();

    // Position near center
    const x = (Math.random() - 0.5) * 80;
    const y = -40 - Math.random() * 30;

    setFloatingTexts((prev) => [...prev.slice(-6), { id, text, x, y }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  // Auto tapping
  useEffect(() => {
    if (isAutoTapping) {
      autoIntervalRef.current = setInterval(() => {
        handleTapWoodenFish();
      }, 1000);
    } else {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    }
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [isAutoTapping, tapCount, soundEnabled]);

  // Breathing exercise loop
  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              if (soundEnabled) sound.playChime(600);
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              if (soundEnabled) sound.playChime(432);
              return 8;
            } else {
              setBreathingPhase('inhale');
              if (soundEnabled) sound.playChime(528);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase, soundEnabled]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] text-[#3E6B48] text-xs font-semibold">
          <Flower2 className="w-3.5 h-3.5" />
          <span>心斋坐忘 · 止水澄明</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          心斋静息放空亭
        </h2>
        <p className="text-xs sm:text-sm text-[#615A52]">
          庄子云：“虚室生白，吉祥止止。” 暂别浮躁思绪，敲敲木鱼，匀称呼吸，将心灵归零。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Module 1: Electronic Wooden Fish */}
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-[#877E75]">
            <span className="font-semibold text-[#2C2A29]">电子木鱼 · 涤心解乏</span>
            <span>已积福慧：{tapCount} 次</span>
          </div>

          {/* Wooden Fish Visual Interactive Area */}
          <div className="relative my-8 select-none flex flex-col items-center">
            {/* Floating text elements */}
            {floatingTexts.map((f) => (
              <span
                key={f.id}
                className="absolute font-serif font-bold text-sm text-[#C23E32] pointer-events-none animate-bounce"
                style={{
                  transform: `translate(${f.x}px, ${f.y}px)`,
                  transition: 'all 0.8s ease-out',
                }}
              >
                {f.text}
              </span>
            ))}

            {/* Tap Button (Stylized Neo-Chinese Wooden Fish) */}
            <button
              onClick={handleTapWoodenFish}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#8B5A2B] via-[#704214] to-[#4A2C0D] border-4 border-[#C89D65] shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center text-white relative group cursor-pointer"
            >
              <div className="w-32 h-16 rounded-full border-t-2 border-white/20 mb-1 opacity-60"></div>
              <span className="font-serif font-bold text-2xl tracking-widest text-[#F5DEB3]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                静心
              </span>
              <span className="text-[11px] text-[#EEDC82] mt-1 opacity-80">
                轻触敲击
              </span>
            </button>
          </div>

          {/* Auto Tap Toggle & Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoTapping(!isAutoTapping)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAutoTapping
                  ? 'bg-[#C23E32] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#615A52] border border-[#E8DFD1] hover:bg-[#F2ECE2]'
              }`}
            >
              {isAutoTapping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoTapping ? '暂停自动敲' : '开启自动敲'}</span>
            </button>

            <button
              onClick={() => {
                setTapCount(0);
                localStorage.setItem('zen_taps', '0');
              }}
              className="px-3 py-2 rounded-xl text-xs text-[#877E75] hover:bg-[#FAF7F2] border border-[#E8DFD1]"
              title="清空计数"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Module 2: 4-7-8 Breathing Guide */}
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-[#877E75]">
            <span className="font-semibold text-[#2C2A29]">道家吐纳 · 4-7-8 放空法</span>
            <span className="text-[#3E6B48]">
              {breathingPhase === 'inhale' ? '深吸气 4秒' : breathingPhase === 'hold' ? '屏气凝神 7秒' : '缓慢吐尽 8秒'}
            </span>
          </div>

          {/* Breathing Visual Lotus Bubble */}
          <div className="relative my-8 flex items-center justify-center">
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                !isBreathingActive
                  ? 'bg-[#F3F8F4] border-2 border-[#CFE6D4] text-[#3E6B48]'
                  : breathingPhase === 'inhale'
                  ? 'bg-[#E5F3E8] border-4 border-[#3E6B48] scale-115 text-[#22543D]'
                  : breathingPhase === 'hold'
                  ? 'bg-[#FEF9EF] border-4 border-[#E5A93B] scale-110 text-[#854D0E]'
                  : 'bg-[#F0FAFA] border-4 border-[#0D828A] scale-90 text-[#066167]'
              }`}
            >
              <span className="font-serif text-3xl font-bold">
                {isBreathingActive ? breathingTimer : '🌿'}
              </span>
              <span className="text-xs font-semibold mt-1">
                {!isBreathingActive
                  ? '准备吐纳'
                  : breathingPhase === 'inhale'
                  ? '徐徐吸气'
                  : breathingPhase === 'hold'
                  ? '屏息守中'
                  : '缓缓吐气'}
              </span>
            </div>
          </div>

          {/* Breathing Control Button */}
          <button
            onClick={() => {
              if (!isBreathingActive && soundEnabled) sound.playChime(528);
              setIsBreathingActive(!isBreathingActive);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              isBreathingActive
                ? 'bg-[#3E6B48] text-white shadow-md'
                : 'bg-[#FAF7F2] text-[#2C2A29] border border-[#E8DFD1] hover:bg-[#F2ECE2]'
            }`}
          >
            {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isBreathingActive ? '暂停吐纳' : '开始静息吐纳'}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
