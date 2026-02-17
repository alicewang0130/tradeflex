import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for Whale Watcher
  // In production, this would call HouseStockWatcher or QuiverQuant API.
  
  const whales = [
    {
      name: 'Nancy Pelosi',
      party: 'D-CA',
      role: 'Former Speaker',
      ticker: 'NVDA',
      action: 'BUY 🟢',
      amount: '$1M - $5M',
      date: '2026-02-15', // Recent!
      impact: 'HIGH 🔥'
    },
    {
      name: 'Michael Burry',
      party: 'Hedge Fund',
      role: 'Scion Asset',
      ticker: 'SPY',
      action: 'SELL 🔴',
      amount: '$10M+',
      date: '2026-02-14',
      impact: 'MEDIUM'
    },
    {
      name: 'Bill Ackman',
      party: 'Hedge Fund',
      role: 'Pershing Square',
      ticker: 'CMG',
      action: 'HOLD 🟡',
      amount: '$250M',
      date: '2026-02-10',
      impact: 'LOW'
    }
  ];

  return NextResponse.json({ 
    whales, 
    last_updated: new Date().toISOString() 
  });
}
