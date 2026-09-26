import React, { useState } from 'react';
import { Compass, Sparkles, Feather, Send, ArrowRight, BookOpen, MessageSquareText, RefreshCw, Heart, Check, BookmarkPlus } from 'lucide-react';
import { MasterProfile, EmotionalDiagnosis, MasterId } from '../types/healing';
import { MASTERS, HERO_BANNER_URL } from '../data/masters';
import { sound } from '../utils/audio';

interface SmartMatchingProps {
  onStartChat: (masterId: MasterId, initialProblem?: string) => void;
  onReadStory: (masterId: MasterId) => void;
  onSavePrescription: (prescription: any) => void;
  soundEnabled: boolean;
}

const QUICK_MOOD_TAGS = [
  '职场受挫 · 怀才不遇',
  '精神内耗 · 疯狂想太多',
  '他人评价 · 讨好型委屈',
  '严重拖延 · 想做却动不了',
  '压力爆表 · 紧绷到失眠',
  '生活无趣 · 找不到热情',
  '被迫内卷 · 身体被掏空',
  '迷茫焦虑 · 担心不可知的未来'
];

const PRESET_WORRIES = [
  '最近工作遇到了瓶颈，明明很努力却被领导当众批评，感觉自己一无是处，好几天睡不好觉，心里特别难受。',
  '我总是在意外界对我的评价，每天都在反思自己是不是哪句话说错了，活得特别小心翼翼，快要喘不过气了。',
  '有一件重要的事情拖延了两个星期，明明知道该去动手，但只要一想到可能做不好就心里发慌，只能刷手机逃避。',
  '身边所有人都在拼命内卷考证升职，我每天加完班回到出租屋累得只想躺着，既怕自己被时代淘汰，又真的撑不下去了。'
];

export const SmartMatching: React.FC<SmartMatchingProps> = ({
  onStartChat,
  onReadStory,
  onSavePrescription,
  soundEnabled,
}) => {
  const [userProblem, setUserProblem] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<EmotionalDiagnosis | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const toggleTag = (tag: string) => {
    if (soundEnabled) sound.playWoodenFish();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePickPreset = (preset: string) => {
    if (soundEnabled) sound.playPaperFlip();
    setUserProblem(preset);
  };

  const handleMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userProblem.trim() && selectedTags.length === 0) return;

    setIsLoading(true);
    setDiagnosis(null);
    setIsSaved(false);
    if (soundEnabled) sound.playChime(432);

    try {
      const response = await fetch('/api/match-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProblem: userProblem.trim(),
          selectedTags,
        }),
      });

      if (!response.ok) throw new Error('Matching failed');
      const data = await response.json();
      setDiagnosis(data);
      if (soundEnabled) sound.playChime(528);
    } catch (err) {
      console.error('Failed to match:', err);
      // Client-side instant graceful fallback
      setDiagnosis({
        matchedMasterId: 'su_shi',
        masterName: '苏轼',
        matchedReason: '苏东坡一生颠沛流离却能把日子过得有滋有味，最懂如何用豁达烟火抚慰受创的心境。',
        emotionSummary: '在眼前的坎坷与沉重中感到委屈疲乏，急需一份无拘无束的温暖托举。',
        empathyOpening: '哈哈！小友来啦？莫慌莫愁，老夫当年被贬到黄州连肉都快吃不起了，不也乐乐呵呵做出了东坡肉？来，喝口茶！',
        prescription: {
          title: '东坡煨肉清欢贴',
          ingredients: ['清欢两钱', '明月一壶', '随意啦半斤'],
          instructions: '小火慢煨，莫急莫躁。今晚先好好吃顿热饭，明天天塌不下来！',
          philosophicalKey: '回首向来萧瑟处，归去，也无风雨也无晴。',
        },
        suggestedAction: '放下手机，去倒一杯温热的水，慢慢喝完，做两次长长的吐气。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchedMaster: MasterProfile | undefined = diagnosis
    ? MASTERS[diagnosis.matchedMasterId] || MASTERS.su_shi
    : undefined;

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF3EB] via-[#F4EDE2] to-[#EAE0D1] border border-[#E3D7C5] p-6 sm:p-10 shadow-sm">
        <div className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none">
          <img
            src={HERO_BANNER_URL}
            alt="Healing Pavilion"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E3D7C5] text-[#C23E32] text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>智能情绪诊断 · 古代先贤专场解忧</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C2A29] font-serif tracking-tight leading-snug" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            心中有惑，何不问古贤？
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#615A52] leading-relaxed">
            苏轼的红烧肉、庄周的梦中蝶、李白的樽中月、老子的上善水、阳明的心中灯。
            写下你此刻的情绪困扰，系统将为你引荐最相契的古代先贤大师，前来进行深层情感共鸣与心灵疗愈。
          </p>

          {/* Quick preset worry suggestions */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#877E75] font-medium flex items-center gap-1">
              <Feather className="w-3.5 h-3.5 text-[#C23E32]" />
              常见困惑轻触填入：
            </span>
            {PRESET_WORRIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePickPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-[#554E46] border border-[#E3D7C5] transition-all hover:border-[#C23E32]/40 text-left line-clamp-1 max-w-[200px]"
                title={preset}
              >
                {preset.slice(0, 16)}...
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Input Form */}
      <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleMatch} className="space-y-6">
          {/* Emotion Tag Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#2C2A29] mb-3">
              1. 勾选符合你此刻心情的标签（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_MOOD_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#C23E32] text-white shadow-xs scale-[1.02]'
                        : 'bg-[#FAF7F2] text-[#615A52] border border-[#E8DFD1] hover:border-[#C23E32]/50 hover:bg-[#FDF9F5]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea for detailed problem */}
          <div>
            <label className="block text-sm font-semibold text-[#2C2A29] mb-2 flex items-center justify-between">
              <span>2. 详细倾诉（写得越真切，匹配越精准）</span>
              <span className="text-xs font-normal text-[#877E75]">
                {userProblem.length} 字
              </span>
            </label>
            <textarea
              value={userProblem}
              onChange={(e) => setUserProblem(e.target.value)}
              placeholder="例如：最近换了一份新工作，压力很大，总觉得自己能力不够，每天都处在精神内耗中，不知道该怎么摆脱这种焦虑感..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-[#2C2A29] placeholder-[#9E968D] focus:outline-none focus:ring-2 focus:ring-[#C23E32]/20 focus:border-[#C23E32] transition-all text-sm leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#F2ECE2]">
            <div className="text-xs text-[#877E75] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#3E6B48]"></span>
              五位先贤均在室静候，准备为你研磨心药
            </div>

            <button
              type="submit"
              disabled={isLoading || (!userProblem.trim() && selectedTags.length === 0)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C23E32] to-[#A32E23] text-white font-semibold text-sm shadow-md shadow-[#C23E32]/25 hover:shadow-lg hover:shadow-[#C23E32]/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>先贤正在研墨诊脉中...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>匹配专属先贤 · 开启疗愈</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Matching Result Section */}
      {diagnosis && matchedMaster && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Master Match Showcase Card */}
          <div 
            className="rounded-3xl border p-6 sm:p-8 bg-white shadow-md relative overflow-hidden"
            style={{ borderColor: matchedMaster.themeColor.border }}
          >
            {/* Background Decorative Tint */}
            <div 
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none -mr-20 -mt-20"
              style={{ backgroundColor: matchedMaster.themeColor.primary }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Master Avatar & Seal */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative group">
                  <div 
                    className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 shadow-xl relative"
                    style={{ borderColor: matchedMaster.themeColor.primary }}
                  >
                    <img
                      src={matchedMaster.avatarUrl}
                      alt={matchedMaster.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Dynasty Seal Stamp */}
                  <div 
                    className="absolute -bottom-3 -right-2 px-3 py-1 rounded-md text-white text-xs font-serif font-bold shadow-md transform rotate-3"
                    style={{ backgroundColor: matchedMaster.themeColor.primary }}
                  >
                    {matchedMaster.dynasty} · {matchedMaster.name}
                  </div>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {matchedMaster.name}
                </h3>
                <p className="text-xs text-[#877E75] mt-1 font-medium">
                  {matchedMaster.courtesyName} · {matchedMaster.title}
                </p>

                {/* Specialty tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {matchedMaster.specialty.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: matchedMaster.themeColor.tagBg,
                        color: matchedMaster.themeColor.badgeText,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diagnosis & Matching Reasoning */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs px-2.5 py-0.5 rounded-md font-bold text-white shadow-xs"
                      style={{ backgroundColor: matchedMaster.themeColor.primary }}
                    >
                      灵犀匹配成功
                    </span>
                    <span className="text-xs text-[#877E75]">
                      古贤为您推开解忧阁门扉
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#2C2A29] font-serif" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    匹配缘由：{diagnosis.matchedReason}
                  </h4>
                </div>

                {/* Master's Empathy Opening */}
                <div 
                  className="p-4 sm:p-5 rounded-2xl border relative text-sm sm:text-base leading-relaxed"
                  style={{
                    backgroundColor: matchedMaster.themeColor.bgLight,
                    borderColor: matchedMaster.themeColor.border,
                  }}
                >
                  <div className="text-xs font-semibold mb-1 text-[#877E75] flex items-center gap-1">
                    <span>先贤第一句体己话：</span>
                  </div>
                  <p className="font-serif italic text-[#2C2A29]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    “{diagnosis.empathyOpening}”
                  </p>
                </div>

                {/* Wisdom Prescription Card */}
                <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DFD1] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: matchedMaster.themeColor.primary }}></span>
                      <h5 className="font-bold text-sm text-[#2C2A29]">
                        专属心灵药方 · 【{diagnosis.prescription.title}】
                      </h5>
                    </div>
                    <button
                      onClick={() => {
                        onSavePrescription({
                          ...diagnosis.prescription,
                          masterName: matchedMaster.name,
                          masterId: matchedMaster.id,
                          savedAt: Date.now(),
                        });
                        setIsSaved(true);
                        if (soundEnabled) sound.playWoodenFish();
                      }}
                      className={`text-xs px-3 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors ${
                        isSaved
                          ? 'bg-[#3E6B48] text-white'
                          : 'bg-white border border-[#E8DFD1] text-[#615A52] hover:bg-[#F2ECE2]'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>已收录到解忧集</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>收录此方</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFE8DD]">
                      <span className="text-[#877E75] block mb-1">主治心药：</span>
                      <span className="font-medium text-[#2C2A29]">
                        {diagnosis.prescription.ingredients.join('、')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFE8DD] sm:col-span-2">
                      <span className="text-[#877E75] block mb-1">服用指南：</span>
                      <span className="text-[#554E46] leading-relaxed">
                        {diagnosis.prescription.instructions}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs pt-1 flex items-start gap-1.5 text-[#615A52]">
                    <span className="font-semibold text-[#C23E32] shrink-0">药引金句：</span>
                    <span className="font-serif italic" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      {diagnosis.prescription.philosophicalKey}
                    </span>
                  </div>

                  {diagnosis.suggestedAction && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBE3B5] text-xs text-[#8A5A12] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-[#E5A93B]" />
                      <span>
                        <strong>此刻1分钟微舒缓：</strong> {diagnosis.suggestedAction}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => onStartChat(matchedMaster.id, userProblem)}
                    className="flex-1 min-w-[200px] px-6 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: matchedMaster.themeColor.primary }}
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span>与【{matchedMaster.name}】促膝长谈</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    onClick={() => onReadStory(matchedMaster.id)}
                    className="px-5 py-3.5 rounded-2xl bg-white border border-[#E8DFD1] hover:bg-[#FAF7F2] text-[#2C2A29] font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <BookOpen className="w-4 h-4 text-[#0D828A]" />
                    <span>看他的治愈小故事</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
