import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Github, Mic, Twitter } from 'lucide-react';
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
  { title: "Domino's", amount: 'Rs 445', icon: '/icons/pizza.png' },
  { title: 'Uber Ride', amount: 'Rs 168', icon: '/icons/car.png' },
  { title: 'Spotify', amount: 'Rs 119', icon: '/icons/spotify.png' },
  { title: 'Shopping', amount: 'Rs 2000', icon: '/icons/cart.png' },
  { title: 'H&M', amount: 'Rs 1200', icon: '/icons/tag.png' },
];

const featureCards = [
  { title: 'Simple expense logging', text: 'Log expenses naturally in a single line.' },
  { title: 'Auto categorization', text: 'Auto-detect amount and category instantly.' },
  { title: 'Edit before saving', text: 'Review and edit every entry before saving.' },
];

const quickInputs = ['Rs 300 for cab', '150 for coffee', '1000 gpay'];

const flowSteps = [
  { title: 'Speak or type expense', text: 'Use natural language and keep it short.' },
  { title: 'Parse amount and category', text: 'VoEx extracts key details immediately.' },
  { title: 'Confirm and save', text: 'Review the result before adding it to your ledger.' },
];

const faqItems = [
  { question: 'Do I need an account to try this?', answer: 'No. You can test parsing instantly.' },
  { question: 'Is my voice data stored?', answer: 'Not in this demo flow.' },
  { question: 'How accurate is categorization?', answer: 'Most common entries are auto-classified; you can edit before saving.' },
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
  } else if (normalized.includes('cofee') || normalized.includes('coffee')) {
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
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background">
              <Mic className="h-5 w-5" />
            </span>
            <span className="text-heading text-xl font-semibold">VoEx</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-meta text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="compact">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="compact">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-12 md:py-12">
          <div className="container text-center">
            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="mx-auto max-w-3xl"
            >
              <p className="text-meta text-muted-foreground">Voice-first expense tracking</p>
              <h1 className="text-heading mt-6 text-5xl font-semibold leading-tight md:text-6xl">Track expenses. Just say it.</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Log spending in seconds with clean voice input and instant categorization.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <Button asChild size="default">
                  <a href="#try-it" className="inline-flex items-center gap-2">
                    Try it live
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="compact">
                  <a href="#features" className="text-meta">See how it works</a>
                </Button>
              </div>
            </Motion.div>
          </div>
        </section>

        <div className="container">
          <Separator />
        </div>

        <section className="py-8">
          <div className="container">
            <InfiniteMovingCards items={tickerItems} direction="right" speed="normal" />
          </div>
        </section>

        <section id="features" className="py-8">
          <div className="container">
            <p className="text-meta text-center text-muted-foreground">Features</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featureCards.map((feature) => (
                <Card key={feature.title}>
                  <CardContent>
                    <h3 className="text-heading text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container flex justify-center">
            <Button asChild size="default">
              <a href="#try-it" className="inline-flex items-center gap-2">
                Try it live
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        <section id="try-it" className="py-12">
          <div className="container">
            <Card>
              <CardContent>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h2 className="text-heading text-4xl font-semibold">Try it yourself</h2>
                    <p className="mt-4 text-muted-foreground">
                      Type an expense phrase and see how quickly it becomes clean, structured data.
                    </p>
                    <ol className="mt-8 space-y-4">
                      {flowSteps.map((step, index) => (
                        <li key={step.title} className="flex items-start gap-4">
                          <span className="text-meta text-muted-foreground">{`0${index + 1}`}</span>
                          <div>
                            <p className="font-medium text-foreground">{step.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Card className="surface-3">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <label htmlFor="voice-input" className="text-meta text-muted-foreground">
                          Expense input
                        </label>
                        <Badge variant="outline" className="text-meta">No login required</Badge>
                      </div>

                      <div className="mt-4 flex items-start gap-3">
                        <textarea
                          id="voice-input"
                          value={input}
                          onChange={(event) => setInput(event.target.value)}
                          rows={3}
                          placeholder="Type your expense command..."
                          className="focus-ring min-h-32 w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
                        />
                        <button
                          type="button"
                          className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border ${isMicOn ? 'border-foreground bg-foreground text-background' : 'border-border bg-muted text-foreground'
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
                            className="focus-ring rounded-md border border-border px-3 py-2 text-meta text-muted-foreground transition-colors hover:bg-muted"
                          >
                            {item}
                          </button>
                        ))}
                      </div>

                      <Button type="button" className="mt-4 w-full" onClick={runParser} loading={isProcessing}>
                        Parse expense
                      </Button>

                      <div className="mt-6">
                        {isProcessing ? (
                          <p className="text-sm text-muted-foreground">Processing your command...</p>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {parsedFields.map((field) => (
                              <Card key={field.label}>
                                <CardContent>
                                  <p className="text-meta text-muted-foreground">{field.label}</p>
                                  <p className="mt-2 text-lg font-semibold text-foreground">{field.value}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <h2 className="text-heading text-4xl font-semibold">FAQ</h2>
            <div className="mt-8 space-y-6">
              {faqItems.map((item) => (
                <Card key={item.question}>
                  <CardContent>
                    <h3 className="text-heading text-2xl font-semibold">{item.question}</h3>
                    <p className="mt-3 text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="py-12">
        <div className="container">
          <Separator />
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-heading text-xl font-semibold">VOEX</p>
              <p className="mt-3 text-muted-foreground">Simple voice-first expense tracking.</p>
            </div>
            <div>
              <p className="text-meta text-muted-foreground">Info</p>
              <div className="mt-4 space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Contact Us</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Trademark</a>
              </div>
            </div>
            <div>
              <p className="text-meta text-muted-foreground">Social</p>
              <div className="mt-4 space-y-3">
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
