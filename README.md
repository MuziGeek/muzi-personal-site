# Muzi Personal Site

Muzi 的个人作品、开源实践、收藏、笔记与想法空间。项目使用 Astro 构建为静态网站，内容通过 Markdown 维护。

## 本地运行

```sh
npm install
npm run dev
```

使用 `npm run check` 检查类型，使用 `npm run build` 生成静态文件。

中国大陆部署、ICP备案、EdgeOne Pages、域名与上线检查请参阅
[腾讯云 EdgeOne Pages 部署指南](docs/deployment/tencent-edgeone-pages-cn.md)。

## 内容管理

- 在 `src/content/works/` 添加可以直接访问和使用的真实产品。
- 在 `src/content/open-source/` 添加公开 GitHub 项目与 Skills。
- 在 `src/content/bookmarks/` 添加经过确认可公开的收藏链接。
- 在 `src/content/notes/` 添加日常、学习与思考笔记，并用标签区分类型。
- 内容默认是草稿；只有 frontmatter 中 `draft: false` 的条目会出现在网站中。

About 页面使用项目内的频凡糊涂体 WOFF2 子集。该字体文件仅用于当前个人网站，
其来源与再使用限制记录在 `public/fonts/README.md`。
