import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ticker, position, price, pnl } = await req.json();

    // 1. Construct prompt for Gemini 3 Pro
    const prompt = `
      You are a harsh, sarcastic WallStreetBets trader.
      Roast this user's trade mercilessly. Be funny, mean, and use emojis.
      Keep it short (under 280 chars) for Twitter.

      Trade:
      - Ticker: ${ticker}
      - Position: ${position} (Long/Short)
      - Entry: $${price}
      - PnL: ${pnl}%

      Example roasts:
      - "Buying the top? Bold strategy, Cotton. Let's see if it pays off. 🤡"
      - "Your portfolio looks like a crime scene. Who hurt you? 📉"
    `;

    // 2. Mock call (replace with real LLM call later)
    // For now, return a random roast to demo the feature without API keys.
    const roasts = [
      `Buying ${ticker} at $${price}? Did you get your investment advice from a fortune cookie? 🥠📉`,
      `Oh look, another ${ticker} bagholder. Your diamond hands are just cubic zirconia. 💎🙌🤡`,
      `${pnl}% PnL? My grandma trades better than this, and she thinks the cloud is in the sky. 👵☁️`,
      `Shorting ${ticker}? The only thing shorter is your attention span. Good luck with that margin call. 📞💸`,
      `Wow, ${ticker}... so original. You and every other Robinhood trader. 🐑baaah`
    ];
    
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

    return NextResponse.json({ roast: randomRoast });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to roast' }, { status: 500 });
  }
}
