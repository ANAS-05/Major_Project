import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  Hotel,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Globe,
  ArrowRight,
  MapPin,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: BrainCircuit,
    title: "AI Price Prediction",
    desc: "ML-powered forecasts tell you exactly when to book or wait for the best price.",
    tag: "Popular",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    icon: Hotel,
    title: "Smart Hotel Search",
    desc: "Real Booking.com data, OpenStreetMap, and AI trust scoring for safe stays.",
    tag: null,
    tagColor: "",
  },
  {
    icon: TrendingUp,
    title: "7-Day Trend Forecast",
    desc: "LSTM models predict realistic price curves, not straight-line guesses.",
    tag: "New",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: ShieldCheck,
    title: "Trust Score Engine",
    desc: "Detect fake reviews and spot inauthentic hotels before you book.",
    tag: null,
    tagColor: "",
  },
  {
    icon: Globe,
    title: "20+ Indian Cities",
    desc: "Comprehensive route and hotel coverage across India's top destinations.",
    tag: null,
    tagColor: "",
  },
  {
    icon: Sparkles,
    title: "Conversational AI",
    desc: "Ask natural questions and get data-driven answers in seconds.",
    tag: "Beta",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

const stats = [
  { label: "Routes Covered", value: "50+", icon: MapPin },
  { label: "Cities Supported", value: "20+", icon: Globe },
  { label: "Daily Predictions", value: "10K+", icon: BrainCircuit },
  { label: "User Rating", value: "4.9", icon: Star },
];

const steps = [
  {
    step: "01",
    title: "Search Your Route",
    desc: "Enter origin, destination, and travel dates across 20+ Indian cities.",
  },
  {
    step: "02",
    title: "Get AI Insights",
    desc: "Our models analyze demand, seasonality, and historical trends instantly.",
  },
  {
    step: "03",
    title: "Book Confidently",
    desc: "Receive a clear BOOK NOW / WAIT / MONITOR recommendation.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-20">
          <div className="flex justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <Badge
                variant="secondary"
                className="mb-5 h-7 px-3 text-xs font-medium bg-card border border-border text-muted-foreground"
              >
                <Sparkles className="size-3 mr-1.5 text-primary" />
                AI-Powered Travel Intelligence
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Travel Smarter.
                <br />
                <span className="text-primary">Book Better.</span>
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed mx-auto max-w-lg">
                Predict flight prices, discover trusted hotels, and get personalized
                booking advice powered by machine learning.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/flights">
                  <Button
                    size="lg"
                    className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                  >
                    <Plane className="size-4 mr-2" />
                    Explore Flights
                  </Button>
                </Link>
                <Link to="/hotels">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-lg border-input text-foreground hover:bg-card hover:text-foreground px-6"
                  >
                    <Hotel className="size-4 mr-2" />
                    Find Hotels
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Traveler ${i + 1}`}
                      className="inline-block size-8 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">2,000+</span> travelers use JourneyIt
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────── STATS ───────────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <s.icon className="size-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to travel smarter
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              From price prediction to trust scoring, JourneyIt puts AI in your corner.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <f.icon className="size-5" />
                      </div>
                      {f.tag && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.tagColor}`}>
                          {f.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Book with confidence in 3 simple steps
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[70%] border-t border-dashed border-border" />
                )}
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl bg-secondary px-6 py-14 sm:px-12 sm:py-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
              Ready to save on your next trip?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Join thousands of travelers who use JourneyIt to find the best deals and book with confidence.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/flights">
                <Button
                  size="lg"
                  className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                >
                  Get Started
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-11 rounded-lg border-border/50 text-secondary-foreground hover:bg-secondary/80 hover:text-secondary-foreground px-6"
              >
                <Users className="size-4 mr-2" />
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
