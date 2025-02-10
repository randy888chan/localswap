interface Env {
  LANDING_CONTENT: KVNamespace;
  AI: any; 
  ANALYTICS: AnalyticsEngineDataset;
}

const PERSONA_RE = /(trader|hodler|newbie)/;
const COIN_RE = /(\bBTC\b|\bETH\b|\bTON\b)/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Allow manual refresh for key personas
    if (url.pathname === '/refresh' && request.method === 'POST') {
      return this.handleRefresh(env, request);
    }
    
    // Normal request flow
    const user = this.extractUser(request);
    let content = await env.LANDING_CONTENT.get(user.segment);

    if (!content || this.needsRefresh(user.segment)) {
      content = await this.generateContent(env, user);
      await env.LANDING_CONTENT.put(user.segment, content, {
        metadata: { generatedAt: Date.now() },
        expirationTtl: 43200 // 12h 
      });
      
      // Track content generation
      env.ANALYTICS.writeDataPoint({
        indexes: [user.segment],
        blobs: [COIN_RE.test(content) ? 'crypto' : 'general'],
        doubles: [content.length]
      });
    }

    return new Response(this.renderTemplate(user, content));
  },

  private async generateContent(env: Env, user: UserContext) {
    return env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [{
        role: 'system',
        content: `Generate landing content for ${user.segment} focused on
          trending coins. Include sections: Value Prop, Coin Highlights, 
          Security Features`
      }]
    }).then(res => res.choices[0].message.content);
  },

  private async handleRefresh(env: Env, request: Request) {
    const keySegments = ['asia-trader', 'europe-hodler', 'na-newbie'];
    await Promise.all(keySegments.map(segment => 
      env.LANDING_CONTENT.delete(segment)
    ));
    return new Response('Content regenerating');
  }
}
