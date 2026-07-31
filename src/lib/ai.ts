export interface LlmConfig {
  endpoint: string;
  key: string;
  model: string;
}

const STORAGE_KEY = 'krv-llm-config';
const DEFAULT_MODEL = 'gpt-4o-mini';

export function getLlmConfig(): LlmConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LlmConfig;
  } catch {
    /* ignore */
  }
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {};
  const endpoint = env.PUBLIC_LLM_ENDPOINT;
  const key = env.PUBLIC_LLM_KEY;
  if (endpoint && key) return { endpoint, key, model: env.PUBLIC_LLM_MODEL || DEFAULT_MODEL };
  return null;
}

export function saveLlmConfig(cfg: LlmConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function clearLlmConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const esc = (s: string) => s.replace(/"/g, '\\"').replace(/\n/g, ' ');

export async function explainSentence(orig: string, config?: LlmConfig): Promise<string> {
  const cfg = config ?? getLlmConfig();
  if (!cfg) throw new Error('未配置 AI 接口');
  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        {
          role: 'system',
          content:
            '你是研究康德《纯粹理性批判》的学者，语言风格参考邓晓芒的句读讲解：口语化、逐词拆解、多用比喻和例证，结尾给一句"读法提示"。控制在200字以内。',
        },
        { role: 'user', content: `请讲解这句康德原文：${esc(orig)}` },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI 请求失败（${res.status}）：${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('AI 返回为空');
  return content;
}

export { STORAGE_KEY };
