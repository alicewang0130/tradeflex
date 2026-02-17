--
--  app/lib/sentiment-function.sql
--  TradeFlex - Sentiment Analysis Function
--
--  Run this in Supabase SQL Editor to enable the Retail Sentiment feature.
--

-- Function: get_ticker_sentiment(ticker_symbol)
-- Returns: JSON object with bull/bear percentages and signal
-- Usage: select get_ticker_sentiment('NVDA');

create or replace function public.get_ticker_sentiment(ticker_symbol text)
returns json
language plpgsql
security definer
as $$
declare
  total_count int;
  long_count int;
  short_count int;
  sentiment_score numeric;
  signal_text text;
begin
  -- 1. Get total trades for this ticker in last 30 days
  select count(*) into total_count
  from flexes
  where ticker = ticker_symbol
  and created_at > now() - interval '30 days';

  -- 2. Get LONG positions count
  select count(*) into long_count
  from flexes
  where ticker = ticker_symbol
  and position_type = 'LONG'
  and created_at > now() - interval '30 days';

  -- 3. Calculate metrics
  if total_count > 0 then
    sentiment_score := round((long_count::numeric / total_count::numeric) * 100);
  else
    sentiment_score := 50; -- Default neutral if no data
  end if;

  short_count := total_count - long_count;

  -- 4. Generate signal
  if total_count < 5 then
    signal_text := 'NEUTRAL (Low Data)';
  elsif sentiment_score > 80 then
    signal_text := 'EXTREME GREED (Reverse Short)';
  elsif sentiment_score < 20 then
    signal_text := 'EXTREME FEAR (Reverse Long)';
  else
    signal_text := 'NEUTRAL';
  end if;

  -- 5. Return JSON
  return json_build_object(
    'ticker', ticker_symbol,
    'total_trades', total_count,
    'bullish_pct', sentiment_score,
    'bearish_pct', 100 - sentiment_score,
    'signal', signal_text
  );
end;
$$;
