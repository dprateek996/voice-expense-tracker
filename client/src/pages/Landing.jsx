import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowRight, Check, Sparkles, BarChart3, Linkedin, Github, Mail, Loader, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import ThemeToggle from "@/components/ThemeToggle";

/* ------------------------------------------------------------------ */
/*                             NAVBAR                                 */
/* ------------------------------------------------------------------ */

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 items-center">
      <div className="flex items-center gap-2 justify-start">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Mic className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">VoEx</span>
      </div>
      <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#demo" className="hover:text-primary transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-4 justify-end">
        <ThemeToggle />
        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
          Sign In
        </Link>
        <Link to="/register">
          <Button size="sm" className="rounded-full px-6">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  </motion.nav>
);

/* ------------------------------------------------------------------ */
/*                          HERO SECTION                              */
/* ------------------------------------------------------------------ */
const heroItems = [
  { title: "Domino's", amount: "₹445", icon: "/icons/pizza.png" },
  { title: "Uber Ride", amount: "₹168", icon: "/icons/car.png" },
  { title: "Spotify", amount: "₹119", icon: "/icons/spotify.png" },
  { title: "Shopping", amount: "₹2000", icon: "/icons/cart.png" },
  { title: "H&M", amount: "₹1200", icon: "/icons/tag.png" },
];

const HeroSection = () => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          New: Receipt Scanning
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6 leading-tight">
          Track expenses <br />
          <span className="text-muted-foreground">
            with your voice.
          </span>
        </h1>

        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          No more spreadsheets or manual typing. Add expenses instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg">
              Start for free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-0">No credit card required</p>
          <Link to="/demo">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
              View Demo
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
    <div className="mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <InfiniteMovingCards
        items={heroItems}
        direction="right"
        speed="slow"
        className="py-4"
      />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                       INTERACTIVE DEMO                             */
/* ------------------------------------------------------------------ */

const InteractiveDemoSection = () => {
  const [input, setInput] = React.useState("");
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleSimulate = () => {
    if (!input) return;
    setIsListening(true);
    setTranscript(input);

    setTimeout(() => {
      const amount = input.match(/\d+/)?.[0] || "0";
      let vendor = "Unknown";
      const inputLower = input.toLowerCase();

      const atMatch = inputLower.match(/at\s+([^,.]+)/i);
      const forMatch = inputLower.match(/for\s+([^,.]+?)(?:\s+at|$)/i);

      if (atMatch) {
        vendor = atMatch[1].trim();
      } else if (forMatch) {
        vendor = forMatch[1].replace(/\d+/g, '').trim();
      }

      let category = "Shopping";
      if (inputLower.includes("food") || inputLower.includes("lunch") || inputLower.includes("dinner") ||
        inputLower.includes("breakfast") || inputLower.includes("pizza") || inputLower.includes("restaurant") ||
        inputLower.includes("cafe") || inputLower.includes("coffee")) {
        category = "Food & Dining";
      } else if (inputLower.includes("grocery") || inputLower.includes("groceries") || inputLower.includes("walmart")) {
        category = "Groceries";
      } else if (inputLower.includes("uber") || inputLower.includes("cab") || inputLower.includes("taxi") ||
        inputLower.includes("transport") || inputLower.includes("bus") || inputLower.includes("metro")) {
        category = "Transport";
      } else if (inputLower.includes("movie") || inputLower.includes("netflix") || inputLower.includes("spotify")) {
        category = "Entertainment";
      }

      vendor = vendor.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setResult({ amount, category, vendor });
      setIsListening(false);
    }, 1200);
  };

  const resetDemo = () => {
    setResult(null);
    setInput("");
    setTranscript("");
    setIsListening(false);
  };

  return (
    <div id="demo" className="py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <MousePointerClick className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Interactive Demo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight"
          >
            Try it yourself
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Experience the magic of voice-powered expense tracking in action
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="min-h-[80px] flex items-center justify-center mb-8">
              <AnimatePresence mode="wait">
                {isListening && (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-semibold text-foreground mb-2">{transcript}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Processing...</p>
                    </div>
                  </motion.div>
                )}
                {!isListening && !result && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <p className="text-xl text-muted-foreground">Type an expense below and click Start</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative mb-8">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border">
                <div className={`p-3 rounded-xl ${isListening ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Mic className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Try: 500 for groceries at walmart"
                  className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isListening && input && handleSimulate()}
                  disabled={isListening}
                />
                <Button
                  onClick={handleSimulate}
                  disabled={!input || isListening}
                  className="rounded-xl px-6"
                >
                  {isListening ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing
                    </span>
                  ) : (
                    'Start'
                  )}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Expense Logged!</span>
                          <p className="text-xs text-muted-foreground">Successfully saved</p>
                        </div>
                      </div>
                      <Button onClick={resetDemo} variant="ghost" size="sm">
                        Try Again
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
                        <p className="text-2xl font-bold text-foreground">₹{result.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg">
                          {result.category}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vendor</p>
                        <p className="text-sm font-medium text-foreground">{result.vendor}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!result && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">Try these examples:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "500 for groceries at walmart",
                    "150 for lunch at pizza hut",
                    "50 for uber to office"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setInput(example)}
                      className="px-4 py-2 text-sm text-muted-foreground bg-muted hover:bg-muted/80 border border-border rounded-xl transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*                          FEATURES SECTION                          */
/* ------------------------------------------------------------------ */

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Input",
      description: "Simply speak your expense and we'll log it automatically"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Categorization",
      description: "Smart categorization using advanced machine learning"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      description: "Beautiful charts and insights into your spending"
    }
  ];

  return (
    <div id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you track and manage your expenses effortlessly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*                          PRICING SECTION                           */
/* ------------------------------------------------------------------ */

const PricingSection = () => (
  <div id="pricing" className="py-24 bg-muted/30 border-y border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
      <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Start free, upgrade when you need more</p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-foreground mb-2">Free Forever</h3>
          <div className="text-4xl font-bold text-foreground mb-6">₹0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          <ul className="space-y-3 text-left mb-8">
            {['Voice expense logging', 'Basic analytics', 'Export to CSV', '50 expenses/month'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full rounded-full">Get Started</Button>
        </div>
        <div className="bg-card border-2 border-primary rounded-2xl p-8 relative shadow-lg">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">POPULAR</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
          <div className="text-4xl font-bold text-foreground mb-6">₹199<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          <ul className="space-y-3 text-left mb-8">
            {['Unlimited voice logging', 'Receipt scanning (AI)', 'Advanced insights', 'Priority support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-foreground">
                <Check className="w-4 h-4 text-primary" /> {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full rounded-full">Start Free Trial</Button>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                             FOOTER                                 */
/* ------------------------------------------------------------------ */

const Footer = () => (
  <footer className="bg-card py-12 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
            <span className="text-xs">V</span>
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">VoEx</span>
        </div>
        <p className="text-xs text-muted-foreground">Voice-powered expense tracking</p>
      </div>

      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Voice Expense Tracker. All rights reserved.
      </p>

      <div className="flex gap-6 items-center">
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*                         MAIN LANDING                               */
/* ------------------------------------------------------------------ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Landing;