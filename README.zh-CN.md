[English](./README.md) · **简体中文**

# 基于 Cloudflare + Hono + D1 的网页访客统计服务

## 部署步骤

### 安装依赖

```
npm install -g wrangler
npm install hono
```

### 登录

跳转 cloudflare 网页授权

```bash
npx wrangler login
```

### 创建 D1 数据库：[visit-track]

> 数据库名称为`visit-track`，与`package.json`内保持一致

```
npx wrangler d1 create visit-track
```

成功后显示：

```
✅ Successfully created DB visit-track

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "visit-track"
database_id = "<unique-ID-for-your-database>"
```

### 配置 worker 和 D1 数据库绑定

将上个步骤返回的`unique-ID-for-your-database`写进`wrangler.toml`中

```
name = "visit-track"
main = "src/index.ts"
compatibility_date = "2025-05-16"

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "visit-track"
database_id = "<unique-ID-for-your-database>"
```

### 初始化 D1 数据库的表结构

```
npm run initSql
```

### 发布

```
npm run deploy
```

成功后显示：

```
> visit-track@0.0.0 deploy
> wrangler deploy

Proxy environment variables detected. We'll use your proxy for fetch requests.
 ⛅️ wrangler 3.18.0
-------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: visit-track (<unique-ID-for-your-database>)
Total Upload: 50.28 KiB / gzip: 12.23 KiB
Uploaded visit-track (1.29 sec)
Published visit-track (4.03 sec)
  https://visit-track.xxxxx.workers.dev
Current Deployment ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 如何使用

> - `data-base-url` 默认值： `https://visit-track.yoyou.org`
> - `data-page-pv-id` 默认值： `page_pv`
> - `data-page-uv-id` 默认值： `page_uv`

### 1.引入脚本

在 html 的`<head></head>`中加入下面的 `<script>...</script>` 段落即可

- 使用网络 js 文件：

> 使用 defer 属性时，浏览器会在加载完所有内容后再执行这些脚本

```html
<script defer src="//visit-track.yoyou.org/js/index.min.js"></script>
```

或者使用 CDN 版本：

```html
<script defer src="https://cdn.jsdelivr.net/gh/cherry-min/visit-track@main/public/js/index.min.js"></script>
```

- 使用本地 js 文件：

```html
<script src="/front/dist/index.min.js"></script>
```

- 如果已经部署了自己的 Cloudflare 服务，可以使用您的服务地址：

> 将`your-url`更改为你的 worker 地址，如`https://visit-track.workers.dev`，注意结尾不要有`/`

```html
<script defer src="//visit-track.yoyou.org/js/index.min.js" data-base-url="your-url"></script>
```

### 2.展示数据

- 加入 id 为`page_pv` 或 `page_uv`的标签，即可显示 `访问人次(pv)` 或 `访问人数(uv)`

```
本页访问人次:<span id="page_pv"></span>

本页访问人数:<span id="page_uv"></span>
```

- 可以编辑脚本参数，调整标签 id

```
<script defer src="//visit-track.yoyou.org/js/index.min.js" data-base-url="your-url" data-page-pv-id="page_pv" data-page-uv-id="page_uv"></script>
```
