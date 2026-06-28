import { Button } from "@/components/ui/button";
import { ArrowRight, Keyboard } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import KeyboardGraphic from "@/components/KeyboardGraphic";

export default function App() {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1.05]);
  const rotateX = useTransform(scrollYProgress, [0.2, 0.5], [0, 40]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -left-52 -top-52 h-136 w-136 rounded-full bg-primary/20 blur-[180px]" />
      <div className="absolute right-0 top-0 h-120 w-120 rounded-full bg-violet-500/10 blur-[170px]" />
      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 ">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading text-3xl tracking-wide">
              Overtype
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
        <section className="mx-auto flex min-h-[90vh] items-center justify-center px-8">
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
        <section style={{ perspective: "2000px" }} className="mx-auto flex w-full max-w-7xl items-center justify-center px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              scale,
              rotateX,

              perspective: 1500,
              transformStyle: "preserve-3d",
              transformOrigin: "center center"
            }}
            className="w-full origin-center"
          >
            <KeyboardGraphic />
          </motion.div>
        </section>

        {/* Bento Features */}
        <section className="mx-auto max-w-7xl px-8 py-8">

          <div className="mb-20 text-center">

            <h2 className="font-heading text-6xl">
              Built for competitive typists.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Every game mode is designed to push your speed, consistency and accuracy.
            </p>

          </div>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Battle Royale */}

            <motion.div
              whileHover={{ y: -8 }}
              className="glass card-hover relative overflow-hidden rounded-3xl border border-white/10 p-8 lg:col-span-2 lg:h-105"
            >

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />

              <span className="text-sm uppercase tracking-[0.25em] text-primary">
                Battle Royale
              </span>

              <h3 className="mt-5 text-4xl font-bold">
                Last player typing wins.
              </h3>

              <p className="mt-5 max-w-md text-muted-foreground">
                Survive elimination rounds while dozens of players race in
                real time. Miss a word, lose a life.
              </p>

              <div className="absolute bottom-8 right-8">

                <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4 backdrop-blur-xl">

                  <p className="font-mono text-5xl font-bold text-primary">
                    48
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Players Alive
                  </p>

                </div>

              </div>

            </motion.div>

            {/* Type Race */}

            <motion.div
              whileHover={{ y: -8 }}
              className="glass card-hover relative overflow-hidden rounded-3xl border border-white/10 p-8 lg:h-105"
            >

              <div className="absolute -left-12 top-0 h-48 w-48 rounded-full bg-fuchsia-500/15 blur-[80px]" />

              <span className="text-sm uppercase tracking-[0.25em] text-primary">
                Type Race
              </span>

              <h3 className="mt-5 text-3xl font-bold">
                Pure speed.
              </h3>

              <p className="mt-4 text-muted-foreground">
                Race your friends with live WPM updates and finish rankings.
              </p>

              <div className="mt-10 space-y-4">

                <div className="glass rounded-xl p-4">

                  <div className="flex justify-between">

                    <span>You</span>

                    <span className="font-mono text-primary">
                      128 WPM
                    </span>

                  </div>

                </div>

                <div className="glass rounded-xl p-4">

                  <div className="flex justify-between">

                    <span>GhostTyper</span>

                    <span className="font-mono">
                      124 WPM
                    </span>

                  </div>

                </div>

              </div>

            </motion.div>

            {/* Stats */}

            <motion.div
              whileHover={{ y: -8 }}
              className="glass card-hover rounded-3xl border border-white/10 p-8 lg:h-105"
            >

              <span className="text-sm uppercase tracking-[0.25em] text-primary">
                Statistics
              </span>

              <h3 className="mt-5 text-3xl font-bold">
                Track every keystroke.
              </h3>

              <div className="mt-10 grid grid-cols-2 gap-5">

                <div>

                  <p className="text-5xl font-bold text-primary">
                    99%
                  </p>

                  <p className="mt-2 text-muted-foreground">
                    Accuracy
                  </p>

                </div>

                <div>

                  <p className="text-5xl font-bold text-primary">
                    142
                  </p>

                  <p className="mt-2 text-muted-foreground">
                    Best WPM
                  </p>

                </div>

              </div>

            </motion.div>

            {/* Leaderboards */}

            <motion.div
              whileHover={{ y: -8 }}
              className="glass card-hover relative overflow-hidden rounded-3xl border border-white/10 p-8 lg:col-span-2 lg:h-105"
            >

              <div className="absolute right-0 top-0 h-full w-72 bg-linear-to-l from-primary/10 to-transparent" />

              <span className="text-sm uppercase tracking-[0.25em] text-primary">
                Ranked
              </span>

              <h3 className="mt-5 text-4xl font-bold">
                Climb the global leaderboard.
              </h3>

              <p className="mt-5 max-w-xl text-muted-foreground">
                Earn rating, unlock achievements, and compete against the
                fastest typists across the world.
              </p>

              <div className="mt-10 flex gap-5">

                <div className="glass rounded-2xl px-6 py-5">

                  <p className="text-3xl font-bold text-primary">
                    #18
                  </p>

                  <span className="text-muted-foreground">
                    Global Rank
                  </span>

                </div>

                <div className="glass rounded-2xl px-6 py-5">

                  <p className="text-3xl font-bold text-primary">
                    2112
                  </p>

                  <span className="text-muted-foreground">
                    Rating
                  </span>

                </div>

              </div>

            </motion.div>

          </div>

        </section>
      </div>
    </main>
  );
}