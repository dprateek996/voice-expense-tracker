import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowRight, Check, Sparkles, BarChart3, Linkedin, Github, Mail, Loader, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Spotlight } from "@/components/ui/spotlight-new";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

/* ------------------------------------------------------------------ */
/*                             NAVBAR                                 */
/* ------------------------------------------------------------------ */

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 items-center">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 justify-start">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Mic className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight font-heading">VoEx</span>
      </div>

      {/* Center: Links (Hidden on mobile) */}
      <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-neutral-300 font-sans">
        <a href="#" className="hover:text-primary transition-colors">Features</a>
        <a href="#" className="hover:text-primary transition-colors">How it Works</a>
        <a href="#" className="hover:text-primary transition-colors">Pricing</a>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 justify-end">
        {/* Theme Toggle */}
        <ThemeToggle />
        <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-primary transition-colors hidden sm:block font-sans">
          Sign In
        </Link>
        <Link to="/register">
          <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white relative overflow-hidden group shadow-lg shadow-primary/40">
            <span className="relative z-10 font-sans">Get Started</span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
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
  { title: "Domino’s", amount: "₹445", icon: "/icons/pizza.png" },
  { title: "Uber Ride", amount: "₹168", icon: "/icons/car.png" },
  { title: "Spotify", amount: "₹119", icon: "/icons/spotify.png" },
  { title: "Shopping", amount: "₹2000", icon: "/icons/cart.png" },
  { title: "H&M", amount: "₹1200", icon: "/icons/tag.png" },
];

const HeroSection = () => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
    {/* Spotlight Effect */}
    <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Subtle Glow Behind Text - Optimized Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[240px] bg-blue-400/20 rounded-full blur-3xl -z-10" />

        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200 text-sm font-medium mb-8 shadow-sm font-sans">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Receipt Scanning
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 font-heading leading-tight">
          Track expenses <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            with your voice.
          </span>
        </h1>

        <p className="mt-4 text-lg text-neutral-300 max-w-xl mx-auto mb-10 font-sans leading-relaxed">
          No more spreadsheets or manual typing. Add expenses instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-white hover:-translate-y-0.5 transition-transform duration-200 ease-out font-sans will-change-transform transform-gpu">
              Start for free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-neutral-400 mt-4">No credit card required</p>
          <Link to="/demo">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-white/20 bg-white/5 backdrop-blur-sm text-neutral-200 hover:bg-white/10 hover:text-white font-sans">
              View Demo
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-sm text-neutral-400">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-neutral-700" />
            ))}
          </div>
          <p>Used by <span className="font-bold text-neutral-200">2,000+</span> early adopters</p>
        </div>
      </motion.div>

    </div>

    {/* Infinite Cards Animation */}
    <div className="mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90 z-10 pointer-events-none" />
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

      // Extract vendor from input - better parsing
      let vendor = "Unknown";
      const inputLower = input.toLowerCase();

      // Common patterns: "for X at Y", "at Y for X", "for X"
      const atMatch = inputLower.match(/at\s+([^,\.]+)/i);
      const forMatch = inputLower.match(/for\s+([^,\.]+?)(?:\s+at|$)/i);

      if (atMatch) {
        vendor = atMatch[1].trim();
      } else if (forMatch) {
        vendor = forMatch[1].replace(/\d+/g, '').trim();
      }

      // Smart categorization based on keywords
      let category = "Shopping";

      if (inputLower.includes("food") || inputLower.includes("lunch") || inputLower.includes("dinner") ||
        inputLower.includes("breakfast") || inputLower.includes("pizza") || inputLower.includes("restaurant") ||
        inputLower.includes("cafe") || inputLower.includes("coffee") || inputLower.includes("pasta") ||
        inputLower.includes("burger") || inputLower.includes("meal")) {
        category = "Food & Dining";
      } else if (inputLower.includes("grocery") || inputLower.includes("groceries") ||
        inputLower.includes("walmart") || inputLower.includes("supermarket") ||
        inputLower.includes("vegetables") || inputLower.includes("fruits")) {
        category = "Groceries";
      } else if (inputLower.includes("uber") || inputLower.includes("cab") || inputLower.includes("taxi") ||
        inputLower.includes("transport") || inputLower.includes("bus") || inputLower.includes("metro") ||
        inputLower.includes("train") || inputLower.includes("flight") || inputLower.includes("gas") ||
        inputLower.includes("petrol") || inputLower.includes("fuel")) {
        category = "Transport";
      } else if (inputLower.includes("movie") || inputLower.includes("cinema") || inputLower.includes("concert") ||
        inputLower.includes("game") || inputLower.includes("entertainment") || inputLower.includes("netflix") ||
        inputLower.includes("spotify") || inputLower.includes("subscription")) {
        category = "Entertainment";
      } else if (inputLower.includes("medicine") || inputLower.includes("doctor") || inputLower.includes("hospital") ||
        inputLower.includes("pharmacy") || inputLower.includes("health") || inputLower.includes("medical")) {
        category = "Healthcare";
      } else if (inputLower.includes("bill") || inputLower.includes("electricity") || inputLower.includes("water") ||
        inputLower.includes("rent") || inputLower.includes("internet") || inputLower.includes("phone")) {
        category = "Bills & Utilities";
      } else if (inputLower.includes("cloth") || inputLower.includes("shirt") || inputLower.includes("shoes") ||
        inputLower.includes("dress") || inputLower.includes("fashion") || inputLower.includes("apparel")) {
        category = "Shopping";
      }

      // Capitalize vendor properly
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
    <div className="py-32 bg-black relative overflow-hidden">
      {/* Subtle gradient background - More unique */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/6 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6"
          >
            <MousePointerClick className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Interactive Demo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight"
          >
            Try it yourself
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the magic of voice-powered expense tracking in action
          </motion.p>
        </div>

        {/* Main Demo Card with Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Gradient Card Background - More unique and subtle */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-sky-500/20 rounded-[3.5rem] blur-2xl opacity-30" />

          <div className="relative bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 p-10 md:p-14 overflow-hidden">
            {/* Subtle inner glow - More unique colors */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-b from-sky-400/8 via-cyan-500/4 to-transparent blur-3xl" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Transcript Display */}
              <div className="min-h-[100px] flex items-center justify-center mb-10">
                <AnimatePresence mode="wait">
                  {isListening && (
                    <motion.div
                      key="listening"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">{transcript}</p>
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 text-primary animate-spin" />
                        <p className="text-sm text-neutral-400 font-medium">Processing your expense...</p>
                      </div>
                    </motion.div>
                  )}
                  {!isListening && !result && (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-xl md:text-2xl font-medium text-neutral-400 tracking-tight">Type an expense below and click Start</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Section - Enhanced Design */}
              <div className="relative group mb-8">
                {/* Glow effect on focus/hover - More unique */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-indigo-500/25 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className={`relative bg-gradient-to-br from-neutral-800/70 to-neutral-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] border transition-all duration-300 ${isListening
                  ? 'border-cyan-400/50 shadow-[0_0_40px_-10px_rgba(34,211,238,0.25)]'
                  : 'border-white/10 group-hover:border-white/20'
                  }`}>
                  <div className="flex items-center gap-4 p-5">
                    <motion.div
                      className={`p-4 rounded-2xl transition-all duration-300 ${isListening
                        ? 'bg-cyan-500/15 text-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-neutral-700/50 text-neutral-400 group-hover:bg-neutral-700/70 group-hover:text-neutral-300'
                        }`}
                      animate={isListening ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Mic className="w-5 h-5" />
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Try: 500 for groceries at walmart"
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base md:text-lg font-medium text-white placeholder:text-neutral-500/80"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isListening && input && handleSimulate()}
                      disabled={isListening}
                    />
                    <Button
                      onClick={handleSimulate}
                      disabled={!input || isListening}
                      className="rounded-2xl px-8 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-semibold shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
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
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden mb-8"
                  >
                    <div className="relative group">
                      {/* Success glow - Enhanced */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-primary/20 to-emerald-500/30 rounded-[2rem] blur-xl opacity-70" />

                      <div className="relative p-8 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-[2rem] text-left text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.2 }}
                              className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20"
                            >
                              <Check className="w-6 h-6 text-emerald-400" />
                            </motion.div>
                            <div>
                              <span className="font-semibold text-white text-lg block">Expense Logged!</span>
                              <span className="text-xs text-neutral-400">Successfully saved to your account</span>
                            </div>
                          </div>
                          <Button
                            onClick={resetDemo}
                            size="sm"
                            variant="ghost"
                            className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95"
                          >
                            Try Again
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                          >
                            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Amount</div>
                            <div className="text-4xl font-bold text-white tracking-tight">₹{result.amount}</div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                          >
                            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Category</div>
                            <div className="inline-flex items-center text-sm font-semibold bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25">
                              {result.category}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                          >
                            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Vendor</div>
                            <div className="text-base font-semibold text-neutral-200 break-words">{result.vendor}</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Example Prompts */}
              {!result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 text-center"
                >
                  <p className="text-sm text-neutral-500 mb-5 font-medium tracking-wide">Try these examples:</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[
                      "500 for groceries at walmart",
                      "150 for lunch at pizza hut",
                      "50 for uber to office"
                    ].map((example, index) => (
                      <motion.button
                        key={example}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => setInput(example)}
                        className="group relative px-6 py-3 text-sm font-medium text-neutral-300 bg-neutral-800/40 hover:bg-neutral-800/70 border border-white/10 hover:border-cyan-400/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg overflow-hidden"
                      >
                        <span className="relative z-10">{example}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-sky-500/8 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-neutral-950 py-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
            <span className="font-heading text-xs">V</span>
          </div>
          <span className="text-sm font-bold text-white tracking-tight font-heading">VoEx</span>
        </div>
        <p className="text-xs text-neutral-500">Voice-powered expense tracking</p>
      </div>

      <p className="text-sm text-neutral-500">
        © {new Date().getFullYear()} Voice Expense Tracker. All rights reserved.
      </p>

      <div className="flex gap-6 items-center">
        <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*                          PRICING TEASER                            */
/* ------------------------------------------------------------------ */

const PricingSection = () => (
  <div className="py-20 bg-black/[0.96] border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Simple, transparent pricing</h2>
      <p className="text-neutral-400 mb-12 max-w-2xl mx-auto">Start free, upgrade when you need more</p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl bg-neutral-900/50 backdrop-blur-xl border border-white/10 shadow-xl hover:border-white/20 transition-all hover:shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Free Forever</h3>
          <div className="text-4xl font-bold text-white mb-6">₹0<span className="text-lg text-neutral-400 font-normal">/mo</span></div>
          <ul className="space-y-3 text-left mb-8">
            {['Voice expense logging', 'Basic analytics', 'Export to CSV', '50 expenses/month'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-neutral-300">
                <Check className="w-4 h-4 text-primary" /> {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white">Get Started</Button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 text-white shadow-2xl shadow-primary/20 relative overflow-hidden hover:shadow-primary/30 transition-all">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
          <div className="text-4xl font-bold text-white mb-6">₹199<span className="text-lg text-neutral-300 font-normal">/mo</span></div>
          <ul className="space-y-3 text-left mb-8">
            {['Unlimited voice logging', 'Receipt scanning (AI)', 'Advanced insights', 'Priority support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-primary" /> {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">Start Free Trial</Button>
        </div>
      </div>
    </div>
  </div>
);

import HowItWorks from '../components/HowItWorks';

/* ------------------------------------------------------------------ */
/*                         MAIN LANDING                               */
/* ------------------------------------------------------------------ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-black antialiased selection:bg-primary/20">
      <Navbar />
      <HeroSection />
      <InteractiveDemoSection />
      <PricingSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Landing;