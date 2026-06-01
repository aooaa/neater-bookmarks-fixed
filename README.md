# Neater Bookmarks Fixed

这是一个针对 Microsoft Edge / Chromium 浏览器整理和修复后的 Neater Bookmarks 扩展版本。项目主体位于 `neater-bookmarks-fixed/` 目录，已从 Manifest V2 迁移到 Manifest V3，保留了原扩展的书签树弹窗、搜索、拖拽排序、右键菜单、选项页、自定义样式和多语言资源。

## 项目情况

- 扩展名称：Neater Bookmarks Fixed
- 当前版本：0.9.7.2
- Manifest 版本：Manifest V3
- 最低 Chrome 版本：88
- 默认语言：英文，内置多语言 `_locales` 资源
- 主要入口：
  - `neater-bookmarks-fixed/manifest.json`
  - `neater-bookmarks-fixed/background.js`
  - `neater-bookmarks-fixed/popup.html`
  - `neater-bookmarks-fixed/options.html`
- 主要权限：书签、标签页、网页 favicon

## Manifest V3 迁移内容

- `manifest.json` 已改为 `manifest_version: 3`
- `browser_action` 已改为 `action`
- `background.scripts` 已改为 `background.service_worker`
- 后台脚本已移除对 DOM、后台页 `localStorage` 和 `chrome.extension.*` 的依赖
- `chrome.browserAction.*` 已改为 `chrome.action.*`
- `chrome.app.getDetails()` 已改为 `chrome.runtime.getManifest()`
- `chrome://favicon/` 已改为 Manifest V3 支持的 `_favicon` 资源 URL
- 已移除 `<all_urls>` 和 `chrome://favicon/` 旧权限写法，改用 `favicon` 权限

## 功能

- 以弹窗树形结构浏览浏览器书签
- 支持书签搜索和地址栏 omnibox 搜索
- 支持打开书签、文件夹批量打开、新窗口和隐身窗口打开
- 支持编辑、删除、拖拽移动书签和文件夹
- 支持弹窗宽度调整、缩放、自定义图标和自定义 CSS
- 保留多语言界面文案

## 安装到 Chrome / Edge

1. 打开扩展管理页面：Chrome 使用 `chrome://extensions/`，Edge 使用 `edge://extensions/`
2. 打开“开发人员模式”
3. 点击“加载解压缩的扩展”
4. 选择项目中的 `neater-bookmarks-fixed/` 目录
5. 固定扩展图标后即可从工具栏打开书签弹窗

## 验证情况

- `node --check neater-bookmarks-fixed/background.js`
- `node --check neater-bookmarks-fixed/neat.js`
- `node --check neater-bookmarks-fixed/options.js`
- 已扫描确认无 `browserAction`、`chrome.extension`、`chrome://favicon` 等旧 MV2 API 残留
- 已使用最新版 Chrome 的扩展打包器成功生成 MV3 `.crx`，说明 Manifest V3 结构可被 Chrome 接受

## 开发说明

本项目是静态浏览器扩展源码，不需要构建步骤。修改 JavaScript、HTML、CSS 或 `_locales` 资源后，在 Chrome 或 Edge 扩展管理页面点击扩展的“重新加载”即可测试。

本仓库忽略 `.edge-test-profile/`，该目录只用于本地浏览器测试配置，不应提交到版本库。

## 来源与许可

本项目基于 Neater Bookmarks / Neat Bookmarks 相关代码整理修复。原项目说明保留在 `neater-bookmarks-fixed/README.md`，许可信息见 `neater-bookmarks-fixed/license.txt`。
