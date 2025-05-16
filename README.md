[简体中文](./README.zh-CN.md) · **English**

# Web Visitor Analytics Service Based on Cloudflare + Hono + D1

[Demo Site](https://visit-track.yoyou.org/)

## Deployment Steps

### Install Dependencies

```bash
npm install -g wrangler
npm install hono
```

### Login

Redirect to the Cloudflare web authorization page.

```bash
npx wrangler login
```

### Create D1 Database: [visit-track]

> The database name should be `visit-track`, consistent with the name in `package.json`.

```bash
npx wrangler d1 create visit-track
```

After successful creation, it will display:

```
✅ Successfully created DB visit-track

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "visit-track"
database_id = "<unique-ID-for-your-database>"
```

### Configure Worker and Bind D1 Database

Write the `unique-ID-for-your-database` returned from the previous step into `wrangler.toml`.

```toml
name = "visit-track"
main = "src/index.ts"
compatibility_date = "2025-05-16"

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "visit-track"
database_id = "<unique-ID-for-your-database>"
```

### Initialize the D1 Database Schema

```bash
npm run initSql
```

### Deploy

```bash
npm run deploy
```

After successful deployment, it will display:

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

## How to Use

> - `data-base-url` default value: `https://visit-track.yoyou.org`
> - `data-page-pv-id` default value: `page_pv`
> - `data-page-uv-id` default value: `page_uv`

### 1. Include the Script

Add the following `<script>...</script>` segment in the `<head>` section of your HTML.

- Using the online JS file:

> With the defer attribute, the browser will execute these scripts after all content is loaded.

```html
<script defer src="//visit-track.yoyou.org/js/index.min.js"></script>
```

Or use the CDN version:

```html
<script defer src="https://cdn.jsdelivr.net/gh/cherry-min/visit-track@main/public/js/index.min.js"></script>
```

- Using a local JS file:

```html
<script src="/front/dist/index.min.js"></script>
```

- If you have deployed your own Cloudflare service, use your service address:

> Change `your-url` to your worker address, like `https://visit-track.workers.dev`, and ensure there is no trailing `/`.

```html
<script defer src="//visit-track.yoyou.org/js/index.min.js" data-base-url="your-url"></script>
```

### 2. Display Data

- Add tags with the ID `page_pv` or `page_uv` to show `Page Views (pv)` or `Unique Visitors (uv)` respectively.

```html
Page Views on this page:<span id="page_pv"></span>

Unique Visitors on this page:<span id="page_uv"></span>
```

- You can edit the script parameters to adjust the tag IDs.

```html
<script
	defer
	src="//visit-track.yoyou.org/js/index.min.js"
	data-base-url="your-url"
	data-page-pv-id="page_pv"
	data-page-uv-id="page_uv"
></script>
```
