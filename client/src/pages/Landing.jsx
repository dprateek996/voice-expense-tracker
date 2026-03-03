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
import './Landing.css';

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
  { title: 'Simple expense logging', text: 'Log expenses naturally in a single line' },
  { title: 'Auto categorization', text: 'Auto-detect amount and category instantly' },
  { title: 'Edit before saving', text: 'Review and edit every entry before saving' },
];

const quickInputs = ['Rs 300 for cab', '150 for cofee', '1000 gpay'];

const flowSteps = [
  { title: 'Speak or type expense', text: 'Use natural language and keep it short.' },
  { title: 'Parse amount and category', text: 'VoEx extracts key details immediately.' },
  { title: 'Confirm and save', text: 'Review the result before adding it to your ledger.' },
];

const faqItems = [
  {
    question: 'Do I need an account to try this?',
    answer: 'No. You can test parsing instantly.',
  },
  {
    question: 'Is my voice data stored?',
    answer: 'Not in this demo flow.',
  },
  {
    question: 'How accurate is categorization?',
    answer: 'Most common entries are auto-classified; you can edit before saving.',
  },
];

const toTitleCase = (value) => value
  .split(' ')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const formatInr = (value) => new Intl.NumberFormat('en-IN', {
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

  useEffect(() => () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

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

  const handleMicClick = () => {
    setIsMicOn((prev) => !prev);
  };

  const parsedFields = [
    { label: 'Amount', value: formatInr(result.amount) },
    { label: 'Merchant', value: result.merchant },
    { label: 'Category', value: result.category },
    { label: 'Status', value: result.status },
  ];

  return (
    <div className="landing-minimal">
      <header className="landing-header">
        <div className="landing-shell landing-header-row">
          <Link to="/" className="landing-brand" aria-label="VoEx home">
            <span className="landing-brand-icon">
              <Mic className="h-4 w-4" />
            </span>
            <span className="landing-brand-name">VoEx</span>
          </Link>

          <nav className="landing-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </nav>

          <div className="landing-header-actions">
            <div className="landing-theme-toggle-wrap">
              <ThemeToggle />
            </div>
            <Button variant="ghost" size="sm" asChild className="landing-signin-btn">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="landing-header-start-btn">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="top">
          <div className="landing-shell landing-hero-grid">
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="landing-hero-copy"
            >
              <p className="landing-kicker">Voice-first expense tracking</p>
              <h1>Track expenses. Just say it.</h1>
              <p className="landing-subtext">
                Log spending in seconds with clean voice input and instant categorization.
              </p>

              <div className="landing-hero-actions">
                <Button size="lg" asChild className="landing-hero-primary-btn">
                  <a href="#try-it">
                    Try it live
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>

                <Button variant="link" size="lg" asChild className="landing-hero-secondary-btn">
                  <a href="#features">See how it works</a>
                </Button>
              </div>
            </Motion.div>
          </div>
        </section>

        <div className="landing-shell">
          <Separator className="landing-section-divider" />
        </div>

        <section className="landing-ticker" id="ticker">
          <div className="landing-shell">
            <InfiniteMovingCards
              items={tickerItems}
              direction="right"
              speed="normal"
              className="landing-ticker-scroller"
            />
          </div>
        </section>

        <section className="landing-facts" id="features" aria-label="Features">
          <div className="landing-shell">
            <p className="landing-features-kicker">Features</p>
            <div className="landing-facts-grid">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="landing-fact-card">
                  <CardContent className="landing-fact-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-mid-cta" aria-label="Quick actions">
          <div className="landing-shell">
            <div className="landing-mid-cta-row">
              <Button size="lg" asChild className="landing-hero-primary-btn landing-mid-primary-btn">
                <a href="#try-it">
                  Try it live
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="landing-try" id="try-it">
          <div className="landing-shell">
            <Card className="landing-try-card">
              <CardContent className="landing-try-grid">
                <div className="landing-try-copy-block">
                  <h2 className="landing-section-title">Try it yourself</h2>
                  <p className="landing-try-copy">
                    Type an expense phrase and see how quickly it becomes clean, structured data.
                  </p>

                  <ol className="landing-flow-list">
                    {flowSteps.map((step, index) => (
                      <li key={step.title}>
                        <span>{`0${index + 1}`}</span>
                        <div>
                          <p>{step.title}</p>
                          <small>{step.text}</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="landing-try-panel-wrap">
                  <Card className="landing-try-panel">
                    <CardContent className="landing-try-panel-content">
                      <div className="landing-try-panel-head">
                        <label htmlFor="voice-input">Expense input</label>
                        <Badge variant="outline" className="landing-no-login">No login required</Badge>
                      </div>

                      <div className="landing-input-row">
                        <textarea
                          id="voice-input"
                          value={input}
                          onChange={(event) => setInput(event.target.value)}
                          rows={3}
                          placeholder="Type your expense command..."
                        />
                        <button
                          type="button"
                          className={`landing-mic-btn ${isMicOn ? 'is-active' : ''}`}
                          onClick={handleMicClick}
                          aria-label="Toggle microphone"
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="landing-presets" role="list" aria-label="Preset inputs">
                        {quickInputs.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setInput(item)}
                            className="landing-preset-btn"
                          >
                            <Badge variant="outline" className="landing-preset-chip">{item}</Badge>
                          </button>
                        ))}
                      </div>

                      <Button type="button" className="landing-parse-btn" onClick={runParser}>
                        {isProcessing ? 'Parsing...' : 'Parse expense'}
                      </Button>

                      <div className="landing-result" aria-live="polite">
                        {isProcessing ? (
                          <p className="landing-processing">Processing your command...</p>
                        ) : (
                          <div className="landing-result-grid">
                            {parsedFields.map((field) => (
                              <Card key={field.label} className="landing-result-item">
                                <CardContent className="landing-result-item-content">
                                  <span>{field.label}</span>
                                  <strong>{field.value}</strong>
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

        <section className="landing-faq" aria-label="Frequently asked questions">
          <div className="landing-shell">
            <h2 className="landing-section-title">FAQ</h2>
            <div className="landing-faq-list">
              {faqItems.map((item) => (
                <Card key={item.question} className="landing-faq-item">
                  <CardContent className="landing-faq-content">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer" id="footer">
        <div className="landing-shell">
          <Separator className="landing-footer-separator" />
          <div className="landing-footer-row">
            <div>
              <p className="landing-footer-brand">VOEX</p>
              <p className="landing-footer-copy">Simple voice-first expense tracking.</p>
            </div>

            <div className="landing-footer-links">
              <p>Info</p>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Trademark</a>
            </div>

            <div className="landing-footer-links">
              <p>Social</p>
              <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /> GitHub</a>
              <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /> Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
