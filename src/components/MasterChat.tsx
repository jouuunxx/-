import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Feather, ArrowLeft, RefreshCw, BookmarkPlus, Check, MessageSquareText, Heart } from 'lucide-react';
import { MasterProfile, MasterId, ChatMessage } from '../types/healing';
import { MASTERS } from '../data/masters';
import { sound } from '../utils/audio';

interface MasterChatProps {
  initialMasterId: MasterId;
  initialProblem?: string;
  onBack: () => void;
  onSaveWisdomCard: (card: any) => void;
  soundEnabled: boolean;
}

export const MasterChat: React.FC<MasterChatProps> = ({
  initialMasterId,
  initialProblem,
  onBack,
  onSaveWisdomCard,
  soundEnabled,
}) => {
  const [currentMasterId, setCurrentMasterId] = useState<MasterId>(initialMasterId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const master: MasterProfile = MASTERS[currentMasterId] || MASTERS.su_shi;

  // Initialize conversation with Master's greeting
  useEffect(() => {
    const greetingMsg: ChatMessage = {
      id: `init_${Date.now()}`,
      role: 'assistant',
      content: master.greeting,
      timestamp: Date.now(),
      masterId: master.id,
      wisdomCard: {
        quote: master.signatureQuotes[0]?.quote || '人间有味是清欢',
        takeaway: master.signatureQuotes[0]?.modernMeaning || '心境放宽，生活自见澄澈',
        stampText: '万般从容',
      },
    };

    if (initialProblem) {
      const userInitialMsg: ChatMessage = {
        id: `user_init_${Date.now()}`,
        role: 'user',
        content: initialProblem,
        timestamp: Date.now() + 1,
      };
      setMessages([greetingMsg, userInitialMsg]);
      // Trigger reply to initial problem
      fetchMasterReply([greetingMsg, userInitialMsg], master.id, initialProblem);
    } else {
      setMessages([greetingMsg]);
    }
  }, [currentMasterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchMasterReply = async (
    history: ChatMessage[],
    masterId: MasterId,
    userProb?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          userProblem: userProb,
        }),
      });

      if (!response.ok) throw new Error('Chat failed');
      const data = await response.json();

      const newMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
        masterId,
        wisdomCard: data.wisdomCard,
      };

      setMessages((prev) => [...prev, newMsg]);
      if (soundEnabled) sound.playChime(528);
    } catch (err) {
      console.error(err);
      // Graceful fallback response
      const fallbackMsg: ChatMessage = {
        id: `fallback_${Date.now()}`,
        role: 'assistant',
        content:
          '小友莫急，山间云雾偶有遮蔽。老夫想对你说：人生起伏皆有定律，暂且深吸一口气，把肩上的沉重担子歇一歇，无论遇到什么难关，老夫都在此相陪。',
        timestamp: Date.now(),
        masterId,
        wisdomCard: {
          quote: '莫听穿林打叶声，何妨吟啸且徐行。',
          takeaway: '外界风雨任它狂，心中的节奏自己掌舵。',
          stampText: '悠然自得',
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (soundEnabled) sound.playPaperFlip();

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');

    await fetchMasterReply(newHistory, currentMasterId, text);
  };

  const handleSaveCard = (card: any, msgId: string) => {
    if (soundEnabled) sound.playWoodenFish();
    setSavedCards((prev) => ({ ...prev, [msgId]: true }));
    onSaveWisdomCard({
      ...card,
      masterName: master.name,
      masterId: master.id,
      savedAt: Date.now(),
    });
  };

  const promptChips = [
    '大师，我最近总陷入内耗自责，怎么办？',
    '遇到职场逆境，怎么才能像您一样看开？',
    '如何放下他人的眼光与评价？',
    '请赐我一句今日破局定心金句！',
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-sm overflow-hidden flex flex-col h-[780px] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div 
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: master.themeColor.border, backgroundColor: master.themeColor.bgLight }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-black/5 text-[#615A52] transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div 
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 shadow-xs"
              style={{ borderColor: master.themeColor.primary }}
            >
              <img
                src={master.avatarUrl}
                alt={master.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {master.name}
              </h3>
              <span 
                className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  backgroundColor: master.themeColor.badgeBg,
                  color: master.themeColor.badgeText,
                }}
              >
                {master.dynasty} · {master.title}
              </span>
            </div>
            <p className="text-xs text-[#877E75]">
              {isLoading ? '先贤正在为您研墨思索...' : '心神相通，促膝清谈中'}
            </p>
          </div>
        </div>

        {/* Master Selector Quick Switch */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#877E75] hidden sm:inline mr-1">转介先贤：</span>
          {Object.values(MASTERS).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (m.id !== currentMasterId) {
                  setCurrentMasterId(m.id);
                  if (soundEnabled) sound.playWoodenFish();
                }
              }}
              title={`邀请【${m.name}】开解`}
              className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                currentMasterId === m.id
                  ? 'scale-110 shadow-xs border-[#C23E32]'
                  : 'opacity-60 hover:opacity-100 border-transparent'
              }`}
            >
              <img
                src={m.avatarUrl}
                alt={m.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const msgMaster = msg.masterId ? MASTERS[msg.masterId] : master;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              } animate-in fade-in duration-200`}
            >
              {/* Avatar */}
              {!isUser ? (
                <div 
                  className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border shadow-xs"
                  style={{ borderColor: msgMaster.themeColor.primary }}
                >
                  <img
                    src={msgMaster.avatarUrl}
                    alt={msgMaster.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#2C2A29] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  我
                </div>
              )}

              {/* Message Bubble & Cards */}
              <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                <div
                  className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                    isUser
                      ? 'bg-[#C23E32] text-white rounded-tr-none shadow-xs font-sans'
                      : 'bg-white border border-[#E8DFD1] text-[#2C2A29] rounded-tl-none shadow-xs font-serif'
                  }`}
                  style={{
                    fontFamily: isUser ? undefined : "'Noto Serif SC', serif",
                  }}
                >
                  {msg.content}
                </div>

                {/* Embedded Wisdom Card from Master */}
                {msg.wisdomCard && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-[#FAF3EB] border border-[#F5E2C4] shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C68A2E]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>先贤所赠 · 逍遥解忧签</span>
                      </div>
                      <button
                        onClick={() => handleSaveCard(msg.wisdomCard, msg.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                          savedCards[msg.id]
                            ? 'bg-[#3E6B48] text-white font-medium'
                            : 'bg-white/80 border border-[#E8DFD1] text-[#615A52] hover:bg-white'
                        }`}
                      >
                        {savedCards[msg.id] ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>已收录</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3 h-3" />
                            <span>收录此签</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="font-serif italic font-bold text-sm sm:text-base text-[#2C2A29]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      “{msg.wisdomCard.quote}”
                    </p>

                    <p className="text-xs text-[#7A5B2E] leading-relaxed">
                      {msg.wisdomCard.takeaway}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <span className="font-serif text-[#C23E32] text-xs font-bold px-2 py-0.5 border border-[#C23E32]/30 rounded bg-white/60">
                        【{msg.wisdomCard.stampText}】
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border shadow-xs"
              style={{ borderColor: master.themeColor.primary }}
            >
              <img
                src={master.avatarUrl}
                alt={master.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs text-[#877E75] flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C23E32]" />
              <span>先贤【{master.name}】正在推演心法、蘸墨提笔...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-white border-t border-[#F2ECE2] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-[#877E75] shrink-0 flex items-center gap-1">
          <Feather className="w-3 h-3 text-[#C23E32]" />
          快速请教：
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#615A52] text-xs whitespace-nowrap border border-[#E8DFD1] transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="p-4 bg-white border-t border-[#E8DFD1]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`向【${master.name}】倾诉你此刻的困惑...`}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-sm text-[#2C2A29] placeholder-[#9E968D] focus:outline-none focus:ring-2 focus:ring-[#C23E32]/20 focus:border-[#C23E32] transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-5 py-3 rounded-2xl bg-[#C23E32] hover:bg-[#A32E23] text-white text-sm font-semibold shadow-md shadow-[#C23E32]/20 hover:shadow-lg disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">寄语先贤</span>
          </button>
        </form>
      </div>
    </div>
  );
};
