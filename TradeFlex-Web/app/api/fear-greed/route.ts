import { NextResponse } from 'next/server';
import { load } from 'cheerio';

export async function GET() {
  try {
    // 1. Fetch CNN Fear & Greed page
    const res = await fetch('https://edition.cnn.com/markets/fear-and-greed', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    const html = await res.text();
    const $ = load(html);

    // 2. Parse the score (CNN structure changes often, so we use a robust selector or fallback)
    // Current selector strategy: look for the specific class or text
    let score = 50;
    let label = 'Neutral';

    // Try to find the score in the text
    const scoreText = $('.market-fng-gauge__dial-number-value').text().trim();
    if (scoreText) {
      score = parseInt(scoreText, 10);
    } else {
      // Fallback: search for "Fear & Greed Index: <number>" pattern
      const match = html.match(/"score":(\d+)/);
      if (match && match[1]) {
        score = parseInt(match[1], 10);
      }
    }

    // Determine label based on score
    if (score <= 25) label = 'Extreme Fear';
    else if (score <= 45) label = 'Fear';
    else if (score <= 55) label = 'Neutral';
    else if (score <= 75) label = 'Greed';
    else label = 'Extreme Greed';

    return NextResponse.json({ 
      score, 
      label, 
      last_updated: new Date().toISOString() 
    });

  } catch (error) {
    console.error('Failed to fetch Fear & Greed:', error);
    // Return mock data if fetch fails (to keep UI working)
    return NextResponse.json({ 
      score: 42, 
      label: 'Fear', 
      is_mock: true 
    });
  }
}
