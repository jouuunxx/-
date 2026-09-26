import React, { useState } from 'react';
import { Bookmark, Sparkles, Trash2, BookOpen, Share2, Heart, ArrowRight } from 'lucide-react';
import { MasterId, PhilosophicalStory } from '../types/healing';
import { MASTERS } from '../data/masters';
import { sound } from '../utils/audio';

interface SavedCollectionProps {
  prescriptions: any[];
  wisdomCards: any[];
  savedStories: PhilosophicalStory[];
  onRemovePrescription: (idx: number) => void;
  onRemoveWisdomCard: (idx: number) => void;
  onOpenStory: (story: PhilosophicalStory) => void;
  onStartChat: (masterId: MasterId) => void;
  soundEnabled: boolean;
}

export const SavedCollection: React.FC<SavedCollectionProps> = ({
  prescriptions,
  wisdomCards,
  savedStories,
  onRemovePrescription,
  onRemoveWisdomCard,
  onOpenStory,
  onStartChat,
  soundEnabled,
}) => {
  const [subTab, setSubTab] = useState<'prescriptions' | 'cards' | 'stories'>('prescriptions');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD1]">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            我的解忧锦囊集
          </h2>
          <p className="text-xs text-[#877E75] mt-0.5">
            收录所有古代先贤为你开具的心灵药方、解忧签文与治愈小故事
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-[#E8DFD1]">
          <button
            onClick={() => {
              setSubTab('prescriptions');
              if (soundEnabled) sound.playWoodenFish();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              subTab === 'prescriptions'
                ? 'bg-[#C23E32] text-white shadow-xs'
                : 'text-[#615A52] hover:text-[#2C2A29]'
            }`}
          >
            心灵药方 ({prescriptions.length})
          </button>
          <button
            onClick={() => {
              setSubTab('cards');
              if (soundEnabled) sound.playWoodenFish();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              subTab === 'cards'
                ? 'bg-[#C68A2E] text-white shadow-xs'
                : 'text-[#615A52] hover:text-[#2C2A29]'
            }`}
          >
            解忧签文 ({wisdomCards.length})
          </button>
          <button
            onClick={() => {
              setSubTab('stories');
              if (soundEnabled) sound.playWoodenFish();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              subTab === 'stories'
                ? 'bg-[#0D828A] text-white shadow-xs'
                : 'text-[#615A52] hover:text-[#2C2A29]'
            }`}
          >
            治愈故事 ({savedStories.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Prescriptions */}
      {subTab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFD1] space-y-2">
              <span className="text-3xl block">📜</span>
              <p className="text-sm font-medium text-[#2C2A29]">暂无收录的心灵药方</p>
              <p className="text-xs text-[#877E75]">
                前往“灵犀问诊”，请古代先贤为你出诊开方吧！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((p, idx) => {
                const master = p.masterId ? MASTERS[p.masterId as MasterId] : MASTERS.su_shi;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-white border border-[#E8DFD1] hover:shadow-md transition-shadow space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={master?.avatarUrl}
                          alt={master?.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <span className="font-bold text-sm text-[#2C2A29]">
                          【{p.title}】
                        </span>
                      </div>
                      <button
                        onClick={() => onRemovePrescription(idx)}
                        className="text-[#A8A199] hover:text-red-600 transition-colors p-1"
                        title="删除此方"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-[#615A52] space-y-1">
                      <div>
                        <strong>药材：</strong>{' '}
                        {Array.isArray(p.ingredients)
                          ? p.ingredients.join('、')
                          : p.ingredients}
                      </div>
                      <div>
                        <strong>用法：</strong> {p.instructions}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                      <span className="font-serif italic text-[#C23E32]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                        “{p.philosophicalKey}”
                      </span>
                      <span className="text-[11px] text-[#A8A199]">
                        {master?.name}所开
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wisdom Cards */}
      {subTab === 'cards' && (
        <div className="space-y-4">
          {wisdomCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFD1] space-y-2">
              <span className="text-3xl block">🧧</span>
              <p className="text-sm font-medium text-[#2C2A29]">暂无收录的解忧签文</p>
              <p className="text-xs text-[#877E75]">
                与先贤大师促膝长谈时，大师会适时赠你“逍遥解忧签”！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wisdomCards.map((card, idx) => {
                const master = card.masterId ? MASTERS[card.masterId as MasterId] : MASTERS.su_shi;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-gradient-to-br from-[#FFFBF5] to-white border border-[#F3E3C7] shadow-xs space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={master?.avatarUrl}
                          alt={master?.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <span className="text-xs font-semibold text-[#8C5D17]">
                          {master?.name} 所赠签文
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveWisdomCard(idx)}
                        className="text-[#A8A199] hover:text-red-600 transition-colors p-1"
                        title="删除此签"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-serif font-bold text-base text-[#2C2A29]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      “{card.quote}”
                    </p>

                    <p className="text-xs text-[#7A5B2E] leading-relaxed">
                      {card.takeaway}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[#F5EAD6] text-xs">
                      <button
                        onClick={() => onStartChat(card.masterId || 'su_shi')}
                        className="text-xs text-[#C23E32] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>与{master?.name}再聊聊</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <span className="font-serif text-[#C23E32] font-bold px-2 py-0.5 rounded bg-white border border-[#C23E32]/20">
                        【{card.stampText}】
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Stories */}
      {subTab === 'stories' && (
        <div className="space-y-4">
          {savedStories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFD1] space-y-2">
              <span className="text-3xl block">📖</span>
              <p className="text-sm font-medium text-[#2C2A29]">暂无收藏的故事</p>
              <p className="text-xs text-[#877E75]">
                前往“哲学小故事”模块，点击书签图标即可收藏喜爱的小品！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onOpenStory(story)}
                  className="p-5 rounded-3xl bg-white border border-[#E8DFD1] hover:border-[#0D828A]/50 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[#877E75]">
                    <span>{story.categoryLabel}</span>
                    <span>{story.readTime}</span>
                  </div>

                  <h4 className="font-bold text-base text-[#2C2A29] font-serif hover:text-[#0D828A] transition-colors" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {story.title}
                  </h4>

                  <p className="text-xs text-[#615A52] line-clamp-2 leading-relaxed">
                    {story.hook}
                  </p>

                  <div className="pt-2 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                    <span className="text-[#0D828A] font-semibold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>点击重温</span>
                    </span>
                    <span className="font-serif text-[#C23E32] font-bold">
                      【{story.stampWord}】
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
