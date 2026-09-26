import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, Bookmark, Share2, Volume2, VolumeX, ArrowLeft, RefreshCw, Feather, Check, Plus, MessageCircle } from 'lucide-react';
import { PhilosophicalStory, MasterId } from '../types/healing';
import { PHILOSOPHICAL_STORIES } from '../data/stories';
import { MASTERS } from '../data/masters';
import { sound } from '../utils/audio';

interface StoryModuleProps {
  initialMasterFilter?: MasterId;
  onStartChatWithMaster: (masterId: MasterId) => void;
  onSaveStory: (story: PhilosophicalStory) => void;
  soundEnabled: boolean;
}

export const StoryModule: React.FC<StoryModuleProps> = ({
  initialMasterFilter,
  onStartChatWithMaster,
  onSaveStory,
  soundEnabled,
}) => {
  const [selectedMaster, setSelectedMaster] = useState<MasterId | 'all'>(
    initialMasterFilter || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStory, setActiveStory] = useState<PhilosophicalStory | null>(null);
  const [allStories, setAllStories] = useState<PhilosophicalStory[]>(PHILOSOPHICAL_STORIES);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [savedStories, setSavedStories] = useState<Record<string, boolean>>({});

  // AI Story Generator State
  const [showGenModal, setShowGenModal] = useState(false);
  const [genMood, setGenMood] = useState('');
  const [genMasterId, setGenMasterId] = useState<MasterId>('su_shi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // TTS audio playback
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = [
    { key: 'all', label: '全部小故事' },
    { key: 'career', label: '职场与逆境' },
    { key: 'anxiety', label: '内耗与焦虑' },
    { key: 'confidence', label: '自卑与自信' },
    { key: 'action', label: '拖延与行动' },
    { key: 'relationship', label: '人际与独处' },
  ];

  const filteredStories = allStories.filter((story) => {
    const matchMaster = selectedMaster === 'all' || story.masterId === selectedMaster;
    const matchCat = selectedCategory === 'all' || story.category === selectedCategory;
    return matchMaster && matchCat;
  });

  const handleOpenStory = (story: PhilosophicalStory) => {
    if (soundEnabled) sound.playPaperFlip();
    setActiveStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStory = () => {
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setActiveStory(null);
  };

  const handleToggleLike = (storyId: string) => {
    if (soundEnabled) sound.playWoodenFish();
    setLikedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  const handleToggleSave = (story: PhilosophicalStory) => {
    if (soundEnabled) sound.playWoodenFish();
    const willSave = !savedStories[story.id];
    setSavedStories((prev) => ({
      ...prev,
      [story.id]: willSave,
    }));
    if (willSave) {
      onSaveStory(story);
    }
  };

  // Text to speech (TTS) using Web Speech API
  const handleToggleTTS = (story: PhilosophicalStory) => {
    if (!('speechSynthesis' in window)) {
      alert('您的浏览器暂不支持语音朗读功能');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrativeText = `${story.title}。${story.subTitle}。${story.scenes
      .map((s) => `${s.title}。${s.narrative}`)
      .join('。')}。现代治愈启示：${story.modernInsight}。大师评点：${story.masterComment}`;

    const utterance = new SpeechSynthesisUtterance(narrativeText);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Generate Custom AI Story
  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genMood.trim()) return;

    setIsGenerating(true);
    setGenError('');
    if (soundEnabled) sound.playChime(432);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId: genMasterId,
          userMood: genMood.trim(),
        }),
      });

      if (!response.ok) throw new Error('生成失败');
      const data = await response.json();

      const newStory: PhilosophicalStory = {
        id: `ai_${Date.now()}`,
        masterId: genMasterId,
        title: data.title || '大师定制故事',
        subTitle: data.subTitle || '针对您此刻心境的专属开解',
        category: 'anxiety',
        categoryLabel: 'AI 定制专属解忧',
        readTime: data.readTime || '2 分钟',
        hook: data.hook || '当你陷入疲惫时，看看古代先贤如何妙手化解。',
        scenes: data.scenes || [
          {
            sceneNumber: 1,
            title: '起因',
            narrative: data.narrative || '先贤微笑看着你，讲起了一桩往事...',
          },
        ],
        modernInsight: data.modernInsight || '放下负担，活在当下。',
        masterComment: data.masterComment || '小友，且放宽心，天塌不下来！',
        mindfulnessPrompt: data.mindfulnessPrompt || '深呼吸三次，放下紧绷。',
        likes: 1,
        stampWord: data.stampWord || '万般自在',
      };

      setAllStories([newStory, ...allStories]);
      setShowGenModal(false);
      setGenMood('');
      setActiveStory(newStory);
      if (soundEnabled) sound.playChime(528);
    } catch (err: any) {
      console.error(err);
      setGenError('生成故事暂时遇到波动，请重试或直接阅读既有精选故事。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* If a story is open, show the Full Story Reader View */}
      {activeStory ? (
        <article className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Reader Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE2]">
            <button
              onClick={handleCloseStory}
              className="flex items-center gap-1.5 text-sm font-medium text-[#615A52] hover:text-[#C23E32] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回故事集</span>
            </button>

            <div className="flex items-center gap-2">
              {/* TTS Listen Button */}
              <button
                onClick={() => handleToggleTTS(activeStory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSpeaking
                    ? 'bg-[#C23E32] text-white animate-pulse'
                    : 'bg-[#FAF7F2] text-[#615A52] hover:bg-[#F2ECE2]'
                }`}
                title="朗读小故事"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>停止朗读</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#0D828A]" />
                    <span>听大师讲</span>
                  </>
                )}
              </button>

              {/* Bookmark Save */}
              <button
                onClick={() => handleToggleSave(activeStory)}
                className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                  savedStories[activeStory.id]
                    ? 'bg-[#3E6B48] text-white'
                    : 'bg-[#FAF7F2] text-[#615A52] hover:bg-[#F2ECE2]'
                }`}
                title="收藏此故事"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Like Button */}
              <button
                onClick={() => handleToggleLike(activeStory.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  likedStories[activeStory.id]
                    ? 'bg-[#FEECEB] text-[#C23E32]'
                    : 'bg-[#FAF7F2] text-[#615A52] hover:bg-[#F2ECE2]'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    likedStories[activeStory.id] ? 'fill-[#C23E32]' : ''
                  }`}
                />
                <span>
                  {activeStory.likes + (likedStories[activeStory.id] ? 1 : 0)}
                </span>
              </button>
            </div>
          </div>

          {/* Story Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#615A52] border border-[#E8DFD1]">
                {activeStory.categoryLabel}
              </span>
              <span className="text-[#877E75]">· 预计阅读 {activeStory.readTime}</span>
              <span className="text-[#877E75]">· 主讲古贤：{MASTERS[activeStory.masterId]?.name}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C2A29] font-serif leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {activeStory.title}
            </h2>

            <p className="text-base sm:text-lg text-[#615A52] font-serif italic" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {activeStory.subTitle}
            </p>

            {/* Hook Quote Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#C23E32] text-sm text-[#554E46] leading-relaxed">
              <strong>【开篇心语】：</strong> {activeStory.hook}
            </div>
          </div>

          {/* Master Presence Banner */}
          {MASTERS[activeStory.masterId] && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-white border border-[#E8DFD1]">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-[#E8DFD1]">
                <img
                  src={MASTERS[activeStory.masterId].avatarUrl}
                  alt={MASTERS[activeStory.masterId].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#2C2A29]">
                    {MASTERS[activeStory.masterId].name}
                  </h4>
                  <span className="text-xs text-[#877E75]">
                    {MASTERS[activeStory.masterId].dynasty} · {MASTERS[activeStory.masterId].title}
                  </span>
                </div>
                <p className="text-xs text-[#615A52] mt-0.5 line-clamp-1">
                  {MASTERS[activeStory.masterId].personality}
                </p>
              </div>
              <button
                onClick={() => onStartChatWithMaster(activeStory.masterId)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DFD1] hover:border-[#C23E32] text-xs font-semibold text-[#C23E32] transition-colors shrink-0 flex items-center gap-1 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>与他聊聊</span>
              </button>
            </div>
          )}

          {/* Story Narrative Scenes */}
          <div className="space-y-6 pt-2">
            {activeStory.scenes.map((scene) => (
              <section
                key={scene.sceneNumber}
                className="space-y-2 p-5 rounded-2xl bg-[#FAF9F5]/70 border border-[#F0EBE1]"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#C23E32]">
                  <span className="w-5 h-5 rounded-full bg-[#C23E32]/10 flex items-center justify-center text-[10px]">
                    0{scene.sceneNumber}
                  </span>
                  <span>{scene.title}</span>
                </div>
                <p className="text-sm sm:text-base text-[#2C2A29] leading-relaxed font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {scene.narrative}
                </p>
              </section>
            ))}
          </div>

          {/* Master's Commentary & Modern Insight */}
          <div className="space-y-4 pt-4 border-t border-[#F2ECE2]">
            {/* Modern Insight */}
            <div className="p-5 rounded-2xl bg-[#EFF8F8] border border-[#CDEAEB] text-sm text-[#0D6268] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0D828A]">
                <Sparkles className="w-4 h-4" />
                <span>现代打工人疗愈启示</span>
              </div>
              <p className="leading-relaxed">
                {activeStory.modernInsight}
              </p>
            </div>

            {/* Master's Warm Comment */}
            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#FBE3B5] text-sm text-[#8C5D17] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#C68A2E]">
                <Feather className="w-4 h-4" />
                <span>先贤第一人称私房话</span>
              </div>
              <p className="italic font-serif leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {activeStory.masterComment}
              </p>
            </div>

            {/* Mindfulness Prompt */}
            <div className="p-5 rounded-2xl bg-[#F3F8F4] border border-[#CFE6D4] text-sm text-[#276738] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#3E6B48]">
                <span>🍃 读完故事后的 1 分钟心灵微舒缓</span>
              </div>
              <p className="leading-relaxed">
                {activeStory.mindfulnessPrompt}
              </p>
            </div>
          </div>

          {/* Stamp Badge & Footer Actions */}
          <div className="pt-6 border-t border-[#F2ECE2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Traditional Red Seal */}
              <div className="w-16 h-16 rounded-xl border-2 border-[#C23E32] p-1 flex items-center justify-center text-center transform -rotate-3 shadow-xs">
                <span className="font-serif text-[#C23E32] font-extrabold text-xs leading-tight tracking-wider" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                  {activeStory.stampWord}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2C2A29]">
                  赠你解忧印章：【{activeStory.stampWord}】
                </p>
                <p className="text-xs text-[#877E75]">
                  把这份松弛感带入今天的生活吧
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onStartChatWithMaster(activeStory.masterId)}
                className="px-5 py-2.5 rounded-xl bg-[#C23E32] hover:bg-[#A32E23] text-white text-xs font-bold transition-all shadow-md shadow-[#C23E32]/20 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>与大师继续探讨此道</span>
              </button>
              <button
                onClick={handleCloseStory}
                className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#615A52] text-xs font-medium transition-colors"
              >
                看下一篇故事
              </button>
            </div>
          </div>
        </article>
      ) : (
        /* Stories Gallery & Catalog View */
        <div className="space-y-8">
          {/* Header Banner for Story Module */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0D828A]/10 via-[#FAF7F2] to-[#E5A93B]/10 p-6 sm:p-8 rounded-3xl border border-[#D5EAEB]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0D828A] text-xs font-bold mb-2 shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>通俗活泼 · 积极向上 · 轻松解压</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                古贤解忧故事馆
              </h2>
              <p className="text-xs sm:text-sm text-[#615A52] mt-1 max-w-xl">
                不必苦读艰深古籍，先贤们用幽默豁达的人生真事与俏皮寓言，带你换个视角看世界，抚平每一个疲惫紧绷的日常。
              </p>
            </div>

            <button
              onClick={() => setShowGenModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0D828A] to-[#0A6B71] hover:shadow-lg text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#0D828A]/25 transition-all flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>让大师为我定制新故事</span>
            </button>
          </div>

          {/* Master Filters (Tabs) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#877E75]">按先贤主讲人筛选：</span>
              <span className="text-xs text-[#877E75]">共 {filteredStories.length} 篇故事</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedMaster('all');
                  if (soundEnabled) sound.playWoodenFish();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedMaster === 'all'
                    ? 'bg-[#2C2A29] text-white shadow-xs'
                    : 'bg-white text-[#615A52] border border-[#E8DFD1] hover:bg-[#FAF7F2]'
                }`}
              >
                全部先贤
              </button>

              {Object.values(MASTERS).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMaster(m.id);
                    if (soundEnabled) sound.playWoodenFish();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                    selectedMaster === m.id
                      ? 'text-white shadow-xs'
                      : 'bg-white text-[#615A52] border-[#E8DFD1] hover:bg-[#FAF7F2]'
                  }`}
                  style={{
                    backgroundColor: selectedMaster === m.id ? m.themeColor.primary : undefined,
                    borderColor: selectedMaster === m.id ? m.themeColor.primary : undefined,
                  }}
                >
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-[#F2ECE2]">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setSelectedCategory(c.key);
                  if (soundEnabled) sound.playWoodenFish();
                }}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  selectedCategory === c.key
                    ? 'bg-[#C23E32]/10 text-[#C23E32] font-bold border border-[#C23E32]/30'
                    : 'text-[#7D766F] hover:text-[#2C2A29] hover:bg-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => {
              const master = MASTERS[story.masterId] || MASTERS.su_shi;
              const isLiked = likedStories[story.id];
              const isSaved = savedStories[story.id];

              return (
                <div
                  key={story.id}
                  onClick={() => handleOpenStory(story)}
                  className="group bg-white rounded-3xl border border-[#E8DFD1] hover:border-[#C23E32]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer p-6"
                >
                  <div className="space-y-4">
                    {/* Header: Master Tag & Read Time */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={master.avatarUrl}
                          alt={master.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-[#E8DFD1]"
                        />
                        <span className="font-semibold text-[#2C2A29]">
                          {master.name}
                        </span>
                        <span className="text-[#877E75]">· {story.categoryLabel}</span>
                      </div>
                      <span className="text-[#A39A8F]">{story.readTime}</span>
                    </div>

                    {/* Story Title & Subtitle */}
                    <div>
                      <h3 className="text-lg font-bold text-[#2C2A29] font-serif group-hover:text-[#C23E32] transition-colors leading-snug" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                        {story.title}
                      </h3>
                      <p className="text-xs text-[#877E75] mt-1.5 line-clamp-1">
                        {story.subTitle}
                      </p>
                    </div>

                    {/* Hook preview */}
                    <p className="text-xs sm:text-sm text-[#554E46] line-clamp-3 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#F2ECE2]">
                      {story.hook}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-4 mt-4 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                    <span 
                      className="px-2.5 py-0.5 rounded-md font-serif font-bold text-[11px]"
                      style={{
                        backgroundColor: master.themeColor.tagBg,
                        color: master.themeColor.badgeText,
                      }}
                    >
                      【{story.stampWord}】
                    </span>

                    <div className="flex items-center gap-3 text-[#877E75]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(story.id);
                        }}
                        className="flex items-center gap-1 hover:text-[#C23E32] transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-[#C23E32] text-[#C23E32]' : ''
                          }`}
                        />
                        <span>{story.likes + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(story);
                        }}
                        className={`hover:text-[#3E6B48] transition-colors ${
                          isSaved ? 'text-[#3E6B48]' : ''
                        }`}
                        title="收藏小故事"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Story Generator Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0D828A]/10 text-[#0D828A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  让古代先贤为你定制哲学小故事
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-[#877E75] hover:text-[#2C2A29] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateStory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1.5">
                  1. 选择主讲先贤
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.values(MASTERS).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGenMasterId(m.id)}
                      className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center gap-1 ${
                        genMasterId === m.id
                          ? 'border-[#0D828A] bg-[#0D828A]/5 shadow-xs'
                          : 'border-[#E8DFD1] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-medium text-[#2C2A29]">
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1.5">
                  2. 描述你此刻最想解开的心情或场景
                </label>
                <textarea
                  value={genMood}
                  onChange={(e) => setGenMood(e.target.value)}
                  placeholder="例如：周日晚上想到明天上班开会就浑身抗拒发抖；或者：今天和父母吵架了觉得不被理解很委屈..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D828A]/20 focus:border-[#0D828A]"
                />
              </div>

              {genError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
                  {genError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#615A52] hover:bg-[#FAF7F2] rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !genMood.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0D828A] hover:bg-[#0A6B71] text-white text-xs font-bold shadow-md shadow-[#0D828A]/25 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>先贤正在研磨撰写...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>即刻创作小故事</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
