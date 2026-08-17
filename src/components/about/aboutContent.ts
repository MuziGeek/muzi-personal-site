export interface AboutSection {
  id: 'identity' | 'making' | 'method';
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
  artSrc: string;
  artAlt: string;
  dialogIntro: string;
  dialogBody: string[];
  highlights: string[];
  primaryHref: string;
  primaryLabel: string;
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: 'identity',
    number: '01',
    eyebrow: 'HELLO / 个人档案',
    title: '我是谁',
    summary: '一个喜欢做些东西，也喜欢把过程记录下来的人。',
    meta: '作品 · 笔记 · 思考',
    artSrc: '/images/about/about-identity.webp',
    artAlt: '木子与蓝眼小猫坐在矮桌旁阅读、整理卡片和笔记。',
    dialogIntro: '我是 Muzi。这里不按传统履历展开，而是让作品、公开实践和持续记录自己说话。',
    dialogBody: [
      '这个网站收集我做过的产品、公开的 Skills、收藏与笔记。它们被分开放置，让每一种内容保持真实边界。',
      '比起先给出一串标签，我更希望你先看到具体结果，再从过程里理解我关注什么、如何思考。',
    ],
    highlights: ['作品先于履历', '真实证据先于包装', '过程值得被记录'],
    primaryHref: '/works/',
    primaryLabel: '先看作品',
  },
  {
    id: 'making',
    number: '02',
    eyebrow: 'MAKING / 当前实践',
    title: '正在做',
    summary: '把想法做成真实产品，也把创作方法整理成可复用的工具。',
    meta: '产品 · Skills · 开源',
    artSrc: '/images/about/about-making.webp',
    artAlt: '木子在画板上整理产品界面和工具卡片，蓝眼小猫递来一枚图形卡。',
    dialogIntro: '当前公开内容分为真实产品与开源实践，两者各自保留清楚的入口和证据。',
    dialogBody: [
      'Works 里放着可以直接访问的产品；Open Source 里整理公开仓库与 Skills。现在公开展示的真实产品是木南图库。',
      'MZ Icon Design、MZ Crayon Illustrations 与 MZ Minimal Zine Reconstruction 则记录了可以复用的视觉方法。',
    ],
    highlights: ['木南图库', '公开 Skills', '持续整理方法'],
    primaryHref: '/open-source/',
    primaryLabel: '查看 Open Source',
  },
  {
    id: 'method',
    number: '03',
    eyebrow: 'METHOD / 工作方式',
    title: '工作方式',
    summary: '先做出真实结果，再把过程整理成可以复用的系统。',
    meta: '观察 · 构建 · 验证',
    artSrc: '/images/about/about-method.webp',
    artAlt: '木子和蓝眼小猫依次摆放观察、构建、验证与记录四张图形卡。',
    dialogIntro: '我的工作方式从观察开始，以可验证的结果结束，再把有价值的过程留下来。',
    dialogBody: [
      '先分清问题和内容边界，再构建最小但真实的结果。动效、包装和表达都服务于理解，不代替证据。',
      '验证通过后，再把判断、步骤与可复用部分整理成文档、工具或 Skill，让下一次创作可以从更好的位置开始。',
    ],
    highlights: ['观察与收集', '构建真实结果', '验证并记录'],
    primaryHref: '/#top',
    primaryLabel: '回到首页',
  },
];
