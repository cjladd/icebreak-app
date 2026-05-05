import { useState } from 'react';

/**
 * IcebreakerPrompt — surfaces a curated conversation prompt at the top of each
 * mode page, bringing the original "give you questions to ask" concept back
 * into the UI. Mode-aware: pulls from a different list per Friendly/Romantic/Party
 * and styles itself with the page's accent color.
 *
 * Click "Next →" to shuffle to a different prompt; click "Use this prompt" to
 * fire the onUsePrompt callback (the parent page wires that up to pre-fill the
 * Composer's title field).
 */

// Curated prompt lists per mode. Hardcoded on purpose — these are part of the
// product experience, not user-generated. Easy to extend later.
const PROMPTS = {
  friendly: [
    "What's a hobby you've picked up in the last year?",
    "What show are you stuck on right now?",
    "Best meal you've cooked recently?",
    "Coffee, tea, or neither — and why?",
    "What's your ideal Sunday afternoon?",
    "If you had a free Saturday with no plans, what would you do?",
    "What's a small thing that made you laugh today?",
    "Most underrated app on your phone?",
    "What's a skill you wish you had?",
    "Pick one: mountains, beach, or city — and defend it.",
  ],
  romantic: [
    "What's your love language, and how do you know?",
    "What makes you feel instantly comfortable around someone?",
    "Coffee date or dinner — and why?",
    "What's a small green flag you look for early on?",
    "Hot take: dinner dates are overrated for a first meet. Agree?",
    "What does 'taking it slow' actually mean to you?",
    "What's a 'small' thing that matters way more to you than people realize?",
    "Last song that made you think of someone?",
    "What's something thoughtful someone did that you still think about?",
    "Dealbreaker that's pettier than you'd admit?",
  ],
  party: [
    "Wildest spontaneous trip you've ever said yes to?",
    "Best concert you've been to — go.",
    "Go-to karaoke song, no shame?",
    "Late-night taco run or post-club diner — pick one.",
    "What's the most random group chat you're in?",
    "Festival you'd cancel plans for?",
    "If you had to plan a group trip in 3 days, where are we going?",
    "Must-hit spot in your city for someone visiting?",
    "Best dance floor moment you've ever had?",
    "Most chaotic group photo on your camera roll — describe it.",
  ],
};

export default function IcebreakerPrompt({ mode, onUsePrompt }) {
  const list = PROMPTS[mode] ?? [];

  // Start on a random prompt so each page-load feels fresh, rather than always
  // showing the same first item.
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * Math.max(list.length, 1)));

  // Defensive: if a mode without a prompts list slips in, render nothing rather
  // than crash the page.
  if (!list.length) return null;

  const current = list[idx];

  /** Cycle to a different prompt — never repeats the current one. */
  function nextPrompt() {
    if (list.length <= 1) return;
    let next;
    do { next = Math.floor(Math.random() * list.length); } while (next === idx);
    setIdx(next);
  }

  return (
    <section className="card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>💡 ICEBREAKER</span>
        <button onClick={nextPrompt} style={styles.nextBtn}>Next →</button>
      </div>

      {/* Treated like a quote — large, italic, accent-colored to feel distinct
          from the user-generated post cards below. */}
      <p style={styles.prompt}>"{current}"</p>

      <button
        onClick={() => onUsePrompt?.(current)}
        className="btn"
        style={styles.useBtn}
      >
        Use this prompt →
      </button>
    </section>
  );
}

const styles = {
  // Tinted accent background so this feels like a featured/highlighted section
  // rather than just another card. The accent variable changes per mode.
  card: {
    marginBottom: 16,
    background: 'var(--accent-soft, var(--bg-card))',
    border: '1px solid var(--accent)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--accent)',
  },
  nextBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '4px 8px',
  },
  prompt: {
    margin: '4px 0 14px',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.4,
    color: 'var(--text)',
    fontStyle: 'italic',
  },
  useBtn: {
    fontSize: 13,
    padding: '8px 14px',
  },
};
