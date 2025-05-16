import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { checkUrl, getUrlData } from './lib/util'
import { insertAndReturnId, insert } from './lib/dbutil';

type Bindings = {
	DB: D1Database
	KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()
app.get("/js/index.min.js", async (c) => {
	const js = await c.env.KV.get('visit-track-js').then((v) => {
		return v;
	});
	return c.text(js || '');
})
//放行所有public
app.get("/", (c) => {
	const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VisitTrack: 基于Cloudflare+D1的web访客统计服务</title>
		<script defer src="//visit-track.yoyou.org/js/index.min.js"></script>
    <style>
        :root {
            --primary-color: #4361ee;
            --primary-hover: #3a56d4;
            --secondary-color: #3f37c9;
            --accent-color: #4cc9f0;
            --text-color: #2b2d42;
            --text-light: #555b6e;
            --bg-color: #f8f9fa;
            --card-bg: #ffffff;
            --border-radius: 12px;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            max-width: 900px;
            margin: 0 auto;
            padding: 30px 20px;
            background-color: var(--bg-color);
            background-image: linear-gradient(120deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .container {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 40px;
            box-shadow: var(--box-shadow);
            position: relative;
            overflow: hidden;
            transition: var(--transition);
        }

        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }

        h1, h2, h3 {
            font-weight: 700;
            line-height: 1.3;
            color: var(--secondary-color);
        }

        h1 {
            font-size: 28px;
            margin-bottom: 25px;
            border-bottom: 1px solid #edf2f7;
            padding-bottom: 15px;
            position: relative;
        }

        h2 {
            font-size: 22px;
            margin: 30px 0 15px;
        }

        h3 {
            font-size: 18px;
            margin: 20px 0 10px;
            color: var(--primary-color);
        }

        ul {
            padding-left: 25px;
            margin-bottom: 20px;
        }

        li {
            margin-bottom: 12px;
            position: relative;
        }

        li::before {
            content: '•';
            color: var(--primary-color);
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
        }

        p {
            margin-bottom: 15px;
            color: var(--text-light);
        }

        code {
            background-color: #f1f5f9;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            color: #3b82f6;
            border: 1px solid #e2e8f0;
        }

        pre {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        }

        pre code {
            background: none;
            padding: 0;
            border: none;
            color: #334155;
        }

        .highlight {
            color: var(--primary-color);
            font-weight: 500;
        }

        .btn {
            display: inline-block;
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 15px;
            margin-right: 10px;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: var(--transition);
            box-shadow: 0 4px 6px rgba(67, 97, 238, 0.15);
        }

        .btn:hover {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(67, 97, 238, 0.2);
        }

        .github-btn {
            background-color: #24292e;
            box-shadow: 0 4px 6px rgba(36, 41, 46, 0.15);
        }

        .github-btn:hover {
            background-color: #000;
            box-shadow: 0 7px 14px rgba(36, 41, 46, 0.2);
        }

        .feature-section {
            margin: 25px 0 35px;
            position: relative;
        }

        .feature-list ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .feature-list li {
            background-color: rgba(248, 250, 252, 0.8);
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: var(--transition);
        }

        .feature-list li:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .feature-list li::before {
            display: none;
        }

        .feature-list li strong {
            color: var(--primary-color);
            display: inline-block;
            margin-bottom: 5px;
        }

        .usage-section {
            margin: 30px 0;
            padding: 25px;
            background-color: rgba(248, 250, 252, 0.7);
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }

        .intro-text {
            font-size: 16px;
            margin-bottom: 25px;
        }

        .code-option {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px dashed #e2e8f0;
        }

        .code-option:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .note {
            font-size: 14px;
            color: #64748b;
            padding: 10px;
            background-color: #f8fafc;
            border-left: 3px solid var(--accent-color);
            margin-top: 10px;
        }

        .support-section {
            margin: 30px 0;
            text-align: center;
        }

        footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #edf2f7;
        }

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 30px 20px;
            }

            h1 {
                font-size: 24px;
            }

            h2 {
                font-size: 20px;
            }

            h3 {
                font-size: 16px;
            }
        }
				.demo-stats {
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 3px solid var(--primary-color);
        }

        .demo-stats p {
            margin-bottom: 10px;
        }

        .demo-stats span {
            font-weight: bold;
            color: var(--primary-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>VisitTrack <span class="highlight">基于Cloudflare+Hono+D1的web访客统计服务</span></h1>
        </header>
        <section class="usage-section">
            <h2>引入脚本</h2>
            <p class="intro-text">在html的&lt;head"&gt;&lt;/head&gt中加入下面的 &lt;script&gt...&lt;/script&gt 段落即可</p>

            <div class="code-option">
                <h3>使用网络js文件</h3>
                <pre><code>&lt;script defer src="//visit-track.yoyou.org/js/index.min.js"&gt;&lt;/script&gt;</code></pre>
								或者
                <pre><code>&lt;script defer src="https://cdn.jsdelivr.net/gh/cherry-min/visit-track@main/public/js/index.min.js"&gt;&lt;/script&gt;</code></pre>
            </div>

			    	<div class="code-option">
                <h3>使用本地js文件</h3>
                <pre><code>&lt;script src="/front/dist/index.min.js"&gt;&lt;/script&gt;</code></pre>
            </div>
            <div class="code-option">
                <h3>使用自定义服务地址</h3>
                <p>如果已经cloud flare服务，可以使用您的服务地址：</p>
                <pre><code>&lt;script defer src="//visit-track.yoyou.org/js/index.min.js" data-base-url="your-url"&gt;&lt;/script&gt;</code></pre>
                <p class="note">将 <code>your-url</code> 更改为您的worker地址，如 <code>https://visit-track.workers.dev</code>，注意结尾不要有 <code>/</code></p>
            </div>
        </section>
        <section class="usage-section">
            <div class="code-option">
                <h3>数据展示</h3>
                <p>加入id为page_pv 或 page_uv的标签，即可显示 访问人次(pv) 或 访问人数(uv)</p>
                <div class="demo-stats">
										<pre><code>&lt;p&gt;本页访问人次: &lt;span id="page_pv"&gt;&lt;/span&gt;&lt;/p&gt;
&lt;p&gt;本页访问人数: &lt;span id="page_uv"&gt;&lt;/span&gt;&lt;/p&gt;</code></pre>
                </div>
                <p>可以编辑脚本参数，调整标签id：</p>
                <pre><code>&lt;script defer src="//visit-track.yoyou.org/js/index.min.js" data-base-url="your-url" data-page-pv-id="page_pv" data-page-uv-id="page_uv"&gt;&lt;/script&gt;</code></pre>
            </div>
        </section>
        <section class="usage-section">
            <h2>本站访问量统计</h2>
            <div class="feature-list">
                <ul>
                    <li><strong>本页访问人次(PV)：</strong><span id="page_pv"></span></li>
                    <li><strong>本页访问人数(UV)：</strong><span id="page_uv"></span></li>
                </ul>
            </div>
        </section>

        <div class="support-section">
            <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="qingbomyc" data-color="#FFDD00" data-emoji="☕"  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
        </div>

        <footer>
            <h2>相关链接</h2>
            <div class="btn-group">
                <a href="https://github.com/cherry-min/visit-tract" class="btn github-btn" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 5px; vertical-align: -2px;">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    GitHub Repository
                </a>
                <a href="https://visit-track.yoyou.org" class="btn" target="_blank">官方网站</a>
            </div>
        </footer>
    </div>
</body>
</html>`;
	return c.html(html);
});

app.use('/api/*', cors());

app.post('/api/visit', async (c) => {
	const retObj = { ret: "ERROR", data: null, message: "Error, Internal Server Error" };
	try {
		let visitorIP = c.req.header('CF-Connecting-IP')
		const body = await c.req.json()
		const hostname = body.hostname
		const url_path = body.url
		const referrer = body.referrer
		const pv = body.pv
		const uv = body.uv
		let referrer_path = ''
		let referrer_domain = ''
		if (referrer && checkUrl(referrer)) {
			const referrerData = getUrlData(referrer);
			referrer_domain = referrerData.hostname;
			referrer_path = referrerData.pathname;
		}
		const website = await c.env.DB.prepare('select id, domain from t_website where domain = ?').bind(hostname).first();
		let websiteId: number;
		if (website) {
			await insert(c.env.DB,
				'insert into t_web_visitor (website_id, url_path, referrer_domain, referrer_path, visitor_ip) values(?, ?, ?, ?, ?)',
				[website.id, url_path, referrer_domain, referrer_path, visitorIP]);
			websiteId = Number(website.id);
		} else {
			websiteId = await insertAndReturnId(c.env.DB, 'insert into t_website (name, domain) values(?,?)', [hostname.split(".").join("_"), hostname]);
			await insert(c.env.DB,
				'insert into t_web_visitor (website_id, url_path, referrer_domain, referrer_path, visitor_ip) values(?, ?, ?, ?, ?)',
				[websiteId, url_path, referrer_domain, referrer_path, visitorIP]);
		}
		const resData: { pv?: number, uv?: number } = {}
		if (pv) {
			const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from t_web_visitor where website_id = ? and url_path = ?').bind(websiteId, url_path).first('total');
			resData['pv'] = Number(total)
		}
		if (uv) {
			const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from (select DISTINCT visitor_ip from t_web_visitor where website_id = ? and url_path = ?) t').bind(websiteId, url_path).first('total');
			resData['uv'] = Number(total)
		}
		return c.json({ ret: "OK", data: resData });
	} catch (e) {
		console.error(e);
		return c.json(retObj);
	}
})


app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));
export default app
