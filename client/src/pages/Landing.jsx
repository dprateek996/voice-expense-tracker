import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

/* ------------------------------------------------------------------ */
/*                             NAVBAR                                 */
/* ------------------------------------------------------------------ */

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
  >
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Mic className="w-6 h-6 text-primary" />
      </div>
      <span className="text-xl font-bold text-slate-900 tracking-tight font-heading">VoEx</span>
    </div>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 font-sans">
      <a href="#" className="hover:text-primary transition-colors">Features</a>
      <a href="#" className="hover:text-primary transition-colors">How it Works</a>
      <a href="#" className="hover:text-primary transition-colors">Pricing</a>
    </div>

    <div className="flex items-center gap-4">
      <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block font-sans">
        Sign In
      </Link>
      <Link to="/register">
        <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white relative overflow-hidden group shadow-lg shadow-primary/20">
          <span className="relative z-10 font-sans">Get Started</span>
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </Button>
      </Link>
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
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Subtle Glow Behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-400/20 rounded-full blur-[100px] -z-10" />

        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 backdrop-blur-md border border-slate-200/50 text-slate-600 text-sm font-medium mb-8 shadow-sm font-sans">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Receipt Scanning
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 font-heading leading-[1.1]">
          Track expenses <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 animate-gradient-text bg-[length:200%_auto]">
            with your voice.
          </span>
        </h1>

        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto mb-10 font-sans leading-relaxed">
          No more spreadsheets. Just say "Spent 500 on lunch" and you're done.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-sans">
              Start for free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-slate-900 font-sans">
              View Demo
            </Button>
          </Link>
        </div>
      </motion.div>

    </div>

    {/* Infinite Cards Animation */}
    <div className="mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
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
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleSimulate = () => {
    if (!input) return;
    setIsListening(true);
    setTimeout(() => {
      const amount = input.match(/\d+/)?.[0] || "0";
      const category = input.toLowerCase().includes("food") || input.toLowerCase().includes("lunch") || input.toLowerCase().includes("pizza") ? "Food & Dining" : "General";
      setResult({ amount, category, vendor: input.replace(/\d+/g, "").trim() || "Unknown" });
      setIsListening(false);
    }, 800);
  };

  return (
    <div className="py-32 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 font-heading">Try it yourself</h2>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-2 max-w-xl mx-auto">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
            <div className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-white text-slate-400 shadow-sm'}`}>
              <Mic className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Type 'Lunch 500 at Cafe'..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-900 placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            />
            <Button onClick={handleSimulate} size="sm" className="rounded-lg px-4 bg-slate-900 text-white hover:bg-slate-800">
              {isListening ? 'Processing...' : 'Simulate'}
            </Button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-slate-900 rounded-xl text-left text-white mx-1 mb-1 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="font-medium text-slate-300 text-sm">Expense Logged</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">JSON Output</span>
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">Amount</div>
                      <div className="text-2xl font-bold text-white">₹{result.amount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">Category</div>
                      <div className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded inline-block">{result.category}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">Vendor</div>
                      <div className="text-sm font-medium text-slate-300">{result.vendor}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-white py-12 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
          <span className="font-heading text-xs">V</span>
        </div>
        <span className="text-sm font-bold text-slate-900 tracking-tight font-heading">VoEx</span>
      </div>

      <p className="text-sm text-slate-400">
        © {new Date().getFullYear()} Voice Expense Tracker. All rights reserved.
      </p>

      <div className="flex gap-6 text-sm font-medium text-slate-500">
        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*                         MAIN LANDING                               */
/* ------------------------------------------------------------------ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-white bg-grain selection:bg-primary/20">
      <Navbar />
      <HeroSection />
      <InteractiveDemoSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default Landing;