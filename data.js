/* 智创运河 · 数据层 */

const charactersData = [
  {
    id: "chen-shuisheng",
    name: "陈水生",
    title: "运河支队 · 战士",
    role: "玩家化身",
    historicalLabel: "虚构人物",
    recordType: "个人档案",
    faction: "运河支队战士",
    chapters: "序章 → 第一章 → 第二章 → 第三章",
    accent: "#6a8a4a",
    fallbackBg: "linear-gradient(135deg, #6a8a4a 0%, #2a2a18 100%)",
    fallbackText: "水生",
    chop: "水",
    backChop: "记",
    avatar: "./assets/characters/stills/chen-shuisheng.jpg",
    memoryLine: "从失去家园的孩子，成长为守护运河的人。",
    bio: "运河边长大的普通少年。1939年冬，战火烧到家乡，他站在周营镇外的枣树林前，第一次听见“运河支队”的名字。从恐惧、饥饿与犹豫，到站上杜庄阵地、夜渡运河封锁线、走向韩庄大桥——他的每一步成长，就是你的每一次选择。",
    relationship: "你。你通过他的眼睛看运河两岸，用他的双手做出每一次抉择。",
    storyLine: "虚构主角，综合了运河两岸普通少年与百姓的情感线，用来承载玩家的视角与成长轨迹。",
    quote: "运河的水流了几千年，我们这代人的责任，就是不能让它断在鬼子手里。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "sun-bolong",
    name: "孙伯龙",
    title: "运河支队支队长",
    role: "队伍创建者",
    historicalLabel: "真实人物",
    recordType: "指挥档案",
    faction: "运河支队",
    chapters: "序章 · 第一章",
    accent: "#8b1a1a",
    fallbackBg: "linear-gradient(135deg, #8b1a1a 0%, #3d0808 100%)",
    fallbackText: "伯龙",
    chop: "帅",
    backChop: "龙",
    avatar: "./assets/characters/stills/sun-bolong.jpg",
    memoryLine: "把分散的抗日力量拧成一股绳。",
    bio: "1940年1月1日，在周营镇正式组建运河支队，任支队长。他善于团结各方抗日力量，将分散的地方武装整编为一支有组织、有纪律的队伍。在杜庄战斗中，他亲临前线指挥，确立了支队“依托群众、灵活作战”的风格。",
    relationship: "陈水生仰望的指挥者。在序章和第一章中，孙伯龙的出现代表着“方向”——他让水生第一次明白，为什么而战。",
    storyLine: "真实历史人物。游戏保留其建队、指挥杜庄战斗的核心事迹，台词与决策场景依据史料和口述记录改编。",
    quote: "我们这支部队，不是为了占山为王——是为了让运河两岸的老百姓，能过安稳日子。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "zhu-daonan",
    name: "朱道南",
    title: "运河支队政治委员",
    role: "思想引路人",
    historicalLabel: "真实人物",
    recordType: "政工档案",
    faction: "运河支队",
    chapters: "序章 · 第一章 · 第三章",
    accent: "#d4943a",
    fallbackBg: "linear-gradient(135deg, #8b6914 0%, #4a3008 100%)",
    fallbackText: "道南",
    chop: "政",
    backChop: "南",
    avatar: "./assets/characters/stills/zhao-zhengwei.jpg",
    memoryLine: "枪杆子里出政权，笔杆子里出人心。",
    bio: "运河支队政委，与孙伯龙搭档，负责队伍的思想政治工作与群众动员。他善于用最朴素的语言讲最深刻的道理，在战士和百姓中威信极高。在护送任务中，他负责协调沿线各村的群众接应。",
    relationship: "陈水生信念层面的引路人。他用“老百姓就是水，我们就是水里的鱼”这样的比喻，让水生理解了“为谁而战”。",
    storyLine: "真实历史人物。游戏中承担“信仰建设”这条线索，其台词和场景设计参考了运河支队政工史料。",
    quote: "老百姓就是水，我们就是水里的鱼。水干了，鱼就活不了。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "shao-jianqiu",
    name: "邵剑秋",
    title: "运河支队副支队长",
    role: "战术指挥官",
    historicalLabel: "真实人物",
    recordType: "指挥档案",
    faction: "运河支队",
    chapters: "第一章 · 第二章 · 第三章",
    accent: "#5a7a8a",
    fallbackBg: "linear-gradient(135deg, #5a7a8a 0%, #1e3a4a 100%)",
    fallbackText: "剑秋",
    chop: "将",
    backChop: "秋",
    avatar: "./assets/characters/stills/shao-jianqiu.jpg",
    memoryLine: "打仗不光靠勇敢，还得动脑子。",
    bio: "运河支队副支队长，擅长战术指挥与敌后渗透。在寒夜护送任务中，他负责路线规划和兵力部署，以极小的代价完成了陈毅的秘密护送。在炸桥行动中，他统筹爆破队与阻击组的协同。",
    relationship: "陈水生在任务中的直接上级。邵剑秋注重培养年轻战士的战术意识，常在行动前问水生“你觉得该怎么打？”，让玩家参与战术决策。",
    storyLine: "真实历史人物。游戏中承担“战术指挥”这条线索，其决策场景设计参考了运河支队战斗记录。",
    quote: "记住，保存自己才能消灭敌人。不怕死不等于送死——那叫不负责任。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "hu-daxun",
    name: "胡大勋",
    title: "运河支队参谋长",
    role: "实战指挥",
    historicalLabel: "真实人物",
    recordType: "指挥档案",
    faction: "运河支队",
    chapters: "第一章 · 第二章",
    accent: "#6b6b6b",
    fallbackBg: "linear-gradient(135deg, #7a7a7a 0%, #3a3a3a 100%)",
    fallbackText: "大勋",
    chop: "谋",
    backChop: "勋",
    avatar: "./assets/characters/stills/hu-daxun.jpg",
    memoryLine: "每一场仗打之前，心里就得有三分把握、七分预案。",
    bio: "运河支队参谋长，负责作战计划制定与兵力调配。性格沉稳、心思缜密，是队伍中的“定海神针”。在杜庄战斗中，他精准判断敌军进攻方向，为支队争取了宝贵的防御时间。",
    relationship: "陈水生敬畏的“严师”。胡大勋不轻易夸人，但会默默把一个水壶递到水生手里——这种沉默的关心，比任何话都重。",
    storyLine: "真实历史人物。游戏中承担“智谋”这条线索，台词中融合了军事参谋工作的专业细节。",
    quote: "打仗不是拼人多，是拼谁想得远、算得准。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "chen-yi",
    name: "陈毅",
    title: "新四军代军长 · 张处长",
    role: "秘密护送对象",
    historicalLabel: "真实人物",
    recordType: "特殊档案",
    faction: "新四军",
    chapters: "第二章",
    accent: "#b8933a",
    fallbackBg: "linear-gradient(135deg, #8b6914 0%, #5a3e08 100%)",
    fallbackText: "陈毅",
    chop: "密",
    backChop: "毅",
    avatar: "./assets/characters/stills/chen-yi.jpg",
    memoryLine: "此任务不得声张。",
    bio: "1943年冬，陈毅乔装为“张处长”，在运河支队护送下，穿越陇海铁路日军封锁线，经北许阳、杜安集、德胜庄附近涉水过运河，安全抵达下一站，继续前往延安参加整风学习和党的七大。这是一条用生命守护的秘密交通线。",
    relationship: "在游戏中以“张处长”身份出现，对话中隐去真实身份。完成护送任务后解锁陈毅完整档案，玩家才会知道那夜护送的是谁。",
    storyLine: "真实历史人物。游戏中第二章的核心人物，身份保密是本段剧情的关键悬念。",
    quote: "此去延安，千里迢迢——有你们护送，我心里踏实。",
    teaserText: "一位将在寒夜中与你同行的重要人物。护送任务完成后解锁。",
    hidden: false,
    unlocked: false
  },
  {
    id: "tong-qiulong",
    name: "佟秋龙",
    title: "运河支队排长",
    role: "基层骨干",
    historicalLabel: "真实人物",
    recordType: "个人档案",
    faction: "运河支队",
    chapters: "第一章 · 第二章 · 第三章",
    accent: "#8a6f3a",
    fallbackBg: "linear-gradient(135deg, #8a6f3a 0%, #2a2416 100%)",
    fallbackText: "秋龙",
    chop: "勇",
    backChop: "佟",
    avatar: "./assets/characters/stills/lao-ban-zhang.jpg",
    memoryLine: "俺们当兵的，不图别的，就图老百姓能睡个安稳觉。",
    bio: "运河支队的基层指挥员，从战士一步步成长起来的排长。作战勇敢、带兵有方，在战士中威信很高。他是那种“冲锋在前、撤退在后”的基层军官典型，多次在关键战斗中发挥重要作用。",
    relationship: "陈水生的排长，在训练和战斗中手把手教水生军事技能。他的朴实与坚毅，让水生看到“当兵的意义”。",
    storyLine: "真实历史人物。综合了多位运河支队基层指挥员的事迹，用来承载“兵头将尾”这条线索。",
    quote: "当兵不怕死，就怕死得不值——咱得活着看到胜利那天。",
    teaserText: null,
    hidden: false,
    unlocked: true
  },
  {
    id: "zhu-xiaochun",
    name: "朱孝春",
    title: "运河支队爆破班长",
    role: "攻坚主力",
    historicalLabel: "真实人物 / 爆破英雄",
    recordType: "特殊档案",
    faction: "爆破队",
    chapters: "第三章（炸桥行动）",
    accent: "#8b6914",
    fallbackBg: "linear-gradient(135deg, #8b6914 0%, #4a3008 100%)",
    fallbackText: "孝春",
    chop: "爆",
    backChop: "春",
    avatar: "./assets/characters/stills/zhu-xiaochun.jpg",
    memoryLine: "桥可以炸，但人心不能散。",
    bio: "运河支队爆破班长，在炸毁韩庄运河铁路大桥的行动中担任爆破队核心成员。他精通爆破技术，胆大心细，多次在极端危险的环境下完成爆破任务。1945年的韩庄炸桥行动中，他冒着敌军火力成功安放炸药，为切断敌军北援通道立下关键战功。",
    relationship: "陈水生在第三章的爆破行动搭档。如果玩家选择加入爆破队，朱孝春将亲自指导水生如何安放炸药、如何在引爆前确认所有战友撤离。",
    storyLine: "真实历史人物。游戏中第三章的核心人物之一，其爆破专业知识和战斗经历依据史料改编。",
    quote: "炸桥不是为了破坏——是为了让更多通向和平的桥，重新立起来。",
    teaserText: "一位爆破高手，将在炸桥行动中成为你的生死搭档。完成寒夜护送后解锁。",
    hidden: false,
    unlocked: false
  },
  {
    id: "hu-dalun",
    name: "胡大伦",
    title: "运河支队排长 / 阻击指挥",
    role: "阻击骨干",
    historicalLabel: "真实人物 / 阻击英雄",
    recordType: "特殊档案",
    faction: "阻击组",
    chapters: "第三章（炸桥行动）",
    accent: "#c4631e",
    fallbackBg: "linear-gradient(135deg, #c4631e 0%, #6b2a08 100%)",
    fallbackText: "大伦",
    chop: "阻",
    backChop: "伦",
    avatar: "./assets/characters/stills/hu-dalun.jpg",
    memoryLine: "掩护战友，就是把后背交给信念。",
    bio: "运河支队排长，在炸毁韩庄运河铁路大桥的行动中担任阻击任务，率部在桥头阵地阻击敌军增援，为爆破队争取了关键的作业时间。他的阻击组以少打多，寸步不退，是炸桥行动成功的保障。",
    relationship: "陈水生在第三章的阻击行动指挥。如果玩家选择加入阻击组，胡大伦将带领水生在前线阻击敌军，体验“掩护战友”的沉重与光荣。",
    storyLine: "真实历史人物。游戏中与朱孝春形成“爆破—阻击”双线选择，让玩家从不同角度体验同一场行动。",
    quote: "我们在这儿多守一分钟，桥那边的战友就多一分安全——这就是阻击的意义。",
    teaserText: "一位阻击英雄，将在炸桥行动中与你并肩作战。完成寒夜护送后解锁。",
    hidden: false,
    unlocked: false
  }
];

const timelineData = [
  {
    id: "beacon-fire",
    time: "1938",
    title: "运河燃烽火",
    tag: "序幕",
    mapLocation: "徐州——运河沿线",
    routeIndex: "01",
    coordinate: "苏鲁交界",
    accent: "#d4943a",
    oneLiner: "徐州会战后，日军控制主要城镇和交通线。运河两岸，另一种抵抗正在生根。",
    historicalFacts: "1938年徐州会战后，日军控制主要城镇和交通线，国民党主力转移。中国共产党领导的敌后武装在运河两岸坚持抗战，建立根据地，发动群众，开展游击战争。运河不仅是地理屏障，更是连接华中与华北抗日根据地的重要通道。",
    gameAdaptation: "游戏序章从1939年冬切入，通过陈水生的眼睛展示运河两岸的失序与破碎。黑白地图风格的过场画面中，交通线被红色标记切断——“为什么运河重要？”成为玩家进入故事的第一个理解锚点。",
    playerEcho: "你于1939年冬站在周营镇外。运河水很冷，但你第一次听说了运河支队。",
    archiveForm: "战局地图 / 历史背景 / 年代记",
    sourceNote: "本档案参考《运河支队战史》《八路军山东纵队史》等史料编撰。",
    unlockCondition: "初始解锁"
  },
  {
    id: "zhouying-assembly",
    time: "1940.01.01",
    title: "周营誓师 · 运河支队成立",
    tag: "建队",
    mapLocation: "周营镇",
    routeIndex: "02",
    coordinate: "山东峄县",
    accent: "#c43d2e",
    oneLiner: "一面旗帜，一千五百人，一条运河——1940年元旦，运河支队正式成立。",
    historicalFacts: "1940年1月1日，运河支队在周营镇正式成立。孙伯龙任支队长，朱道南任政委，邵剑秋任副支队长，胡大勋任参谋长，队伍约1500人。支队以京杭大运河为依托，在苏鲁交界地带开展游击战争，成为连接华中与华北抗日根据地的重要武装力量。",
    gameAdaptation: "游戏序章结尾即“加入运河支队”决策点。玩家无论选择哪条路径加入，都会在第一章开头看到周营集结的过场画面：成立令、队伍集结式场景、人物关系图的第一次展开。",
    playerEcho: "你于1939年冬加入运河支队。\n那一天，你在周营镇外的枣树林前，第一次听见“运河支队”的名字。",
    archiveForm: "成立令 / 队伍编制图 / 人物关系",
    sourceNote: "本档案参考《运河支队史稿》及周营镇地方志编撰。",
    unlockCondition: "完成序章后解锁"
  },
  {
    id: "first-battle-duzhuang",
    time: "1940",
    title: "初战杜庄 · 血火淬炼",
    tag: "首战",
    mapLocation: "杜庄",
    routeIndex: "03",
    coordinate: "运河东岸",
    accent: "#b87333",
    oneLiner: "支队成立后的第一次实战。守阵地、护百姓、克服恐惧——每个人的初战，都是一场内心的战斗。",
    historicalFacts: "杜庄战斗是运河支队成立后不久迎来的实战考验。支队依托村庄地形组织防御，在敌我力量悬殊的情况下，成功阻击日军进攻，掩护群众转移。这一战初步检验了支队的战斗力，也奠定了“依托群众、灵活作战”的战术风格。",
    gameAdaptation: "游戏第一章即杜庄战斗。玩家在此面对三个选择：守正面、转移村民、畏缩。每条选择对应不同的档案记录——选择守正面标记“正面阻击”；选择转移村民标记“护民行动”；选择退缩标记“未完成的勇气”。战斗简报在档案中以手写战报形式呈现。",
    playerEcho: "根据你在第一章的实际选择：\n你选择了正面阻击 / 护民转移 / 临阵退缩。\n这一仗教会了你——勇气不是不怕，是怕了之后还敢站上去。",
    archiveForm: "手写战报 / 分支记录 / 个人标记",
    sourceNote: "本档案参考《运河支队战斗纪实》及地方抗战史料编撰。",
    unlockCondition: "完成第一章后解锁"
  },
  {
    id: "cold-night-escort",
    time: "1943.12",
    title: "寒夜护送 · 秘密渡河",
    tag: "护送",
    mapLocation: "北许阳 → 杜安集 → 德胜庄",
    routeIndex: "04",
    coordinate: "陇海线北",
    accent: "#4a6fa5",
    oneLiner: "一位“张处长”要过运河。没人知道他的真名，但所有人都知道——他必须安全到达对岸。",
    historicalFacts: "1943年12月，陈毅乔装为“张处长”，在运河支队等护送下，经北许阳、杜安集、德胜庄附近涉水过运河，穿越陇海铁路日军封锁线，安全抵达下一站，继续前往延安参加整风学习和党的七大。这是一条用生命守护的秘密交通线。",
    gameAdaptation: "游戏第二章即寒夜护送。玩家在邵剑秋的安排下参与警戒与带路任务。前半段陈毅以“张处长”身份出现，对话中隐去真实身份；完成护送后解锁陈毅的完整档案与真实身份。档案打开前出现“此任务不得声张”的保密标记。",
    playerEcho: "根据你在第二章的选择：\n你选择放哨警戒 / 谨慎请示。\n那一夜，运河水很冷，但秘密交通线没有断。",
    archiveForm: "秘密路线图 / 伪装身份 / 夜渡场景 / 保密口令",
    sourceNote: "本档案参考陈毅年谱、运河支队护送史料及亲历者口述编撰。",
    unlockCondition: "完成第二章后解锁"
  },
  {
    id: "bridge-demolition",
    time: "1945.10.28",
    title: "韩庄炸桥 · 通向胜利",
    tag: "决战",
    mapLocation: "韩庄运河铁路大桥",
    routeIndex: "05",
    coordinate: "津浦线",
    accent: "#8b1a1a",
    oneLiner: "韩庄大桥必须炸掉——不是为了破坏，而是为了让更多通向未来的桥，重新立起来。",
    historicalFacts: "1945年10月28日前后，部队破袭津浦铁路柳泉至韩庄段，炸毁韩庄运河铁路大桥、公路大桥，以阻止国民党军沿铁路北犯，并迫使日伪军彻底投降。朱孝春、胡大伦等人在爆破任务中发挥了关键作用。",
    gameAdaptation: "游戏第三章即炸桥行动。玩家可以选择加入爆破队（跟随朱孝春）或阻击组（掩护爆破）。选择爆破则档案标记“正面攻坚”，选择阻击则标记“侧翼守护”。胜利后的档案结尾，把“炸桥”与“筑桥”两个意象连接起来，完成精神传承。",
    playerEcho: "根据你在第三章的选择：\n你选择加入爆破队 / 阻击组。\n桥断了，但通向胜利的路通了——炸桥，是为了筑桥。",
    archiveForm: "爆破任务图 / 桥梁结构 / 行动记录",
    sourceNote: "本档案参考《津浦路破袭战史料汇编》及亲历者口述编撰。",
    unlockCondition: "完成第三章后解锁"
  }
];

const qaDatabase = [
  { keywords: ["运河支队", "成立", "什么时候", "周营"], question: "运河支队是什么时候成立的？", answer: "游戏采用的主线节点是 1940 年 1 月 1 日周营镇建队。页面中的陈水生视角属于剧情化改编，用来帮助玩家进入历史。" },
  { keywords: ["陈毅", "护送", "张处长", "秘密交通线"], question: "护送陈毅的任务是怎样的？", answer: "陈毅以秘密身份通过运河沿线，支队负责沿途警戒、带路和护送。游戏把这段历史设计为寒夜渡河、秘密身份和保密抉择。" },
  { keywords: ["炸桥", "韩庄", "爆破"], question: "炸桥行动发生了什么？", answer: "炸桥行动是胜利前夜的关键任务。游戏中玩家可以选择加入爆破队，也可以选择掩护爆破，从不同角度体验同一场行动。" },
  { keywords: ["陈水生", "主角", "虚构"], question: "陈水生是真实人物吗？", answer: "陈水生是虚构主角，用来承载玩家视角。他的经历综合了运河两岸普通少年、百姓与支队战士的情感线。" }
];

const synonymMap = {
  "啥": "什么",
  "咋": "怎么",
  "咋样": "怎么样",
  "鬼子": "日军"
};

const fallbackAnswers = [
  "这个问题可以从历史档案库继续看。你也可以问我运河支队成立、护送陈毅、韩庄炸桥等关键事件。",
  "我目前掌握的信息有限，但这条线索很适合放进后续史料扩展模块。",
  "可以换个问法试试，比如“陈水生是谁”“护送陈毅发生了什么”。"
];

const VIDEO_BASE = (typeof DEPLOY_CONFIG !== "undefined" && DEPLOY_CONFIG.videoBase) || "/videos/";

const gameNodes = {
  prologue_start: {
    video: "序章/开头+序章（字幕版）.mp4",
    nextDecision: "dp1_prologue"
  },
  prologue_choice_a: {
    video: "序章/序章选项A（字幕版）.mp4",
    nextNode: "chapter1"
  },
  prologue_choice_b: {
    video: "序章/序章选项B（字幕版）.mp4",
    nextNode: "chapter1"
  },
  prologue_choice_c: {
    video: "序章/序章选项C（字幕版）.mp4",
    nextNode: "chapter1"
  },
  chapter1: {
    video: "第一章/第一章（字幕版）.mp4",
    nextDecision: "dp2_chapter1"
  },
  ch1_choice_a: {
    video: "第一章/第一章选项A（字幕版）.mp4",
    nextNode: "ch1_ab_end"
  },
  ch1_choice_b: {
    video: "第一章/第一章选项B（字幕版）.mp4",
    nextNode: "ch1_ab_end"
  },
  ch1_ab_end: {
    video: "第一章/第一章选项AB结局（字幕版）.mp4",
    nextNode: "chapter2"
  },
  ch1_choice_c: {
    video: "第一章/第一章选项C（字幕版）.mp4",
    nextDecision: "dp3_chapter1"
  },
  ch1_c_end1: {
    video: "第一章/第一章选项C结局走向1（字幕版）.mp4",
    nextNode: "chapter2"
  },
  ch1_c_end2: {
    video: "第一章/第一章选项C结局走向2（字幕版）.mp4",
    ending: "bad1"
  },
  chapter2: {
    video: "第二章/第二章开头.mp4",
    nextDecision: "dp4_chapter2"
  },
  ch2_choice_a: {
    video: "第二章/第二章节点1选项B.mp4",
    nextNode: "ch2_node2"
  },
  ch2_choice_b: {
    video: "第二章/第二章节点1选项A.mp4",
    nextNode: "ch2_node2"
  },
  ch2_node2: {
    video: "第二章/第二章节点2.mp4",
    nextDecision: "dp5_chapter2"
  },
  ch2_dp5_choice_a: {
    video: "第二章/第二章节点2选项A.mp4",
    nextNode: "chapter3"
  },
  ch2_dp5_choice_b: {
    video: "第二章/第二章节点2选项B.mp4",
    nextNode: "chapter3"
  },
  ch2_dp5_choice_c: {
    video: "第二章/第二章节点2选项C.mp4",
    ending: "bad2"
  },
  chapter3: {
    video: "第三章/第三章开头.mp4",
    nextDecision: "dp6_chapter3"
  },
  ch3_choice_a: {
    video: "第三章/第三幕1-1.mp4",
    nextNode: "victory"
  },
  ch3_choice_b: {
    video: "第三章/第三幕2-1.mp4",
    nextNode: "victory"
  },
  ch3_choice_c: {
    video: "第三章/第三幕3-1.mp4",
    nextNode: "bad_leadin"
  },
  bad_leadin: {
    video: "第三章/失败-1.mp4",
    ending: "bad3"
  },
  victory: {
    video: "第三章/胜利-1.mp4",
    nextDecision: "dp7_chapter3"
  },
  dp7_choice_a: {
    video: "第三章/返乡1-1.mp4",
    nextNode: "parade"
  },
  dp7_choice_b: {
    video: "第三章/返乡2-1.mp4",
    nextNode: "parade"
  },
  parade: {
    video: "第三章/阅兵-1.mp4",
    ending: "good"
  }
};

const decisionPoints = {
  dp1_prologue: {
    title: "要不要加入运河支队？",
    description: "战火烧到运河边。你叫陈水生，站在周营镇外的枣树林前，第一次听见“运河支队”的名字。",
    choices: [
      { text: "我要报仇！日军烧了我家！", subtext: "坚定参军", goto: "prologue_choice_a" },
      { text: "我怕…家里只剩奶奶了", subtext: "犹豫退缩", goto: "prologue_choice_b" },
      { text: "能给吃的吗？我快饿晕了", subtext: "务实参军", goto: "prologue_choice_c" }
    ]
  },
  dp2_chapter1: {
    title: "你选择？",
    description: "杜庄方向枪声响起。孙队长正在组织防线，村民也需要转移。",
    choices: [
      { text: "孙队长，我跟您守正面！", subtext: "主动跟随指挥", goto: "ch1_choice_a" },
      { text: "队长，我去帮村民转移！", subtext: "守护百姓", goto: "ch1_choice_b" },
      { text: "我…我有点怕，想躲在后面", subtext: "临阵胆怯", goto: "ch1_choice_c" }
    ]
  },
  dp3_chapter1: {
    title: "你会选择？",
    description: "你刚刚退缩过一次。胡大勋把水壶递给你，等你自己决定要不要站起来。",
    choices: [
      { text: "克服恐惧，留下来", subtext: "把发抖的手重新握紧", goto: "ch1_c_end1" },
      { text: "仍选择退缩", subtext: "先把自己藏进夜色里", goto: "ch1_c_end2" }
    ]
  },
  dp4_chapter2: {
    title: "你选择？",
    description: "“张处长”的真实身份不能声张。邵剑秋让你协助警戒。",
    choices: [
      { text: "军长，我去村口放哨！", subtext: "主动担当", goto: "ch2_choice_a" },
      { text: "我…我怕认错人走漏信", subtext: "谨慎请示", goto: "ch2_choice_b" }
    ]
  },
  dp5_chapter2: {
    title: "夜渡时刻，你选择：",
    description: "韩庄方向探照灯扫过水面，队伍必须趁夜过河。",
    choices: [
      { text: "我熟悉水路，在前头带路！", subtext: "勇挑重担", goto: "ch2_dp5_choice_a" },
      { text: "我跟在队伍中间，不添乱。", subtext: "稳妥前进", goto: "ch2_dp5_choice_b" },
      { text: "风太大，我走不动了……", subtext: "停在冰冷的河岸边", goto: "ch2_dp5_choice_c" }
    ]
  },
  dp6_chapter3: {
    title: "炸桥行动，你选择？",
    description: "韩庄桥是敌人北上增援的重要通道。爆破队和阻击组都需要人。",
    choices: [
      { text: "我去爆破队！跟着朱班长！", subtext: "正面攻坚", goto: "ch3_choice_a" },
      { text: "我去阻击组！掩护爆破！", subtext: "侧翼守护", goto: "ch3_choice_b" },
      { text: "炸药太危险…我不敢去", subtext: "退到硝烟照不到的地方", goto: "ch3_choice_c" }
    ]
  },
  dp7_chapter3: {
    title: "胜利之后，你选择？",
    description: "抗战胜利了。运河两岸重新有了炊烟，你也站在新的人生路口。",
    choices: [
      { text: "返乡，过普通人的日子", subtext: "把故事带回故乡", goto: "dp7_choice_a" },
      { text: "留下，参与运河沿岸重建", subtext: "从战士走向建设者", goto: "dp7_choice_b" }
    ]
  }
};

const endings = {
  bad1: { type: "bad", title: "怯懦的逃兵", description: "你离开了队伍。运河仍在流淌，但你错过了守护它的那一刻。", badge: "退" },
  bad2: { type: "bad", title: "半途的弃卒", description: "寒夜里，你停在了河岸。队伍继续前行，而你被留在未完成的任务旁。", badge: "弃" },
  bad3: { type: "bad", title: "可耻的逃兵", description: "面对炸桥任务，你选择逃避。爆炸声终会响起，但那里面没有你的勇气。", badge: "愧" },
  good: { type: "good", title: "运河支队老兵", description: "你跟随运河支队走过战火，也走向胜利。多年以后，你站在抗战胜利纪念现场，看见自己守护过的山河。", badge: "勋" }
};
