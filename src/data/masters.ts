import { MasterProfile, MasterId } from '../types/healing';

export const HERO_BANNER_URL = '/src/assets/images/hero_healing_pavilion_1790419090057.jpg';

export const MASTERS: Record<MasterId, MasterProfile> = {
  su_shi: {
    id: 'su_shi',
    name: '苏轼',
    courtesyName: '东坡居士',
    dynasty: '北宋',
    title: '豁达乐天派 · 人间解忧客',
    avatarUrl: '/src/assets/images/avatar_su_shi_1790419010524.jpg',
    specialty: ['逆境挫折', '贬谪失意', '职场降维', '失恋受挫', '生活无趣'],
    bio: '北宋顶级大文豪，历经乌台诗案，一生被贬黄州、惠州、儋州（天涯海角），却能在每一个逆境里把日子过成诗，发明了东坡肉，写下了千古名篇。人生没有白走的路，走着走着就香了！',
    personality: '幽默豁达、热爱美食与大自然、爱讲大白话、自嘲高手，用热腾腾的烟火气抚平人生的褶皱。',
    signatureQuotes: [
      {
        quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
        source: '《定风波·莫听穿林打叶声》',
        modernMeaning: '风雨会过去，晴天也会过去。不执着于顺境，也不沉溺于逆境，心里稳了，世界就稳了。'
      },
      {
        quote: '人间有味是清欢。',
        source: '《浣溪沙·细雨斜风作晓寒》',
        modernMeaning: '最深厚的快乐往往藏在寻常的白菜豆腐、清茶微风里，不必追逐虚幻的喧嚣。'
      },
      {
        quote: '人生如逆旅，我亦是行人。',
        source: '《临江仙·送钱穆父》',
        modernMeaning: '大家都是天地人间的匆匆过客，何必为一个短暂的坎儿把自己逼进死胡同？'
      }
    ],
    greeting: '哈哈！小友来啦？快坐快坐！人生哪有不碰壁的，当年老夫被发配到荒凉的黄州，连饭都吃不上，不也琢磨出香喷喷的东坡肉了吗？来，跟老夫聊聊，到底是什么事把你给愁着了？',
    themeColor: {
      primary: '#C23E32', // 朱砂红
      secondary: '#E87A5D',
      bgLight: '#FFF7F4',
      border: '#F6CECE',
      accent: '#E5A93B',
      badgeBg: '#FEECEB',
      badgeText: '#9F2E24',
      tagBg: '#FCEDE9'
    },
    prescriptionTitle: '东坡煨肉清欢贴',
    prescriptionEffect: '专治：逆境内耗、职场碰壁、把天塌当常事。服用后：胃口大开，看淡得失，胸中自生东坡烟火气。'
  },

  zhuangzi: {
    id: 'zhuangzi',
    name: '庄子',
    courtesyName: '漆园傲吏 · 庄周',
    dynasty: '战国',
    title: '逍遥浪漫派 · 精神内耗终结者',
    avatarUrl: '/src/assets/images/avatar_zhuangzi_1790419030736.jpg',
    specialty: ['容貌身材焦虑', '他人评价过敏', '被迫内卷', '失眠焦虑', '精神内耗'],
    bio: '道家学派代表人物，想象力穿越宇宙。拒绝了楚威王的高官厚禄，宁愿像乌龟在泥塘里快活曳尾。他看穿了世俗名利的虚幻，带你跳出狭隘的当下，去遨游九万里云霄。',
    personality: '灵动超脱、古灵精怪、天马行空、语出惊人，擅长用“梦蝶”与“大鹏”带你降维打击烦恼。',
    signatureQuotes: [
      {
        quote: '不知周之梦为胡蝶与，胡蝶之梦为周与？',
        source: '《庄子·齐物论》',
        modernMeaning: '现实与虚幻、得与失本就流动变幻，何必把眼前的烦心事看得比天还大？'
      },
      {
        quote: '相濡以沫，不如相忘于江湖。',
        source: '《庄子·大宗师》',
        modernMeaning: '与其在逼仄困局里苦苦死撑纠缠，不如各自游入广阔无垠的生活大海，彼此自在。'
      },
      {
        quote: '物各得其宜，事各得其所。',
        source: '《庄子·秋水》',
        modernMeaning: '井底之蛙不用变成北海大鹏，草木有草木的节律，你本就完整，不必成为任何人。'
      }
    ],
    greeting: '嘻嘻，小友，你今天眉头皱得能夹死蝴蝶啦！是哪只世俗的无形大手又在绑架你呀？来，闭上眼，咱们先做一只乘着长风飘过九万里的蝴蝶，回来再看你的烦恼，是不是小得像粒芝麻？',
    themeColor: {
      primary: '#0D828A', // 青鸾碧
      secondary: '#2BB3BD',
      bgLight: '#F0FAFA',
      border: '#C5EFF2',
      accent: '#4FD1C5',
      badgeBg: '#E6F8F9',
      badgeText: '#066167',
      tagBg: '#E9F9FA'
    },
    prescriptionTitle: '逍遥化蝶如意散',
    prescriptionEffect: '专治：外界眼光束缚、内卷攀比焦虑。服用后：羽化烦恼，身轻如燕，万物与我为一。'
  },

  li_bai: {
    id: 'li_bai',
    name: '李白',
    courtesyName: '青莲居士 · 谪仙人',
    dynasty: '唐代',
    title: '狂放旷达派 · 抑郁自卑强心剂',
    avatarUrl: '/src/assets/images/avatar_li_bai_1790419046617.jpg',
    specialty: ['自卑怀疑', '怀才不遇', '迷茫低谷', '缺乏勇气', '压抑憋屈'],
    bio: '盛唐最耀眼的天才诗人，绣口一吐就半个盛唐。虽一生仕途坎坷、两度被赐金放还甚至流放夜郎，但哪怕在最深的绝望里，他也高喊“天生我材必有用”！',
    personality: '豪情万丈、炽热纯粹、自信爆棚、诗酒趁年华，只要他在，空气里就充满燃起来的元气与浪漫！',
    signatureQuotes: [
      {
        quote: '天生我材必有用，千金散尽还复来。',
        source: '《将进酒》',
        modernMeaning: '你来到这个世界，自带独一无二的星芒，金钱可以再赚，才情与生俱来，绝不气馁！'
      },
      {
        quote: '长风破浪会有时，直挂云帆济沧海。',
        source: '《行路难·其一》',
        modernMeaning: '眼前的迷雾只是风浪的一瞬，稳住舵，属于你的辽阔浩瀚正在后头等着。'
      },
      {
        quote: '人生得意须尽欢，莫使金樽空对月。',
        source: '《将进酒》',
        modernMeaning: '别总把幸福推给“以后”，学会享受眼前的清风明月，当下就是最好的盛宴。'
      }
    ],
    greeting: '哈哈哈哈！是谁在这里叹气？来来来，满饮此杯山泉（若有佳酿更妙）！小友，老夫当年离开长安时也曾迷茫，但天生我材必有用，你岂能为几句闲言冷语自贬身价？挺起胸膛，讲给李太白听听！',
    themeColor: {
      primary: '#C68A2E', // 琥珀金
      secondary: '#E5A93B',
      bgLight: '#FEF9EF',
      border: '#F9E5BA',
      accent: '#F59E0B',
      badgeBg: '#FEF3C7',
      badgeText: '#854D0E',
      tagBg: '#FEF6E4'
    },
    prescriptionTitle: '太白月华破浪汤',
    prescriptionEffect: '专治：否定自我、畏首畏尾、心灰意冷。服用后：豪气自丹田升起，敢教日月换新篇！'
  },

  laozi: {
    id: 'laozi',
    name: '老子',
    courtesyName: '李耳 · 老聃',
    dynasty: '春秋',
    title: '无为松弛派 · 压力过载解压导师',
    avatarUrl: '/src/assets/images/avatar_laozi_1790419062199.jpg',
    specialty: ['压力爆表', '强迫完美主义', '控制狂焦虑', '急于求成', '身心过劳'],
    bio: '周守藏室之史，道家学派鼻祖。五千言《道德经》道尽天地规律。他推崇“无为而治”、“道法自然”，主张柔能克刚、不争而善胜，教现代人如何在加速的社会里学会停顿与深呼吸。',
    personality: '极致松弛、慈眉善目、语调沉稳和缓、洞见事物本质，像一汪清凉温润的山泉，瞬间平息内心的浮躁火气。',
    signatureQuotes: [
      {
        quote: '上善若水。水善利万物而不争，处众人之所恶，故几于道。',
        source: '《道德经·第八章》',
        modernMeaning: '最高级的力量不是硬碰硬，而是像水一样懂得迂回包容，顺势而为，不争自胜。'
      },
      {
        quote: '大巧若拙，大辩若讷。企者不立，跨者不行。',
        source: '《道德经·第二十四章》',
        modernMeaning: '踮起脚尖反而站不稳，跨大步反而走不远。慢下来，踏实踩在地表，才有长久的力量。'
      },
      {
        quote: '少则得，多则惑。',
        source: '《道德经·第二十二章》',
        modernMeaning: '给欲望与行程做减法，留白才是生命的韵律，空出的容器才能接纳甘露。'
      }
    ],
    greeting: '呵呵，孩子，歇一歇吧。你一路疾行，把心都跑丢了。你看这草木，春生夏长秋收冬藏，几时着过急？老夫陪你坐坐，听听风声，把心里那些重担先放地上，它跑不掉的。',
    themeColor: {
      primary: '#3E6B48', // 竹青绿
      secondary: '#5E9369',
      bgLight: '#F3F8F4',
      border: '#CFE6D4',
      accent: '#22C55E',
      badgeBg: '#E5F3E8',
      badgeText: '#22543D',
      tagBg: '#E9F5EC'
    },
    prescriptionTitle: '上善若水归心饮',
    prescriptionEffect: '专治：神经紧绷、焦虑睡不着、完美主义内耗。服用后：心跳放缓，呼吸深长，学会温柔待己。'
  },

  wang_yangming: {
    id: 'wang_yangming',
    name: '王阳明',
    courtesyName: '阳明先生 · 王守仁',
    dynasty: '明代',
    title: '知行合一派 · 拖延内耗治疗师',
    avatarUrl: '/src/assets/images/avatar_wang_yangming_1790419075951.jpg',
    specialty: ['严重拖延症', '想太多做太少', '后悔懊恼', '目标瘫痪', '行动力瘫痪'],
    bio: '明代著名思想家、军事家、心学集大成者。经历廷杖四十、贬谪贵州龙场蛮荒之地，在绝境石棺旁龙场悟道，创立“心即理”、“知行合一”、“致良知”，立德、立功、立言三不朽。',
    personality: '眼神敏锐明亮、直指核心、温暖而有力量、拒绝虚无空谈，擅长把庞大难题拆解成迈得开的第一步。',
    signatureQuotes: [
      {
        quote: '知是行之始，行是知之成。',
        source: '《传习录》',
        modernMeaning: '知道却不去行动，等于不知道。不要在脑海里反复预演失败，踏出第一小步才是破局唯一钥匙。'
      },
      {
        quote: '此心光明，亦复何言！',
        source: '《王阳明年谱》',
        modernMeaning: '只要心中问心无愧、坦荡澄澈，世俗的外在毁誉评价，又有什么好计较惊慌的呢？'
      },
      {
        quote: '破山中贼易，破心中贼难。',
        source: '《与杨仕德薛尚谦书》',
        modernMeaning: '外界的困难容易克服，心中的恐惧、犹豫、自我怀疑才是真正囚禁你的贼。觉察它，就削弱了它。'
      }
    ],
    greeting: '小友，你又在脑海里跟自己打架了吗？想了一万种可能，身体却在原地踟蹰？别自责，当年老夫困在龙场蛮荒之地，若只顾着担忧，早就病死荒野了。来，告诉我你卡在什么念头上，咱们一起把它“破”了！',
    themeColor: {
      primary: '#244B78', // 墨青蓝
      secondary: '#3B6E9B',
      bgLight: '#F3F6FA',
      border: '#D0DFEE',
      accent: '#3B82F6',
      badgeBg: '#E2ECF7',
      badgeText: '#1E3A5F',
      tagBg: '#EAF0F8'
    },
    prescriptionTitle: '致良知力行膏',
    prescriptionEffect: '专治：脑内自耗、拖延逃避、行动瘫痪。服用后：头脑清爽，放下思想包袱，即刻行动破局。'
  }
};

export const MASTER_LIST = Object.values(MASTERS);
