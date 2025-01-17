import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LANDING_PAGES: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const landingPages = await env.LANDING_PAGES.list();
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const key of landingPages.keys) {
      const pageData = await env.LANDING_PAGES.get(key.name, 'json');
      sitemap += `  <url>\n`;
      sitemap += `    <loc>https://your-domain.com${pageData.url_slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`; // Update with actual last modified date if available
      sitemap += `  </url>\n`;
    }

    sitemap += '</urlset>\n';

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  },
};
