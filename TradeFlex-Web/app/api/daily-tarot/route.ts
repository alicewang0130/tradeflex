import { NextResponse } from 'next/server';

const TAROT_CARDS = [
  { name: 'The Bull', emoji: '🐂', meaning: 'Strength, momentum, buying the dip.' },
  { name: 'The Bear', emoji: '🐻', meaning: 'Caution, hedging, taking profits.' },
  { name: 'The Ape', emoji: '🦍', meaning: 'Hold regardless of logic. Diamond hands.' },
  { name: 'The Moon', emoji: '🚀', meaning: 'Volatility, high risk, high reward.' },
  { name: 'The Bagholder', emoji: '🎒', meaning: 'Patience required. Recovery might take time.' },
  { name: 'The Whale', emoji: '🐳', meaning: 'Follow the smart money. Watch large flows.' },
  { name: 'The Rug', emoji: '📉', meaning: 'Danger. Stay alert for sudden drops.' },
  { name: 'The Printer', emoji: '🖨️', meaning: 'Liquidity is flowing. Market goes brrr.' },
];

export async function GET() {
  // 1. Pick a random card based on the date (so everyone gets the same "Daily Market Vibe" or random per user?)
  // Let's make it random per user for fun engagement.
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  
  // 2. Generate a fortune (Mocking AI for speed, replace with real LLM call later)
  const fortunes = [
    `Today's energy aligns with ${card.name}. ${card.meaning}`,
    `The charts whisper ${card.name}. Expect ${card.meaning.toLowerCase()}`,
    `Your portfolio resonates with the spirit of ${card.name}.`
  ];
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  return NextResponse.json({
    card: card.name,
    emoji: card.emoji,
    fortune: fortune,
    date: new Date().toISOString().split('T')[0]
  });
}
