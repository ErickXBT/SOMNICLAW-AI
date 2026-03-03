const RISK_KEYWORDS = [
  'chest pain',
  'suicide',
  'kill myself',
  'want to die',
  'end my life',
  'overdose',
  "can't breathe",
  'cannot breathe',
  'difficulty breathing',
  'heart attack',
  'stroke',
  'seizure',
  'unconscious',
  'bleeding heavily',
  'severe allergic reaction',
  'anaphylaxis',
];

const EMERGENCY_RESPONSE = `🚨 **This could be serious. Please seek immediate medical attention or contact emergency services in your area.**

- **International Emergency**: Call your local emergency number (911, 112, 999, 118, or equivalent)
- **Suicide Prevention**: Contact the 988 Suicide & Crisis Lifeline (call or text 988) or your local crisis hotline
- **Poison Control**: 1-800-222-1222 (US) or your local poison control center

Your safety is the top priority. SOMNICLAW ASSISTANT is not equipped to handle medical emergencies. Please reach out to a qualified professional immediately.`;

export function detectRisk(message: string): { isRisk: boolean; response: string | null } {
  const lowerMessage = message.toLowerCase();
  const detected = RISK_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));

  return {
    isRisk: detected,
    response: detected ? EMERGENCY_RESPONSE : null,
  };
}
