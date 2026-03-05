import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Github, Mic, Twitter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { label: 'How it works', href: '#features' },
  { label: 'Try it', href: '#try-it' },
  { label: 'Support', href: '#footer' },
];

const tickerItems = [
  { title: "Domino's", amount: '₹445', icon: '/icons/pizza.png' },
  { title: 'Uber Ride', amount: '₹168', icon: '/icons/car.png' },
  { title: 'Spotify', amount: '₹119', icon: '/icons/spotify.png' },
  { title: 'Shopping', amount: '₹2,000', icon: '/icons/cart.png' },
  { title: 'H&M', amount: '₹1,200', icon: '/icons/tag.png' },
];

const featureCards = [
  {
    title: 'Instant expense logging',
    text: 'Speak naturally — in Hindi, English, or Hinglish — and VoEx extracts amount, category, and merchant in under a second.',
    num: '01',
  },
  {
    title: 'AI-powered categorization',
    text: 'Indic-optimized language models auto-classify every transaction into the right category. No manual tagging.',
    num: '02',
  },
  {
    title: 'Review before saving',
    text: 'Every parsed entry is shown to you first. Edit, adjust, or confirm with one tap before it hits your ledger.',
    num: '03',
  },
];

const quickInputs = ['Rs 300 for cab', '150 for coffee', '1000 gpay'];

const flowSteps = [
  { title: 'Speak or type your expense', text: 'Use natural language. Keep it short — one line is all you need.' },
  { title: 'AI parses amount & category', text: 'VoEx instantly extracts key details using Indic-optimized models.' },
  { title: 'Confirm and save', text: 'Review the structured result, edit if needed, then add it to your ledger.' },
];

const faqItems = [
  { question: 'Do I need an account to try it?', answer: 'No. The live demo above works without any login. Create an account when you are ready to save and track.' },
  { question: 'Is my voice data stored?', answer: 'Audio is processed in real-time and discarded. Transcripts are stored only when you confirm and save an expense.' },
  { question: 'Which languages are supported?', answer: 'VoEx is optimized for Hindi, English, and Hinglish input using Sarvam AI\'s Indic speech models.' },
  { question: 'How accurate is categorization?', answer: 'Most common expense types are auto-classified with high accuracy. You can always edit the category before saving.' },
];

const toTitleCase = (value) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const parseVoiceInput = (value) => {
  const text = value.trim();
  const normalized = text.toLowerCase();
  const amountMatch = normalized.match(/(?:rs\.?\s*)?(\d+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? Number.parseFloat(amountMatch[1]) : 0;

  let merchant = 'General Expense';
  let category = 'General';

  if (normalized.includes('cab') || normalized.includes('uber') || normalized.includes('taxi')) {
    merchant = 'Cab Ride';
    category = 'Transport';
  } else if (normalized.includes('coffee') || normalized.includes('cofee')) {
    merchant = 'Coffee';
    category = 'Food & Dining';
  } else if (normalized.includes('gpay')) {
    merchant = 'GPay Transfer';
    category = 'Transfer';
  } else {
    const forMatch = text.match(/for\s+([^,.]+)/i);
    if (forMatch?.[1]) {
      merchant = toTitleCase(forMatch[1]);
    }
  }

  return {
    amount,
    merchant,
    category,
    status: amount > 0 ? 'Ready to save' : 'Needs amount',
  };
};

const Landing = () => {
  const [input, setInput] = useState(quickInputs[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [result, setResult] = useState(() => parseVoiceInput(quickInputs[0]));
  const [openFaq, setOpenFaq] = useState(null);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    []
  );

  const runParser = () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setResult(parseVoiceInput(input));
      setIsProcessing(false);
    }, 700);
  };

  const parsedFields = [
    { label: 'Amount', value: formatInr(result.amount) },
    { label: 'Merchant', value: result.merchant },
    { label: 'Category', value: result.category },
    { label: 'Status', value: result.status },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ──────────────── HEADER ──────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background">
              <Mic className="h-5 w-5" />
            </span>
            <span className="text-heading text-xl font-semibold tracking-tight">VoEx</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="compact">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="compact" className="bg-foreground text-background hover:bg-foreground/90">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* ──────────────── HERO ──────────────── */}
        <section className="py-20 md:py-28">
          <div className="container text-center">
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mx-auto max-w-3xl"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Voice-first expense tracking
              </p>
              <h1 className="text-heading mt-8 text-5xl font-bold leading-[1.15] md:text-7xl md:leading-[1.1]">
                Expense tracking at the speed of speech.
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Stop typing, start talking. VoEx uses Indic-optimized AI to turn your voice into organized financial data in seconds.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                <Button asChild size="default" className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-sm font-medium">
                  <a href="#try-it" className="inline-flex items-center gap-2">
                    Try it live
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="compact">
                  <a href="#features" className="font-mono text-xs uppercase tracking-[0.15em]">See how it works</a>
                </Button>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* ──────────────── TICKER ──────────────── */}
        <div className="container">
          <Separator />
        </div>

        <section className="py-8">
          <div className="container">
            <InfiniteMovingCards items={tickerItems} direction="right" speed="normal" />
          </div>
        </section>

        <div className="container">
          <Separator />
        </div>

        {/* ──────────────── FEATURES ──────────────── */}
        <section id="features" className="py-20">
          <div className="container">
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Features</p>
              <h2 className="text-heading mt-4 text-4xl font-semibold">Built for speed and clarity</h2>
            </Motion.div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featureCards.map((feature, idx) => (
                <Motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                >
                  <div className="group relative h-full rounded-[12px] border border-border bg-card p-6 transition-colors hover:border-foreground/20">
                    <span className="font-mono text-xs text-muted-foreground">{feature.num}</span>
                    <h3 className="text-heading mt-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────── TRY IT ──────────────── */}
        <section id="try-it" className="py-20">
          <div className="container">
            <div className="rounded-[12px] border border-border bg-card p-8 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Interactive demo</p>
                  <h2 className="text-heading mt-4 text-4xl font-semibold">Try it yourself</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Type an expense phrase and see how quickly it becomes clean, structured data.
                  </p>
                  <ol className="mt-10 space-y-6">
                    {flowSteps.map((step, index) => (
                      <li key={step.title} className="flex items-start gap-4">
                        <span className="font-mono text-xs text-muted-foreground mt-1">{`0${index + 1}`}</span>
                        <div>
                          <p className="font-medium text-foreground">{step.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-[12px] border border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="voice-input" className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Expense input
                    </label>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">No login required</Badge>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <textarea
                      id="voice-input"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      rows={3}
                      placeholder="Type your expense command..."
                      className="focus-ring min-h-28 w-full rounded-[8px] border border-input bg-background px-4 py-3 text-sm"
                    />
                    <button
                      type="button"
                      className={`focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border transition-colors ${isMicOn ? 'border-foreground bg-foreground text-background' : 'border-border bg-muted text-foreground'
                        }`}
                      onClick={() => setIsMicOn((prev) => !prev)}
                      aria-label="Toggle microphone"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {quickInputs.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInput(item)}
                        className="focus-ring rounded-[6px] border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <Button type="button" className="mt-4 w-full bg-foreground text-background hover:bg-foreground/90" onClick={runParser} loading={isProcessing}>
                    Parse expense
                  </Button>

                  <div className="mt-6">
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {parsedFields.map((field) => (
                          <div key={field.label} className="rounded-[8px] border border-border p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{field.label}</p>
                            <p className={`mt-2 text-lg font-semibold text-foreground ${field.label === 'Amount' ? 'font-mono' : ''}`}>
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── FAQ ──────────────── */}
        <section className="py-20">
          <div className="container max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">FAQ</p>
            <h2 className="text-heading mt-4 text-4xl font-semibold text-center">Common questions</h2>
            <div className="mt-12 space-y-0 divide-y divide-border rounded-[12px] border border-border">
              {faqItems.map((item, idx) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full flex-col text-left px-6 py-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <h3 className="text-heading text-base font-medium">{item.question}</h3>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === idx && (
                    <Motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      {item.answer}
                    </Motion.p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer id="footer" className="border-t border-border py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-heading text-xl font-semibold tracking-tight">VOEX</p>
              <p className="mt-3 text-sm text-muted-foreground">Voice-first expense tracking, built with Sarvam AI.</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Info</p>
              <div className="mt-4 space-y-3">
                <a href="mailto:prateekdwivedi2003@gmail.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Social</p>
              <div className="mt-4 space-y-3">
                <a href="https://github.com/dprateek996/voice-expense-tracker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="https://twitter.com/dprateek996" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="font-mono text-[11px] text-muted-foreground">© {new Date().getFullYear()} VoEx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
