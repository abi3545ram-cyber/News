/* Headless smoke test for cortex.html — runs the real app in jsdom with canned network. */
const fs = require('fs');
const { JSDOM } = require('jsdom');

let html = fs.readFileSync(__dirname + '/cortex.html', 'utf8');
html = html.replace(/<script src="https:\/\/cdn\.jsdelivr[^<]*<\/script>/, ''); // no CDN in jsdom

const RSS = '<?xml version="1.0"?><rss version="2.0"><channel>' +
  '<item><title>Test headline one</title><description>Desc one</description><link>https://ex.com/1</link><pubDate>Mon, 06 Jul 2026 08:00:00 GMT</pubDate></item>' +
  '<item><title>Test headline two</title><description>Desc two</description><link>https://ex.com/2</link><pubDate>Mon, 06 Jul 2026 07:00:00 GMT</pubDate></item>' +
  '<item><title>Test headline three</title><description>Desc three</description><link>https://ex.com/3</link><pubDate>Mon, 06 Jul 2026 06:00:00 GMT</pubDate></item>' +
  '</channel></rss>';
const GRSS = '<?xml version="1.0"?><rss version="2.0"><channel>' +
  '<item><title>AI story - The Guardian</title><source url="https://g.com">The Guardian</source><link>https://ex.com/ai</link><pubDate>Mon, 06 Jul 2026 08:30:00 GMT</pubDate></item>' +
  '</channel></rss>';
const KRAKEN_BTC = JSON.stringify({ error: [], result: { XXBTZUSD: [[1783000000, "1", "1", "1", "60000.0", "1", "1", 1], [1783086400, "1", "1", "1", "61000.0", "1", "1", 1], [1783172800, "1", "1", "1", "63500.0", "1", "1", 1]], last: 1 } });
const KRAKEN_ETH = JSON.stringify({ error: [], result: { ETHUSD: [[1783000000, "1", "1", "1", "1500.0", "1", "1", 1], [1783172800, "1", "1", "1", "1540.0", "1", "1", 1]], last: 1 } });
const CANNED = [
  ['opentdb.com', JSON.stringify({ response_code: 0, results: [
    { category: 'Science', type: 'multiple', difficulty: 'easy', question: 'What is 2+2?', correct_answer: '4', incorrect_answers: ['3', '5', '6'] },
    { category: 'History', type: 'multiple', difficulty: 'easy', question: 'First man on the Moon?', correct_answer: 'Armstrong', incorrect_answers: ['Aldrin', 'Glenn', 'Gagarin'] },
    { category: 'Geo', type: 'multiple', difficulty: 'easy', question: 'Capital of France?', correct_answer: 'Paris', incorrect_answers: ['Lyon', 'Nice', 'Lille'] },
    { category: 'Tech', type: 'multiple', difficulty: 'easy', question: 'Bits in a byte?', correct_answer: '8', incorrect_answers: ['4', '16', '32'] },
    { category: 'Sport', type: 'multiple', difficulty: 'easy', question: 'Players in football team?', correct_answer: '11', incorrect_answers: ['9', '10', '12'] }
  ] })],
  ['XBTUSD', KRAKEN_BTC],
  ['ETHUSD', KRAKEN_ETH],
  ['price/XAU', JSON.stringify({ currency: 'USD', price: 4100.5, name: 'Gold', symbol: 'XAU', updatedAt: '2026-07-06T08:00:00Z' })],
  ['price/XAG', JSON.stringify({ currency: 'USD', price: 60.2, name: 'Silver', symbol: 'XAG', updatedAt: '2026-07-06T08:00:00Z' })],
  ['frankfurter', JSON.stringify({ amount: 1.0, base: 'GBP', date: '2026-07-06', rates: { EUR: 1.17, USD: 1.33 } })],
  ['byabbe.se', JSON.stringify({ date: 'July 6', events: [
    { year: '1189', description: 'Richard I accedes to the English throne.', wikipedia: [{ title: 'R', wikipedia: 'https://w.org/1' }] },
    { year: '1885', description: 'Pasteur tests his rabies vaccine.', wikipedia: [] },
    { year: '1957', description: 'Lennon meets McCartney.', wikipedia: [] },
    { year: '1998', description: 'Hong Kong airport opens.', wikipedia: [] },
    { year: '2013', description: 'Event five.', wikipedia: [] }
  ] })],
  ['feeds.bbci.co.uk', RSS]
];
function cannedFetch(url) {
  url = String(url);
  // direct Google News call simulates a CORS block -> app must fall through to a proxy
  if (url.startsWith('https://news.google.com')) return Promise.reject(new TypeError('Failed to fetch (simulated CORS)'));
  const viaProxy = url.includes('allorigins.win') || url.includes('corsproxy.io') || url.includes('codetabs.com');
  if (viaProxy) {
    const inner = decodeURIComponent((url.split(/url=|quest=/)[1] || ''));
    const body = inner.includes('news.google.com') ? GRSS : RSS;
    return Promise.resolve({ ok: true, status: 200, text: async () => body });
  }
  for (const [pat, body] of CANNED) {
    if (url.includes(pat)) {
      if (body === null) return Promise.reject(new TypeError('Failed to fetch (simulated CORS)'));
      const text = typeof body === 'function' ? body(url) : body;
      return Promise.resolve({ ok: true, status: 200, text: async () => text });
    }
  }
  return Promise.reject(new TypeError('Unmatched URL: ' + url));
}

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'https://cortex.local/app',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.fetch = cannedFetch;
    if (!window.AbortController) window.AbortController = AbortController;
    window.confirm = () => true;
    window.scrollTo = () => {};
  }
});
const w = dom.window, d = w.document;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('PASS', name); } else { fail++; console.log('FAIL', name); } };
const txt = sel => { const el = d.querySelector(sel); return el ? el.textContent : '(missing)'; };

(async () => {
  await sleep(1500); // let async today-tab loads settle

  ok('masthead date rendered', /2026/.test(txt('#mastDate')));
  ok('greeting personalised', /Abi/.test(txt('#greeting')));
  ok('streak chip', /Day \d+/.test(txt('#streakTxt')));
  ok('headlines rendered', txt('#todayHeadlines').includes('Test headline one'));
  ok('word of the day', txt('#wodBox').length > 30);
  ok('fun fact', txt('#factBox').length > 20);
  ok('markets mini: gold', txt('#miniMarkets').includes('Gold'));
  ok('markets mini: GBP conv', txt('#miniMarkets').includes('£'));
  ok('markets mini: BTC change', /▲|▼/.test(txt('#miniMarkets')));
  ok('on this day', /1189|1885|1957|1998|2013/.test(txt('#otdMini')));

  // daily question flow
  const dqOpts = d.querySelectorAll('#dailyQ .opt');
  ok('daily question has 4 options', dqOpts.length === 4);
  dqOpts[0].click(); await sleep(50);
  ok('daily question locks after answering', d.querySelectorAll('#dailyQ .opt:disabled').length === 4);

  // quiz (offline bank)
  d.querySelector('[data-view="quiz"]').click(); await sleep(100);
  d.querySelector('#quizStart').click(); await sleep(100);
  ok('bank quiz question shows', d.querySelectorAll('#quizShell .opt').length === 4);
  const ans0 = w.eval('Quiz.cur.qs[Quiz.cur.i].ans');
  d.querySelector('#quizShell .opt[data-i="' + ans0 + '"]').click(); await sleep(50);
  ok('correct answer marked', d.querySelector('#quizShell .opt.correct') !== null);
  ok('explanation shown', txt('#qExpl').length > 5);
  d.querySelector('#qNext').click(); await sleep(50);
  ok('advances to Q2', txt('#quizShell').includes('Question 2 of'));
  // finish round quickly
  const total = w.eval('Quiz.cur.qs.length');
  for (let i = 1; i < total; i++) {
    const a = w.eval('Quiz.cur.qs[Quiz.cur.i].ans');
    d.querySelector('#quizShell .opt[data-i="' + a + '"]').click(); await sleep(20);
    d.querySelector('#qNext').click(); await sleep(20);
  }
  ok('results screen', txt('#quizShell').includes('Round complete'));
  ok('stats recorded', w.eval('Quiz.stats().plays') >= 1 && w.eval('Quiz.stats().answered') >= 10);

  // quiz (online mode via canned OpenTDB)
  w.eval('Quiz.cfg={mode:"online",cat:"",diff:-1,len:5};startQuiz()'); await sleep(300);
  ok('online quiz loaded', d.querySelectorAll('#quizShell .opt').length === 4);
  ok('online question decoded', txt('#quizShell').length > 20);

  // words
  d.querySelector('[data-view="words"]').click(); await sleep(100);
  ok('word list rendered', d.querySelectorAll('#wordList .word-row').length === 60);
  d.querySelector('#wordList .mastered-btn').click(); await sleep(50);
  ok('mastery toggles + progress', txt('#wordsProgTxt').includes('1 / 60'));
  d.querySelector('#startFlash').click(); await sleep(50);
  ok('flashcard shows', d.querySelector('#flashArea .flash-word') !== null);
  d.querySelector('#fcReveal').click(); await sleep(50);
  ok('flashcard reveals', d.querySelector('#fcKnew') !== null);
  d.querySelector('#fcKnew').click(); await sleep(50);
  ok('flashcard advances', txt('#flashArea').includes('Card 2 of') || txt('#flashArea').includes('Session complete'));

  // facts
  d.querySelector('[data-view="facts"]').click(); await sleep(100);
  ok('fact of the day', txt('#factOfDay').length > 20);
  ok('fact library', d.querySelectorAll('#factList .fact-item').length === 48);
  ok('on this day full list', d.querySelectorAll('#otdFull .otd-item').length >= 4);

  // news tab (BBC direct + Google via proxy-fallback path)
  d.querySelector('[data-view="news"]').click(); await sleep(400);
  ok('news list rendered', txt('#newsList').includes('Test headline'));
  const aiChip = d.querySelector('#newsCats .chip[data-cat="ai"]');
  aiChip.click(); await sleep(600);
  ok('AI feed via proxy fallback', txt('#newsList').includes('AI story'));
  ok('source stripped from title', !txt('#newsList').includes('AI story - The Guardian'));
  w.eval('document.querySelector("#newsSearch").value="zzzz";renderNews()');
  ok('search filters', txt('#newsList').includes('Nothing matches'));

  // markets tab
  d.querySelector('[data-view="markets"]').click(); await sleep(300);
  ok('markets grid: 6 cards', d.querySelectorAll('#mkGrid .mk-card').length === 6);
  ok('gold card', txt('#mkGrid').includes('Gold'));
  ok('BTC £ conversion', txt('#mkGrid').includes('per coin'));
  ok('FX cards', txt('#mkGrid').includes('Pound → Euro'));
  ok('updated stamp', txt('#mkUpdated').includes('Updated'));

  // persistence
  ok('localStorage streak saved', w.localStorage.getItem('cx_streak') !== null);
  ok('quiz stats persisted', w.localStorage.getItem('cx_qstats') !== null);

  console.log('\\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS CRASH:', e); process.exit(2); });
