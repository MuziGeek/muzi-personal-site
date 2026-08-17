# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Muzi 的个人网站面向招聘与合作方、开发者同行和关注创作过程的访客。Works 让访客直接体验真实产品，Open Source 展示公开源码与 Skills，Bookmarks 与 Notes 分别承接兴趣来源和持续思考。

## Product Purpose

这是一个以 Muzi 为唯一公开名称的个人作品、开源实践、收藏、笔记与思考空间。网站首先展示真实作品，再延伸到 Open Source、Bookmarks、Notes 与 About；成功意味着访客能理解 Muzi 做过什么、关注什么、如何思考。

## Positioning

网站不是简历模板、仓库目录或书签导出页。不同内容各有边界，同时被放进同一个克制但可探索的个人叙事中。

## Operating Context

内容由本地 Astro Content Collections 与 Markdown 维护，发布为静态网站。真实产品、公开源码、收藏链接与笔记分别人工维护，不使用运行时 API。

## Capabilities and Constraints

- 使用 Astro、React 与现有 GSAP 实现，不增加后端、登录、数据库或 CMS。
- 主要文案为中文，导航使用 `Works / Notes / About`。
- Works 只展示可以直接访问和使用的真实产品；公开条目必须提供真实产品地址。
- Open Source 展示公开 GitHub 项目与 Skills，整张卡直接连接仓库。
- Bookmarks 只展示人工确认可公开的网址，使用简单链接卡片，不抓取封面、截图或 favicon。
- Notes 按发布日期倒序展示，用标签区分日常、学习与思考等类型。
- 每张卡只保留项目海报、名称、一句话与访问入口，不展示状态、角色、技术栈或易过时数据。
- “会呼吸的海报”必须来自真实界面或成果，只做低幅度循环，不虚构功能、数字、经历或合作信息。
- `draft: false` 才能发布内容；Muzi Workbench 在没有公开地址前保持隐藏，未提供真实收藏或文章时显示“整理中”。

## Brand Commitments

- 对外只使用 `Muzi`，不使用真实姓名。
- 保留暖纸色、深色文字、棕色强调、手写标题接口和细线分隔。
- 体验可以有明显交互，但整体保持简约、克制、温和手作感。
- 不复制参考站的品牌、配色、字体、插画或具体构图。

## Evidence on Hand

- 木南图库已有公开产品地址 `https://mn.easymuzi.cn/`，海报使用本地真实首页截图。
- `mz-icon-design`、`mz-crayon-illustrations`、`mz-minimal-zine-reconstruction` 已有公开 GitHub 地址，归入 Open Source。
- 当前没有经过确认的公开收藏链接，Bookmarks 使用真实空状态。
- `muzi-workbench` 暂无公开去向，内容文件保留为草稿，不在 Works 页面输出。

## Product Principles

1. 作品先于履历，真实证据先于包装。
2. 真实产品、公开源码、收藏与笔记不混放。
3. 一张项目卡只讲清一个项目，访问入口优先于元数据陈列。
4. 动效服务理解与探索，核心内容默认可读。
5. 桌面有空间感，移动端保持自然滚动与触屏可用性。
6. 无公开内容时明确说明，不使用虚构占位。

## Accessibility & Inclusion

所有项目与收藏入口可使用键盘访问；动态海报是装饰性增强。`prefers-reduced-motion` 下停止滚动揭示与循环动画，并保留完整文字与静态构图。
