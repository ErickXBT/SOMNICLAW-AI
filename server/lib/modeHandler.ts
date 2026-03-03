export type ConsultationMode = 'clinical' | 'calm' | 'data' | 'friendly';

interface ModeConfig {
  prompt: string;
  temperature: number;
}

const modeConfigs: Record<ConsultationMode, ModeConfig> = {
  clinical: {
    prompt: `Respond in a structured clinical format. Use the following sections when applicable:
• **Possible Causes** — List potential contributing factors
• **Risk Factors** — Identify relevant risk indicators  
• **Recommended Actions** — Provide actionable, evidence-based steps
• **When to Seek Medical Help** — Clearly state warning signs that require professional attention

Maintain a professional, measured tone throughout. Be thorough but concise.`,
    temperature: 0.3,
  },
  calm: {
    prompt: `Respond with empathy and emotional warmth. Use short, digestible paragraphs. Acknowledge the user's feelings before offering guidance. Be emotionally supportive and reassuring. Avoid overwhelming the user with excessive information. Focus on comfort and practical next steps.`,
    temperature: 0.5,
  },
  data: {
    prompt: `Respond with scientific precision and analytical depth. Reference relevant sleep science concepts such as REM/NREM sleep stages, circadian rhythm, cortisol, melatonin, adenosine, and other relevant biomarkers when applicable. Use data-driven explanations. Maintain an analytical, educational tone. Cite general scientific consensus where relevant.`,
    temperature: 0.4,
  },
  friendly: {
    prompt: `Respond in a warm, conversational tone. Use simple, everyday language. Be approachable and relatable. Avoid medical jargon — explain concepts as if talking to a friend. Keep responses engaging and easy to understand.`,
    temperature: 0.7,
  },
};

export function getModeConfig(mode: ConsultationMode): ModeConfig {
  return modeConfigs[mode] || modeConfigs.friendly;
}
