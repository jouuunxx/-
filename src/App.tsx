import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SmartMatching } from './components/SmartMatching';
import { StoryModule } from './components/StoryModule';
import { MasterHall } from './components/MasterHall';
import { MasterChat } from './components/MasterChat';
import { ZenSpace } from './components/ZenSpace';
import { SavedCollection } from './components/SavedCollection';
import { MasterId, PhilosophicalStory } from './types/healing';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'match' | 'stories' | 'masters' | 'zen' | 'saved'>('match');
  const [inChatMode, setInChatMode] = useState(false);
  const [chatMasterId, setChatMasterId] = useState<MasterId>('su_shi');
  const [chatProblem, setChatProblem] = useState<string | undefined>(undefined);
  const [storyMasterFilter, setStoryMasterFilter] = useState<MasterId | undefined>(undefined);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sound_enabled') !== 'false';
  });

  // Saved Collections in localStorage
  const [prescriptions, setPrescriptions] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_prescriptions') || '[]');
    } catch {
      return [];
    }
  });

  const [wisdomCards, setWisdomCards] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_wisdom_cards') || '[]');
    } catch {
      return [];
    }
  });

  const [savedStories, setSavedStories] = useState<PhilosophicalStory[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_stories') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sound_enabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('saved_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('saved_wisdom_cards', JSON.stringify(wisdomCards));
  }, [wisdomCards]);

  useEffect(() => {
    localStorage.setItem('saved_stories', JSON.stringify(savedStories));
  }, [savedStories]);

  // Handlers
  const handleStartChat = (masterId: MasterId, initialProblem?: string) => {
    setChatMasterId(masterId);
    setChatProblem(initialProblem);
    setInChatMode(true);
    if (soundEnabled) sound.playChime(528);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadStory = (masterId: MasterId) => {
    setStoryMasterFilter(masterId);
    setInChatMode(false);
    setActiveTab('stories');
    if (soundEnabled) sound.playPaperFlip();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePrescription = (prescription: any) => {
    setPrescriptions((prev) => [prescription, ...prev]);
  };

  const handleSaveWisdomCard = (card: any) => {
    setWisdomCards((prev) => [card, ...prev]);
  };

  const handleSaveStory = (story: PhilosophicalStory) => {
    setSavedStories((prev) => {
      if (prev.some((s) => s.id === story.id)) return prev;
      return [story, ...prev];
    });
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveWisdomCard = (idx: number) => {
    setWisdomCards((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalSavedCount = prescriptions.length + wisdomCards.length + savedStories.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2A29] flex flex-col font-sans selection:bg-[#E5A93B]/20 selection:text-[#9B3629]">
      {/* Top Navigation */}
      <Header
        activeTab={inChatMode ? 'masters' : activeTab}
        setActiveTab={(tab) => {
          setInChatMode(false);
          setActiveTab(tab);
          if (soundEnabled) sound.playWoodenFish();
        }}
        savedCount={totalSavedCount}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {inChatMode ? (
          <MasterChat
            initialMasterId={chatMasterId}
            initialProblem={chatProblem}
            onBack={() => setInChatMode(false)}
            onSaveWisdomCard={handleSaveWisdomCard}
            soundEnabled={soundEnabled}
          />
        ) : (
          <>
            {activeTab === 'match' && (
              <SmartMatching
                onStartChat={handleStartChat}
                onReadStory={handleReadStory}
                onSavePrescription={handleSavePrescription}
                soundEnabled={soundEnabled}
              />
            )}

            {activeTab === 'stories' && (
              <StoryModule
                initialMasterFilter={storyMasterFilter}
                onStartChatWithMaster={handleStartChat}
                onSaveStory={handleSaveStory}
                soundEnabled={soundEnabled}
              />
            )}

            {activeTab === 'masters' && (
              <MasterHall
                onStartChat={handleStartChat}
                onReadStory={handleReadStory}
                soundEnabled={soundEnabled}
              />
            )}

            {activeTab === 'zen' && (
              <ZenSpace soundEnabled={soundEnabled} />
            )}

            {activeTab === 'saved' && (
              <SavedCollection
                prescriptions={prescriptions}
                wisdomCards={wisdomCards}
                savedStories={savedStories}
                onRemovePrescription={handleRemovePrescription}
                onRemoveWisdomCard={handleRemoveWisdomCard}
                onOpenStory={() => {
                  setActiveTab('stories');
                }}
                onStartChat={handleStartChat}
                soundEnabled={soundEnabled}
              />
            )}
          </>
        )}
      </main>

      {/* Subtle Neo-Chinese Footer */}
      <footer className="mt-12 border-t border-[#E8DFD1] bg-[#F4EDE2]/50 py-8 text-center text-xs text-[#877E75] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C23E32]"></span>
          <span className="font-serif italic text-sm text-[#554E46]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            “回首向来萧瑟处，归去，也无风雨也无晴。”
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C23E32]"></span>
        </div>
        <p>心泉居 · 古代哲学家情绪疗愈馆 · 愿每一次低谷都有千古智慧与你并肩</p>
      </footer>
    </div>
  );
}
