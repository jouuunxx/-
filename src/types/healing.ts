export type MasterId = 'su_shi' | 'zhuangzi' | 'li_bai' | 'laozi' | 'wang_yangming';

export interface MasterProfile {
  id: MasterId;
  name: string;
  courtesyName: string; // 字/号
  dynasty: string;
  title: string; // 门派头衔/疗愈定位，如“豁达乐天派 · 人间解忧客”
  avatarUrl: string;
  specialty: string[]; // 专治病症
  bio: string;
  personality: string;
  signatureQuotes: {
    quote: string;
    source: string;
    modernMeaning: string;
  }[];
  greeting: string;
  themeColor: {
    primary: string;
    secondary: string;
    bgLight: string;
    border: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    tagBg: string;
  };
  prescriptionTitle: string; // 专属心灵药方名称，如“东坡煨肉清欢贴”
  prescriptionEffect: string;
}

export interface EmotionalDiagnosis {
  matchedMasterId: MasterId;
  masterName: string;
  matchedReason: string;
  emotionSummary: string;
  empathyOpening: string;
  prescription: {
    title: string;
    ingredients: string[]; // 心灵药材，例如“清欢三钱，明月一壶，无所谓半斤”
    instructions: string; // 服用指南
    philosophicalKey: string; // 哲学金句药引
  };
  suggestedAction: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  masterId?: MasterId;
  wisdomCard?: {
    quote: string;
    takeaway: string;
    stampText: string;
  };
}

export interface StoryScene {
  sceneNumber: number;
  title: string;
  narrative: string;
}

export interface PhilosophicalStory {
  id: string;
  masterId: MasterId;
  title: string;
  subTitle: string;
  category: 'career' | 'anxiety' | 'confidence' | 'relationship' | 'action';
  categoryLabel: string;
  readTime: string;
  hook: string; // 引人入胜的一句话背景
  scenes: StoryScene[];
  modernInsight: string; // 现代人的治愈启示
  masterComment: string; // 大师第一人称辣评/暖心话
  mindfulnessPrompt: string; // 读完后的小练习/放空指南
  likes: number;
  stampWord: string;
}
