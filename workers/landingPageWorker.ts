import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LANDING_PAGES: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);

    if (pathSegments.length >= 2 && pathSegments[0] === 'api' && pathSegments[1] === 'landing') {
      const pageId = pathSegments.slice(2).join('-'); // Extract page ID from the remaining segments

      try {
        const pageData = await env.LANDING_PAGES.get(pageId, 'json');

        if (pageData) {
          const html = generateLandingPageHtml(pageData); // Function to generate HTML from the data
          return new Response(JSON.stringify(pageData), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
          });
        } else {
          // Return a default landing page or a 404 error
          return new Response('Landing page not found', { status: 404 });
        }
      } catch (error) {
        console.error('Error fetching or generating landing page:', error);
        return new Response('Internal server error', { status: 500 });
      }
    }

    // Handle other requests or return a 404 for non-landing page paths
    return new Response('Not found', { status: 404 });
  },
};

// Function to generate HTML from the landing page data
function generateLandingPageHtml(pageData: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageData.title}</title>
      <meta name="description" content="${pageData.description}">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Unified Crypto Exchange",
          "description": "${pageData.description}",
          "url": "https://your-domain.com${pageData.url_slug}",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "${pageData.content.location || 'Anytown'}",
            "addressCountry": "${pageData.content.country_code || 'US'}"
          },
          "telephone": "+1-555-555-5555"
        }
      </script>
    </head>
    <body class="bg-gray-100">
      <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">${pageData.h1}</h1>
        ${generateContentHtml(pageData.content)}
      </div>
    </body>
    </html>
  `;
}

// Function to generate HTML for the content sections
function generateContentHtml(content: any): string {
  let html = '';

  if (content.hero) {
    html += `
      <section class="bg-blue-500 text-white p-8 rounded-lg mb-8">
        <h2 class="text-2xl font-bold">${content.hero.headline}</h2>
        <p class="mt-2">${content.hero.subheading}</p>
        <a href="${content.hero.cta_link}" class="mt-4 inline-block bg-white text-blue-500 font-bold py-2 px-4 rounded hover:bg-gray-200">${content.hero.cta_text}</a>
      </section>
    `;
  }

  if (content.benefits) {
    html += `
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Why Choose Our Unified Crypto Exchange?</h2>
        <ul class="list-disc pl-5">
          ${content.benefits.map((benefit: any) => `
            <li>
              <h3 class="text-lg font-bold">${benefit.heading}</h3>
              <p>${benefit.text}</p>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  if (content.faq) {
    html += `
      <section>
        <h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <dl>
          ${content.faq.map((faq: any) => `
            <dt class="font-bold">${faq.question}</dt>
            <dd class="mb-4">${faq.answer}</dd>
          `).join('')}
        </dl>
      </section>
    `;
  }

  return html;
}
