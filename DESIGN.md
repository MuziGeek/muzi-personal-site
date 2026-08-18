---
name: "Muzi Personal Site"
description: "温暖克制的个人档案，分别呈现真实作品、开源实践、收藏与笔记。"
colors:
  paper-primary: "#f6f1e7"
  paper-secondary: "#efe7d8"
  paper-light: "#faf7f0"
  ink-primary: "#2b2926"
  ink-muted: "#6f6a62"
  ink-subtle: "#8b867e"
  accent-brown: "#b89068"
  accent-rust: "#8a6243"
  works-ink-soft: "#57534d"
typography:
  display-site:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(3rem, 7vw, 6.1rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  display-works:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(3.8rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline-section:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(2.5rem, 5vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.1
  headline-project:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(2.2rem, 3.7vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline-project-stacked:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(2.35rem, 11vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title-list:
    fontFamily: '"MuziDisplay", "STKaiti", "KaiTi", serif'
    fontSize: "clamp(1.55rem, 3vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  article-title:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(2.5rem, 5vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  article-section:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(1.55rem, 3vw, 2.2rem)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  article-subsection:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body-intro:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(1rem, 1.35vw, 1.12rem)"
    fontWeight: 400
    lineHeight: 1.9
  body-project:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "clamp(0.95rem, 1.25vw, 1.04rem)"
    fontWeight: 400
    lineHeight: 1.8
  label-spaced:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.08em"
  action:
    fontFamily: '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.7
rounded:
  works-card: "1rem"
spacing:
  page-gutter: "clamp(1.25rem, 4vw, 4rem)"
  works-gap: "clamp(2rem, 5vw, 4.5rem)"
  works-content-padding: "clamp(2rem, 4vw, 3.5rem)"
  works-content-padding-stacked: "clamp(1.7rem, 7vw, 2.7rem)"
components:
  site-index:
    backgroundColor: "{colors.paper-primary}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    padding: "0.5rem 0"
    width: "10rem"
  archive-cue:
    textColor: "{colors.works-ink-soft}"
    typography: "{typography.label-spaced}"
    padding: "0.25rem 0"
  works-card:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.works-card}"
  works-card-content:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body-project}"
    padding: "{spacing.works-content-padding}"
  skill-card:
    backgroundColor: "#faf8f2"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.works-card}"
  bookmark-card:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.works-card}"
  poster-munan:
    backgroundColor: "#f1eadc"
  poster-icons:
    backgroundColor: "{colors.paper-secondary}"
  poster-crayon:
    backgroundColor: "#f0eadf"
  poster-zine:
    backgroundColor: "#d9d3c8"
  text-link-primary:
    backgroundColor: "{colors.accent-brown}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.action}"
    padding: "0.55rem 0.8rem"
---

# Design System: Muzi Personal Site

## Overview

**Creative North Star: "温暖的创作档案 / The Warm Working Archive"**

Muzi 的视觉世界像一册安静、仍在生长的个人档案：暖纸面承载内容，手写感展示字体保留人的痕迹，温墨、细线与留白让真实项目和个人判断成为主角。它克制、温和，静止时保持平面秩序，交互时才让作品页产生轻微空间回应，不以界面装饰替代内容证据。

Works 只呈现可以直接访问的真实产品；Open Source 把公开 Skills 与普通开源项目分开：Skills 使用木子与小猫的能力场景插画，普通开源项目仍使用真实成果预览。Bookmarks 使用更轻的链接卡片，Notes 维持按时间阅读的文字列表。Muzi Workbench 在没有公开地址时保持草稿并隐藏。

**Key Characteristics:**

- 暖纸表面、温墨正文与稀少的暖棕强调。
- 手写感标题搭配可靠的中文无衬线正文回退。
- Works 使用单个重点项目入口；Open Source 的 Skills 使用两列插画卡，普通开源项目使用大尺寸项目卡。
- Bookmarks 使用不含远程图片的简单链接卡片，Notes 使用时间流与语义标签。
- 静止平面优先；项目卡以可操作的真实预览表达产品，Skill 卡以透明插画、轮廓阴影和克制的滚动 roll 表达空间层级。
- 动态海报只增强真实证据，核心文字始终默认可读。

## Colors

色彩由三层暖纸、三层温墨与两枚克制棕色组成；Works 另有一枚柔墨用于翻阅提示。frontmatter 中的颜色值是规范来源，项目海报自身的色彩只属于各自真实图像与局部舞台。

### Primary

- **暖棕（accent-brown）：** 全站焦点轮廓、主要文本链接底色与 Index 菜单 hover/focus 的唯一主要强调。

### Secondary

- **深锈（accent-rust）：** 普通文本链接 hover 的次级强调，不扩展成大面积品牌色块。

### Neutral

- **主纸色（paper-primary）：** 页面与顶栏的基础纸面。
- **层叠纸色（paper-secondary）：** Works 海报区域与内容纸面之间的分层底色。
- **浅纸面（paper-light）：** 项目卡表面与文字区域。
- **温墨（ink-primary）：** 标题、正文、链接与规则线的基准颜色。
- **褪墨（ink-muted）：** 摘要、辅助说明与低优先级正文。
- **铅灰（ink-subtle）：** 更弱的全站辅助信息。
- **柔墨（works-ink-soft）：** Works 翻阅提示的专用中间层级。

**The Warm Paper Rule.** 大面积区域只使用纸色与温墨；暖棕和深锈保持稀少，只标记动作与焦点。

## Typography

**Display Font:** MuziDisplay（项目内嵌 PFanHuTuTi WOFF2 字符子集；回退到本机 PFanHuTuTi、STKaiti、KaiTi、serif）

**Body Font:** Noto Sans CJK SC（回退到 Source Han Sans SC、Microsoft YaHei、sans-serif）

**Character:** 展示字体负责松弛的手写感和个人气质，正文栈负责清楚、稳定的中文阅读。当前字号阶梯以 frontmatter 为准，不额外引入新的中间等级。

### Hierarchy

- **Site Display**（400，`display-site`，1.08）：首页、列表页与 About 的主标题。
- **Works Display**（400，`display-works`，0.98）：Works 首屏标题；窄屏使用 `clamp(3.65rem, 16vw, 5.8rem)` 保持视觉重量。
- **Section Headline**（400，`headline-section`，1.1）：全站章节标题。
- **Project Headline**（400，`headline-project`，1.04）：项目卡标题；47.99rem 及以下使用 `clamp(2.35rem, 11vw, 3.4rem)`。
- **List Title**（400，`title-list`，1.2）：Works 之外的内容列表标题。
- **Body**（400，`body`，1.7）：全站基础正文与导航。
- **Article Title**（700，`article-title`，1.15）：文章主标题，使用正文无衬线字体而非展示字体。
- **Article Section**（700，`article-section`，1.35）：文章二级标题，沿用无衬线阅读体系。
- **Article Subsection**（700，`article-subsection`，1.35）：文章三级标题，沿用无衬线阅读体系。
- **Intro Body**（400，`body-intro`，1.9）：Works 开场承诺，保持更舒展的行距。
- **Project Body**（400，`body-project`，1.8）：每张卡唯一的一句话摘要，最大宽度 22rem。
- **Spaced Label**（400，`label-spaced`，0.08em）：翻阅提示等稀疏引导。
- **Action**（700，`action`，1.7）：项目入口与主要文本动作。

**The Display Restraint Rule.** 展示字体只承担名称、章节与项目标题；连续文字使用正文栈。内嵌文件只保留当前公开页面所需字符，由 `scripts/subset-display-font.py` 从站点所有者确认的本机字体源生成，不打包完整 TTF。

## Layout

全站页面容器最大宽度为 78rem；Works 与 Open Source 项目序列单独收窄到约 48rem。Skill 网格同样收窄到 48rem，桌面双列、移动端单列。项目卡之间使用克制的纵向间距，让卡片形成接近作品目录的连续节奏。

桌面项目卡是接近 `48rem × 300px` 的左右交替双栏：预览舞台约 `356 × 200px`，文字列约 310px，卡片内边距为 `22px 26px`、列间距 36px。奇数卡舞台在左，偶数卡舞台在右。55.99rem 及以下统一改为自然单列，舞台在上、文字在下；舞台固定为 16:10，关闭桌面 roll 与越界悬浮。

**The One-Card-One-Project Rule.** 每张项目卡只呈现真实预览、标题、一句话和访问入口；不加入状态、角色、技术栈、日期、统计或仓库元数据。Skill 卡只呈现标题、短动作词、构建时获取且带缓存回退的 GitHub Stars、木子与小猫的无字能力场景和仓库入口。Bookmark 卡片只呈现域名、标题、可选简介与打开链接入口。

## Elevation & Depth

系统在静止时完全平面：卡片只靠浅纸面与 1px 规则线建立边界，没有常驻容器阴影。项目卡的外层 hitbox 在 `900px` 透视中随视口从 `rotateX -14° / translateY +6px / opacity .90` 经过中心静止态到 `rotateX +14° / translateY -6px / opacity .90`；卡片、首次揭示和滚动 roll 分属三个 DOM 层，不共享 transform。悬停只让卡片统一上移 5px，不再响应指针方向倾斜；真实预览自身承担主要交互。Skill 卡继续使用更克制的透明插画 roll 规则。触屏、粗指针与 reduced-motion 保持平面静态结果。

### Shadow Vocabulary

- **项目卡交互阴影：** 仅用于整卡 hover/focus，并且必须与透明边框和轻抬同时出现；它不是静态容器或海报内部的装饰阴影。
- **Skill 插画轮廓阴影：** 只作用于透明插画 alpha 轮廓；默认 `0 12px 18px rgba(0,0,0,.10)`，悬停增强为 `0 24px 28px rgba(0,0,0,.16)`，不得退化为矩形图片阴影。

**The Border-to-Lift Rule.** 卡片静止时用边线，交互时用轻抬；阴影只能在边线已经转透明的状态出现。

## Shapes

项目卡与 Skill 卡使用一致的 1rem 圆角和 1px 边框。桌面精细指针可以让项目卡产生极轻的有界倾斜，但不得扭曲内容或改变矩形轮廓。Skill 插画可以包含纸张、画板和档案道具，但卡片界面本身保持完整矩形，不复制 Oil 的人物、宠物、文字或品牌构图。

**The Honest Rectangle Rule.** 主界面只保留完整矩形、细线与统一圆角；真实项目图像可以有自身构图，但界面不再为它增加假窗口或拼贴几何。

## Components

### Site Navigation

- **Style:** 4.5rem 高的暖纸顶栏，以 1px 底线连接 Muzi wordmark 与 Index 触发器；首页复用同一顶栏并以透明覆盖层悬浮在滚动叙事上方，不绘制会穿过人物形象的顶部分隔线。
- **Index Trigger:** `Index` 使用 700 字重并与自绘加号组成至少 44px 高的触发器；hover、focus 与展开状态共享从左向右延伸的暖棕底线，展开时加号旋转为关闭符号。首页顶部不再单独显示 Works、Notes、About 链接。
- **Paper Directory:** 目录面板宽约 `18–21rem`，使用浅纸面、1px 规则线、1rem 圆角与克制双层阴影；六个页面以 `01–06 / 页面名 / 方向箭头` 排列，当前页面使用 `aria-current="page"` 与常驻黄色标题标记。
- **Motion:** 面板在约 260ms 内由轻微上移和缩小恢复，目录行以约 35ms 间隔进入；hover/focus 时标题黄色标记延伸、箭头右移。粗指针关闭横向位移，`prefers-reduced-motion` 直接呈现最终状态。
- **Behavior:** 使用原生按钮 disclosure；支持 Enter、Space、Escape、外部点击与关闭后焦点恢复。面板不使用全屏遮罩、玻璃模糊、GSAP 或方向性 3D。
- **Homepage Return:** 首页使用原生滚动进度同步章节与媒体状态；普通站内返回从顶部开始，浏览器后退保留原章节。章节反馈不等待主视频就绪，页面从 BFCache 恢复或重新可见时重新同步并恢复循环媒体。

### Works Intro Cue

- **Style:** 柔墨小号扩字标签，只使用底边线与向下箭头，不做填充按钮。
- **State:** hover 时箭头下移 3px，过渡为 220ms；focus 沿用全站轮廓。

### Works 与 Open Source Showcase

- **Content:** Works 输出具备真实产品 URL 的 `draft: false` 条目；Open Source 按 `kind` 分流，`skill` 进入 Skill Showcase，`open-source` 进入项目 Showcase；Workbench 草稿不进入渲染结果。
- **Reveal:** 每组可见卡片首次进入视口时由 `opacity: 0` 与向下 24px 开始，在 0.8s 内以 0.11s 间隔揭示到静止位置；单卡不增加无意义延迟，也不使用遮罩揭示。
- **Activity:** 每张项目卡独立监听可见度；相交率达到 25% 的卡都可进入待机状态，指针、触摸或键盘只接管当前预览，不再由全局 `activeId` 竞争唯一活动卡。

### Public Project Card

- **Structure:** 外层 hitbox 负责滚动 roll，中层 reveal 只负责首次进入，内层 `<article>` 负责悬停与焦点；预览区可以包含拖动和键盘交互，标题和 CTA 是独立外链。
- **Desktop:** 约 `48rem × 300px` 的交替双栏，预览舞台约 `356 × 200px`，文字列约 310px。
- **Stacked:** 55.99rem 及以下固定海报在上、文字在下，海报为 16:10。
- **Scroll Roll:** 仅桌面精细指针启用。下方卡片从 `-14° / +6px / .90` 进入，居中回正，上方以 `+14° / -6px / .90` 离开；变换原点随位置从 4% 经过 50% 到 96%。
- **Hover / Focus:** 卡片统一上移 5px，使用 `0 3px 6px` 与 `0 26px 48px -18px` 的双层阴影；编号上移 6px，入口箭头向右上移动 2px，标题黄色标记在 600ms 内延伸到文字宽度与文字高度的 42%。

### Skill Card

- **Structure:** 整张 `<a>` 是 GitHub 外链；标题、短动作词、GitHub Stars 和箭头由 HTML 渲染，无字场景插画是装饰层，准确的 `previewAlt` 通过屏幕阅读器说明补充。
- **Layout:** 最大宽度 48rem，桌面两列，移动端单列；卡片比例约 1.1:1，标题区位于顶部，插画主体位于中下部。
- **Artwork:** 木子保持卷发、头顶墨镜、黑色棒球夹克与深色球鞋；小猫保持奶油色长毛、深色脸与蓝眼。每张图只表达对应能力，不嵌入文字、Logo、Stars 或水印。原始 WebP 作为可恢复来源保留，页面只映射由画布边缘连通背景生成的透明 `*-cutout.webp`；不得全局删除浅色，以免损坏猫咪毛发、白纸和高光。
- **Layering:** 卡面为 `#faf8f2`；聚光层 `z-index: 0` 并自行裁切圆角，插画层 `z-index: 3`，文字层 `z-index: 4`。桌面卡面允许插画溢出，移动端恢复裁切。插画容器从卡高约 32% 开始，图片宽 100%、高约 128%、底部约 -16%。
- **Hover / Focus:** 插画默认约 1° 轻斜并带轮廓阴影；精细指针 hover 或键盘 focus 时卡面上移 5px，插画回正、上移 8px、放大 1.05 倍，标题黄色标记从 0 延伸至文字宽度，箭头轻移。指针只控制聚光位置，不再产生方向性插画旋转；触屏和 reduced-motion 保持静态。
- **Scroll Roll:** 仅桌面精细指针启用。卡片以 `900px` 透视、`50% 96%` 原点随视口进度在 `+4.5° → 0° → -4.5°` 和 `+10px → 0 → -10px` 之间滚动；每卡独立创建与清理 ScrollTrigger。
- **Stars:** 只在 Astro 构建阶段读取 GitHub REST API；接口超时、限流或离线时使用仓库内快照，浏览器不再二次请求，数字 0 必须如实显示。

### Bookmark Card

- **Structure:** 整张 `<a>` 是外链与键盘入口，内部为域名、标题、可选简介和打开链接动作。
- **Layout:** 桌面双列、移动端单列；不抓取远程封面、截图或 favicon。
- **Hover / Focus:** 沿用项目卡的统一 1rem 圆角、4px 轻抬与克制阴影。

### About Chapter Card

- **Structure:** `/about/` 使用一张页首木子与小猫插画和三张个人章节按钮卡；章节固定为“我是谁”“正在做”“工作方式”，点击打开详情弹窗，不虚构履历或个人信息。
- **Desktop:** 卡片约 `696 × 232px`、20px 圆角、`24px 28px` 内边距。文字层位于左侧并保持 `z-index: 4`，透明插画位于右侧并可占据约 58% 卡宽，浅色编号位于底层。
- **Scroll Roll:** 复用项目卡的 `900px` 透视与 `-14° → 0° → +14°` 滚动 roll。悬停只让卡面上移 5px，插画右移 8px并放大 1.035，标题黄色标记延伸到文字宽度。
- **Dialog:** 弹窗具备固定模糊遮罩、独立滚动正文和固定操作栏；支持 Enter、Space、Escape、焦点圈定、背景 inert、滚动锁定与关闭后焦点恢复。
- **Mobile / Reduced Motion:** 移动端使用约 350 × 344px 纵向卡并关闭 roll；粗指针与 reduced-motion 关闭抬升、放大和滚动动画，卡片与弹窗仍保持完整语义和操作能力。

### About Contact Row

- **Structure:** About 三张个人章节卡之后使用六行扁平联系方式列表；每行整张 `<a>` 依次呈现图标、编号、平台、简短账号说明和箭头，不使用圆角大卡、统计、二维码或失效占位。
- **Desktop:** 列表与章节卡同为约 756px 宽；每行约 95px 高，使用 `36px / 28px / 186px / 1fr / 20px` 五列、16px 间距和细分隔线。平台名称使用无衬线粗体，编号与账号说明使用等宽字体。
- **Hover / Focus:** 精细指针 hover 或键盘 focus 时行内容右移约 18px，图标底色变黄并轻微旋转放大，平台名黄色标记延伸至文字宽度，账号说明加深，箭头从左侧滑入。
- **Mobile / Reduced Motion:** 47.99rem 以下改为四列两行结构，账号说明位于平台名下方；粗指针关闭位移和旋转，reduced-motion 关闭 reveal 与所有连续过渡，但保留清楚的即时焦点状态。

### Interactive Project Preview

- **木南图库：** 使用官方针织树苗精灵组成“发现灵感 → AI 创作 → 分享作品”三幕功能接力；角色和道具是对真实产品能力的品牌化解释，不伪装成操作界面，也不展示真实截图。
- **Artwork:** 三张角色资产保持奶油色针织树冠、绿色小叶、棕色身体、黑亮眼睛、粉色脸颊和胸前嫩芽。角色使用透明 WebP 独立分层，活动角色前移、上浮并放大，其他角色退后但继续留在舞台中。
- **Interaction:** 有效视口且页面可见时每 3.2s 前进一幕；鼠标横向位置、触摸拖动和左右方向键可以接管当前舞台，不显示标签或胶囊式进度控件。
- **Independent Activity:** 多张项目卡同时可见时各自保持待机，离开交互 600ms 后从当前位置恢复；失焦和取消操作必须可靠复位。
- **Fallback:** 任一舞台素材失败时显示官方搜索精灵静态图；项目标题、说明和外链始终独立可用，不再回退到真实首页截图。
- **Reduced Motion:** `prefers-reduced-motion: reduce` 停止自动播放和角色微动画，默认显示“发现”场景；触摸和键盘仍可即时切换静态状态。粗指针保留可见时自动循环和触摸接管，但不启用卡片 hover 抬升。

### Session Loading Expression

- **Purpose:** 每个浏览器会话首次进入时使用全屏暖纸遮罩承接首屏资源准备；它是真实加载反馈，不显示虚假百分比、进度条或可见 Loading 文案。
- **Artwork:** 使用八帧透明 Muzi Crayon 头像，顺序为平静、眨眼、好奇、侧视、轻微惊讶、微笑、挤眼吐舌与墨镜耍酷。变化集中在五官；除墨镜彩蛋帧外，头发、脸型、服装、裁切和主体位置必须稳定。
- **Motion:** 表情以精灵图直接跳切，不交叉淡化。切换时只允许 `scale(.985) → 1` 的 110ms 轻反馈，不做上下弹跳、旋转或弹性回弹；眨眼最短，微笑与墨镜帧稍长。
- **Lifecycle:** 首帧优先显示，精灵图解码后才开始循环；首页等待 intro 视频或静态海报可显示，其他页面等待普通加载完成。页面就绪后在完整循环边界退出，最长 4 秒必须释放遮罩。
- **Fallback:** 精灵图失败时保留静态首帧；`prefers-reduced-motion` 与 Save-Data 只显示静态首帧并在页面就绪后直接退出。页面隐藏时暂停计时，同一会话后续导航不得重复出现。

### Text Links

- **Primary:** 暖棕纸块、温墨文字、1px 边框与 `0.55rem 0.8rem` padding。
- **Plain:** 700 字重配 1px 底线；hover 转为深锈，active 下移 1px。

**The Truthful Preview Rule.** 项目预览可以使用真实界面、真实成果或官方品牌角色解释已经存在的产品能力；任何形式都不得虚构功能、伪装成交互证据或复制参考站品牌。停止后仍应能独立说明项目是什么。

## Do's and Don'ts

### Do:

- **Do** 使用暖纸、温墨、细线与充足留白维持“温暖的创作档案”。
- **Do** 让真实产品和公开源码各归其位，并保持整卡直接外链。
- **Do** 让收藏链接保持简单，只发布人工确认可公开的真实网址。
- **Do** 保留键盘焦点、触屏自然滚动和 reduced-motion 静态结果。
- **Do** 让每张达到可见阈值的项目卡独立进入待机，不以全局活动状态互相竞争。
- **Do** 让项目卡 hover/focus 的轻抬、透明边框与克制阴影作为一个完整状态出现；Skill 卡使用透明插画轮廓、桌面溢出和滚动 roll 建立真实分层。

### Don't:

- **Don't** 显示 Workbench 草稿或不可访问的占位卡；集合为空时使用真实“整理中”状态。
- **Don't** 在项目卡中加入状态、角色、技术栈、日期、统计、节点、窗口或其他元数据。
- **Don't** 使用夸张的游戏卡倾角、内容形变、移动端强制视差、遮罩、clip-path、撕裂接缝或假窗口外壳。
- **Don't** 为真实项目海报内部对象增加阴影；Skill 插画只允许使用跟随 alpha 轮廓的阴影，不允许出现矩形底图或矩形阴影。
- **Don't** 虚构项目数据、公开状态、经历、合作信息或失效链接。
- **Don't** 下载未知字体，或复制参考站的品牌、配色、字体、插画与具体构图。
