import { Button } from "@/components/ui/button";
import { ArrowRight, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

// 1. Properly import the SVG file
import KeyboardGraphic from "@/components/KeyboardGraphic";

export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -left-52 -top-52 h-136 w-136 rounded-full bg-primary/20 blur-[180px]" />
      <div className="absolute right-0 top-0 h-120 w-120 rounded-full bg-violet-500/10 blur-[170px]" />
      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed left-0 right-0 top-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-4 bg-accent/50 backdrop-blur-md rounded-2xl shadow-lg shadow-black/10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading text-3xl tracking-wide">
              TypeArena
            </span>
          </motion.div>

          <div className="hidden items-center gap-10 text-sm text-muted-foreground lg:flex">
            <a className="transition-colors hover:text-white" href="#">
              Home
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Modes
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Rankings
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Discord
            </a>
          </div>

          <Button className="brand-gradient glow rounded-full px-7">
            Play Now
          </Button>
        </nav>

        {/* Hero */}
        <section className="mx-auto flex min-h-[90vh] items-center justify-center px-8 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex max-w-4xl flex-col items-center"
          >
            <h1 className="hero-gradient mt-8 text-center text-7xl leading-none lg:text-8xl">
              TYPE.
              <br />
              SURVIVE.
              <br />
              DOMINATE.
            </h1>

            <p className="mt-8 max-w-xl text-center text-lg leading-8 text-muted-foreground">
              Compete against players around the world in fast-paced typing battles. Race, survive elimination rounds, climb the global ladder, and become the ultimate typing champion.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Button size="lg" className="brand-gradient glow rounded-full px-8">
                Play Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="glass rounded-full px-8">
                View Modes
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Keyboard Graphic Section */}
        <section className="mx-auto flex w-full max-w-6xl items-center justify-center px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            {/* 2. Use the imported variable as the src */}
            <KeyboardGraphic />
          </motion.div>
        </section>
      </div>
    </main>
  );
}