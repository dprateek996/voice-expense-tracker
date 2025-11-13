import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

import {
  Pizza,
  Fuel,
  Shirt,
  Wallet,
  Car,
  Train,
  Music,
  CupSoda,
  UtensilsCrossed,
  Mic,
  Sparkles,
  BarChart,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="w-full min-h-screen antialiased bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FinalCTASection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                           HERO SECTION                              */
/* ------------------------------------------------------------------ */

const HeroSection = () => (
  <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden">

    {/* BACKGROUND ANIMATED CARDS – YOUR ORIGINAL ANIMATION */}
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8 transform-gpu opacity-15 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]">
      <div className="flex flex-col gap-8">
        <InfiniteMovingCards items={leftColumnItems} direction="right" speed="slow" />
      </div>
      <div className="hidden md:flex flex-col gap-8">
        <InfiniteMovingCards items={middleColumnItems} direction="left" speed="slow" />
      </div>
      <div className="hidden md:flex flex-col gap-8">
        <InfiniteMovingCards items={rightColumnItems} direction="right" speed="slow" />
      </div>
    </div>

    {/* FOREGROUND TEXT */}
    <div className="relative z-20 flex flex-col items-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-5xl md:text-7xl font-black tracking-tight"
      >
        Your Expenses, <span className="text-primary">Just Spoken.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-6 max-w-xl text-lg text-neutral-300 text-center leading-relaxed"
      >
        Say it casually — “200 on pizza”, “300 metro recharge”.
        We parse it, categorize it, and log it. No typing ever again.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-10 flex gap-4"
      >
        <Button asChild size="lg" className="px-8 text-lg">
          <Link to="/register">Start Talking</Link>
        </Button>

        <Button asChild variant="secondary" size="lg" className="px-8 text-lg">
          <Link to="/login">Sign In</Link>
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-neutral-400 mt-4"
      >
        A more human way to track money.
      </motion.p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                           FEATURES SECTION                           */
/* ------------------------------------------------------------------ */

const FeaturesSection = () => (
  <div className="py-20 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="bg-card p-8 rounded-lg border border-border flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                        HOW IT WORKS SECTION                          */
/* ------------------------------------------------------------------ */

const HowItWorksSection = () => (
  <div className="py-20 px-4 bg-card border-y border-border">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        Simple as One, Two, Three
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-xs"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                           FINAL CTA SECTION                          */
/* ------------------------------------------------------------------ */

const FinalCTASection = () => (
  <div className="py-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Stop Typing. Start Talking.
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-8">
        Ready to experience the future of expense tracking?
        Join now and transform how you manage your finances forever.
      </p>
      <Button asChild size="lg" className="h-12 text-lg">
        <Link to="/register">Get Started for Free</Link>
      </Button>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*                         STATIC DATA ARRAYS                          */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: <Mic className="w-8 h-8 text-primary" />,
    title: "Effortless Voice Input",
    description: "Just speak naturally — no commands, no typing required.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "AI-Powered Parsing",
    description: "Amount, category, context — all extracted automatically.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Smart Insights",
    description: "Understand your spending with clear visual summaries.",
  },
];

const steps = [
  {
    number: 1,
    title: "Tap & Speak",
    description: "Say the expense exactly like you think it.",
  },
  {
    number: 2,
    title: "AI Analyzes",
    description: "We extract amount, category, vendor, and more.",
  },
  {
    number: 3,
    title: "Expense Logged",
    description: "Everything is stored and visible in your dashboard.",
  },
];

const leftColumnItems = [
  { title: "Paid via UPI", amount: "₹200", icon: <Wallet className="h-6 w-6 text-primary" /> },
  { title: "Zomato", amount: "₹189", icon: <UtensilsCrossed className="h-6 w-6 text-red-400" /> },
  { title: "Spotify", amount: "₹59", icon: <Music className="h-6 w-6 text-green-400" /> },
];

const middleColumnItems = [
  { title: "Domino’s", amount: "₹445", icon: <Pizza className="h-6 w-6 text-blue-400" /> },
  { title: "Uber", amount: "₹168", icon: <Car className="h-6 w-6 text-white" /> },
  { title: "Canteen", amount: "₹80", icon: <CupSoda className="h-6 w-6 text-orange-400" /> },
];

const rightColumnItems = [
  { title: "Fuel – Cash", amount: "₹200", icon: <Fuel className="h-6 w-6 text-yellow-400" /> },
  { title: "Metro Recharge", amount: "₹300", icon: <Train className="h-6 w-6 text-purple-400" /> },
  { title: "H&M", amount: "₹1200", icon: <Shirt className="h-6 w-6 text-pink-400" /> },
];