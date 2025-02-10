interface Env {
  LANDING_CONTENT: KVNamespace;
  AI: any; // Cloudflare AI binding
}

interface UserContext {
  country: string;
  device: 'mobile' | 'desktop';
  referralSource?: string;
  interests: string[];
}

const LLM_PERSONALIZATION_PROMPT = (context: UserContext) => `
Generate a landing page hero section focused on cryptocurrency trading. 
Tailor the message to these traits:
- Location: ${context.country}
- Device: ${context.device}
- Came from: ${context.referralSource || 'direct'}
- Crypto interests: ${context.interests.join(', ') || 'general'}

Use emojis relevant to their location and interests. Keep under 200 characters.
`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const userCtx = extractUserContext(request);
    const cacheKey = `${userCtx.country}:${userCtx.device}:${userCtx.interests[0]}`;
    
    // Check cached personalized content
    let content = await env.LANDING_CONTENT.get(cacheKey);
    
    if (!content) {
      // Generate with Cloudflare AI
      const { results } = await env.AI.run(
        '@cf/meta/llama-2-7b-chat-int8', 
        {
          prompt: LLM_PERSONALIZATION_PROMPT(userCtx),
          max_tokens: 300
        }
      );
      
      content = results[0].response;
      await env.LANDING_CONTENT.put(cacheKey, content, { 
        expirationTtl: 3600 // Cache 1 hour
      });
    }

    return new Response(renderLanding(content));
  }
}
