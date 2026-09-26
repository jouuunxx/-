import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MASTER_PERSONAS: Record<string, string> = {
  su_shi: `你是北宋文豪苏轼（东坡居士）。你历经乌台诗案，一生多次被贬（黄州、惠州、儋州），却始终豁达乐观、热爱美食与烟火生活。
你的性格特点：幽默风趣、热情开朗、爱拿吃的美食打比方（如东坡肉、荔枝、野菜、清茶）、爱自嘲、以诗化苦。
说话风格：亲切称呼对方为“小友”，语言通俗接地气，把大智慧融在人间烟火里。核心哲学：“人间有味是清欢”、“回首向来萧瑟处，也无风雨也无晴”。`,

  zhuangzi: `你是战国思想家庄子（庄周）。你厌恶世俗名缰利锁，追求身心的绝对逍遥与精神自得。
你的性格特点：灵动古怪、天马行空、语出惊人、爱用动物与自然做寓言（梦蝶、北海大鹏、濠梁之鱼、烂泥塘里快活的乌龟）。
说话风格：诙谐俏皮、称呼对方为“小友”，善于帮对方跳出狭隘的框架，降维打击世俗焦虑与他人目光。核心哲学：“相濡以沫不如相忘于江湖”、“庄周梦蝶”、“物各得其宜”。`,

  li_bai: `你是盛唐诗仙李白（青莲居士 · 谪仙人）。你才华横溢、豪情万丈，虽一生怀才不遇流离失所，但自信坚如磐石。
你的性格特点：元气满满、激情四射、把酒言欢、随时能为对方注入自信与勇气，绝不向挫折低头。
说话风格：豪迈奔放、哈哈大笑、充满感染力与诗意浪漫，鼓励对方挺起胸膛。核心哲学：“天生我材必有用”、“长风破浪会有时，直挂云帆济沧海”。`,

  laozi: `你是春秋先哲老子（李耳）。《道德经》作者，倡导“道法自然”、“无为而无不为”。
你的性格特点：极致松弛、慈眉善目、语调平缓沉稳如山泉，主张柔能克刚、不争而天下莫能与之争。
说话风格：如慈祥智慧的长者，安抚对方狂躁焦急的心跳，教对方给生活做减法、学会停顿和深呼吸。核心哲学：“上善若水”、“大巧若拙”、“少则得，多则惑”。`,

  wang_yangming: `你是明代心学宗师王阳明。创立“知行合一”、“致良知”、“心即理”，在龙场绝境石棺旁悟道。
你的性格特点：眼神明亮敏锐、干练果断、温暖有力、拒绝空谈内耗，专治拖延与自我怀疑。
说话风格：直击本质、温和而坚定、善于拆解大难题为“当下立刻能做的第一小步”。核心哲学：“知是行之始，行是知之成”、“此心光明，亦复何言”、“破心中贼”。`
};

// 1. 智能匹配大师 API
app.post('/api/match-master', async (req: Request, res: Response) => {
  const { userProblem, selectedTags } = req.body;

  if (!userProblem && (!selectedTags || selectedTags.length === 0)) {
    return res.status(400).json({ error: '请描述您的心事或选择情绪标签' });
  }

  const promptText = `
你是一位精通中国传统哲学与现代心理学的情绪疗愈导师。
请分析用户倾诉的心理困扰与情绪状态，从以下五位中国古代大师中智能匹配最合适的一位来为他“坐诊”疗愈：
1. su_shi（苏轼）：专治职场逆境挫折、失意贬谪、生活无趣、把苦难变乐天、需要烟火气美食治愈；
2. zhuangzi（庄子）：专治精神内耗、容貌身材焦虑、他人眼光评判、内卷攀比、跳出框架逍遥自得；
3. li_bai（李白）：专治自卑迷茫、怀才不遇、丧失斗志信心、抑郁憋屈、需要注入狂放元气与豪情；
4. laozi（老子）：专治紧绷过劳、完美主义、压力爆棚、急躁失控、需要松弛静心顺应自然；
5. wang_yangming（王阳明）：专治严重拖延、想太多做太少、后悔内疚、自我怀疑、需要知行合一行动破局。

用户的心事倾诉：
"${userProblem || '未详细叙述'}"
用户选择的情绪标签：
[${(selectedTags || []).join(', ')}]

请务必输出合法的 JSON 格式（不要使用 Markdown 代码块包裹，直接输出纯 JSON），字段格式如下：
{
  "matchedMasterId": "su_shi | zhuangzi | li_bai | laozi | wang_yangming",
  "masterName": "大师中文名",
  "matchedReason": "简明扼要说明为什么该大师是最契合的解忧人选（50字以内，活泼温暖）",
  "emotionSummary": "一句话温柔道出用户此刻最核心的心结与情绪底色（30字以内）",
  "empathyOpening": "大师以自己的语气向用户说的第一句安慰与接引之语（60字以内，活泼亲切有大师个性）",
  "prescription": {
    "title": "心灵药方名称（如：东坡煨肉清欢贴 / 逍遥化蝶如意散等）",
    "ingredients": ["妙趣药材1", "妙趣药材2", "妙趣药材3"],
    "instructions": "服用方法建议（幽默活泼的生活化指引，如每日观云十分钟，少看手机三次）",
    "philosophicalKey": "大师经典哲学金句及对这道药的提点"
  },
  "suggestedAction": "一个用户此刻只需要耗时1分钟即可完成的极小放松微动作"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Clean possible backticks
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      data = JSON.parse(cleanJson);
    }

    return res.json(data);
  } catch (error) {
    console.error('Error calling Gemini for master matching:', error);

    // Fallback heuristic matching if API fails or lacks key
    const textLower = (userProblem || '').toLowerCase();
    let fallbackId: 'su_shi' | 'zhuangzi' | 'li_bai' | 'laozi' | 'wang_yangming' = 'su_shi';

    if (textLower.includes('拖延') || textLower.includes('后悔') || textLower.includes('做不到') || textLower.includes('行动')) {
      fallbackId = 'wang_yangming';
    } else if (textLower.includes('累') || textLower.includes('紧绷') || textLower.includes('压力') || textLower.includes('失眠') || textLower.includes('慢')) {
      fallbackId = 'laozi';
    } else if (textLower.includes('自卑') || textLower.includes('失败') || textLower.includes('信心') || textLower.includes('没用')) {
      fallbackId = 'li_bai';
    } else if (textLower.includes('他人') || textLower.includes('评价') || textLower.includes('内耗') || textLower.includes('比较') || textLower.includes('卷')) {
      fallbackId = 'zhuangzi';
    } else {
      fallbackId = 'su_shi';
    }

    const fallbackProfiles: Record<string, any> = {
      su_shi: {
        matchedMasterId: 'su_shi',
        masterName: '苏轼',
        matchedReason: '苏东坡一生被贬无数却把日子过得活色生香，最擅长用烟火气和达观心态融化人生的坎坷冰霜！',
        emotionSummary: '在逆境与不顺中感到疲惫委屈，急需一份温暖扎实的烟火慰藉。',
        empathyOpening: '哈哈！小友莫愁，老夫当年在黄州连饭都快吃不起了，不也捣鼓出东坡肉了吗？来，坐下吃杯热茶！',
        prescription: {
          title: '东坡煨肉清欢贴',
          ingredients: ['清欢两钱', '明月一壶', '随便啦半斤'],
          instructions: '小火慢炖，切莫心急。今晚好好吃一顿热饭，天塌下来先垫饱肚子。',
          philosophicalKey: '回首向来萧瑟处，归去，也无风雨也无晴。'
        },
        suggestedAction: '伸个大大的懒腰，喝一大口温水，深吸一口气对自己说：吃饭最大，烦恼靠边！'
      },
      zhuangzi: {
        matchedMasterId: 'zhuangzi',
        masterName: '庄子',
        matchedReason: '庄子最擅长用无拘无束的蝴蝶和大鱼破除思维牢笼，带你从他人的目光中彻底解脱！',
        emotionSummary: '被外界标准或内在自我评判捆绑，心思重重心力交瘁。',
        empathyOpening: '嘻嘻，小友，你眉头上的结比战国各国的边境线还复杂呢！来，闭上眼，咱们先化只蝴蝶飞两圈！',
        prescription: {
          title: '逍遥化蝶如意散',
          ingredients: ['九万里长风一缕', '花香三两', '关我啥事八钱'],
          instructions: '每日抬头看天三次，凡遇烦心事心中默念：关我何事，关你何事。',
          philosophicalKey: '不知周之梦为胡蝶与，胡蝶之梦为周与？'
        },
        suggestedAction: '闭上眼睛深呼吸，想象烦恼化作一片小落叶被长风吹散。'
      },
      li_bai: {
        matchedMasterId: 'li_bai',
        masterName: '李白',
        matchedReason: '李太白有着浩瀚宇宙般的自信与浪漫，能为你瞬间注入天生我材的无上豪情！',
        emotionSummary: '在自我否定或暂时的挫败中黯然失色，渴望重新点亮心中的火苗。',
        empathyOpening: '哈哈哈哈！是谁在叹气？小友，来与太白满饮此杯山泉！天生你材必有用，何苦自轻自贱！',
        prescription: {
          title: '太白月华破浪汤',
          ingredients: ['盛唐豪气一斗', '金樽明月半盏', '昂首挺胸三钱'],
          instructions: '每日清晨对镜子大笑一声，默念李太白大名，抬头走路。',
          philosophicalKey: '天生我材必有用，千金散尽还复来！'
        },
        suggestedAction: '挺起胸膛，双手插腰，做一个大大的深呼吸，抬头微笑着对自己点个头。'
      },
      laozi: {
        matchedMasterId: 'laozi',
        masterName: '老子',
        matchedReason: '老子洞悉天道运转之理，以水之至柔化解生活中的所有硬碰硬与焦虑紧绷。',
        emotionSummary: '用力过猛、精神神经高度紧绷，急需停下来大口喘息。',
        empathyOpening: '孩子，歇一歇吧。天地尚不能久骤，何况人呢？来，把心里的担子先搁在老夫青牛旁。',
        prescription: {
          title: '上善若水归心饮',
          ingredients: ['山涧清泉一汪', '慢半拍三钱', '留白八两'],
          instructions: '遇急事缓办，遇争执绕行。每日给手机关机半小时，发呆放空。',
          philosophicalKey: '上善若水，水善利万物而不争。'
        },
        suggestedAction: '闭上双眼，缓慢均匀地吐气四次，把紧绷耸起的双肩彻底沉下来。'
      },
      wang_yangming: {
        matchedMasterId: 'wang_yangming',
        masterName: '王阳明',
        matchedReason: '王阳明精于破除心中之贼，教你放下脑内自我批判，以最微小的第一步重获掌控！',
        emotionSummary: '想太多做太少，在拖延自责与焦虑徘徊中反复折磨。',
        empathyOpening: '小友，别再脑海里跟自己搏斗了！想全是难题，做才有答案。来，告诉老夫你眼下最怕什么？',
        prescription: {
          title: '致良知力行膏',
          ingredients: ['当下此时一克', '动手两分', '抛弃杂念半升'],
          instructions: '不要试图一次解决所有麻烦。把任务拆解成两分钟即可开启的微步骤，立即动手。',
          philosophicalKey: '知是行之始，行是知之成；此心光明，亦复何言！'
        },
        suggestedAction: '立刻站起来走动三步，收拾桌面上离你最近的一样杂物，感受完成感。'
      }
    };

    return res.json(fallbackProfiles[fallbackId]);
  }
});

// 2. 大师对话 API
app.post('/api/chat', async (req: Request, res: Response) => {
  const { masterId, messages, userProblem } = req.body;

  if (!masterId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '无效的对话参数' });
  }

  const persona = MASTER_PERSONAS[masterId] || MASTER_PERSONAS.su_shi;

  const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? '用户' : '大师'}：${m.content}`).join('\n');

  const systemInstruction = `
${persona}

当前用户所面临的心境困扰：
"${userProblem || '未具体说明，倾诉日常困扰'}"

【回复要求】：
1. 始终完全沉浸在大师的第一人称角色中，语言活泼、温暖、生动易懂、富有哲理却不死板（充满新式中国风的亲和力，绝不古板说教，也不要满嘴生涩难懂的古文，而是像一位幽默睿智、跨越千年穿越而来的老朋友）。
2. 共情用户的痛点，用大师特有的经历、典故、食物或自然意象做巧妙比喻，帮助用户放松心情、转变认知视角。
3. 结尾给予温暖有力的托举或一个极具可操作性的小建议。
4. 每回答 2-3 次对话时，或者当给出了关键哲学点拨时，可以在回复的最后，用特殊标记附赠一张“解忧心笺”：
<<<WISDOM_CARD
quote: 经典金句
takeaway: 一句话现代解压提点
stamp: 印章四字（如“此心光明”或“人间清欢”）
>>>
（如果普通日常闲聊，不需要每次都带卡片）。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `对话历史记录如下：\n${conversationHistory}\n\n请以大师身份回应用户最新的发言：`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const replyRaw = response.text || '小友，老夫刚才思索良久，无论风雨多大，且记放宽心境，老夫一直在。';

    // Parse wisdom card if present
    let wisdomCard = null;
    let cleanReply = replyRaw;
    const cardMatch = replyRaw.match(/<<<WISDOM_CARD([\s\S]*?)>>>/);

    if (cardMatch) {
      const cardBlock = cardMatch[1];
      cleanReply = replyRaw.replace(/<<<WISDOM_CARD[\s\S]*?>>>/, '').trim();
      const quoteMatch = cardBlock.match(/quote:\s*(.+)/);
      const takeawayMatch = cardBlock.match(/takeaway:\s*(.+)/);
      const stampMatch = cardBlock.match(/stamp:\s*(.+)/);

      wisdomCard = {
        quote: quoteMatch ? quoteMatch[1].trim() : '此心光明，亦复何言',
        takeaway: takeawayMatch ? takeawayMatch[1].trim() : '顺应本心，莫为闲事扰清梦',
        stampText: stampMatch ? stampMatch[1].trim() : '灵犀解忧',
      };
    }

    return res.json({
      content: cleanReply,
      wisdomCard,
    });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return res.json({
      content: '小友莫急，山间微风拂过，老夫的心神与你同在。人生如逆旅，且放宽心，喝口温茶，老夫再细细与你道来。',
      wisdomCard: {
        quote: '莫听穿林打叶声，何妨吟啸且徐行。',
        takeaway: '外界风雨任它狂，心中的节奏自己掌舵。',
        stampText: '悠然自得',
      },
    });
  }
});

// 3. AI 定制哲学小故事 API
app.post('/api/story/generate', async (req: Request, res: Response) => {
  const { masterId, userMood, theme } = req.body;

  const persona = MASTER_PERSONAS[masterId] || MASTER_PERSONAS.su_shi;

  const prompt = `
请以中国古代哲学家为核心主角，为正处于“${userMood || '疲惫焦虑'}”情绪状态下的现代用户，创作一篇通俗易懂、生动活泼、幽默积极的全新【哲学小故事】。

大师角色设定：
${persona}
故事主题或侧重点：${theme || '放下焦虑，获得身心放松'}

要求：
1. 语言通俗现代、节奏欢快，充满画面感与幽默感，绝不死板说教。
2. 故事围绕该大师的真实生平或经典哲学寓言进行现代趣味演绎。
3. 旨在让用户阅读后哈哈一笑或长舒一口气，产生“其实也没什么大不了”的解脱感与启发。

请返回纯 JSON 格式（不要包含任何 markdown 标记）：
{
  "title": "故事主标题（新颖有趣，如：苏东坡在荒岛烤生蚝的快乐秘诀）",
  "subTitle": "一句话副标题",
  "readTime": "2 分钟",
  "hook": "引人入胜的开篇一句话背景",
  "scenes": [
    { "sceneNumber": 1, "title": "小场景标题1", "narrative": "生动有趣的叙述（100-150字）" },
    { "sceneNumber": 2, "title": "小场景标题2", "narrative": "生动有趣的叙述（100-150字）" },
    { "sceneNumber": 3, "title": "小场景标题3", "narrative": "生动有趣的叙述（100-150字）" }
  ],
  "modernInsight": "给现代打工人和年轻人的治愈启示（直击痛点，温暖幽默）",
  "masterComment": "大师以第一人称送给用户的一句俏皮大实话",
  "mindfulnessPrompt": "读完后可以马上做的极简放松小练习",
  "stampWord": "四字印章（如：豁达清欢）"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      data = JSON.parse(cleanJson);
    }

    return res.json(data);
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({ error: '生成故事暂时遇到波动，请稍后再试' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
