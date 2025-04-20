"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { SignedIn, SignedOut } from "@/components/general/AuthComponents";
import SignoutButton from "@/components/general/SIgnoutButton";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <div className="container pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="w-full space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary dark:bg-primary/10 mx-auto px-4 py-2 lg:mx-0"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Next-Generation Medical Imaging
            </Badge>

            <h1 className="text-center text-5xl leading-tight font-bold tracking-tighter md:text-6xl lg:text-start">
              <span className="block">AI-Powered</span>
              <span className="from-primary to-primary/70 dark:from-primary dark:to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
                Medical Image
              </span>
              <span className="block">Enhancement</span>
            </h1>

            <p className="text-muted-foreground max-w-lg text-xl">
              Transform low-quality medical scans into crystal-clear diagnostic
              images with our cutting-edge AI technology.
            </p>

            <SignedIn>
              <SignoutButton />
            </SignedIn>

            <SignedOut>
              <Link href={"/login"}>
                <Button className="w-full lg:w-fit">
                  <LogIn />
                  Signin
                </Button>
              </Link>
            </SignedOut>

            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-medium">
                Trusted by leading medical institutions
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Mayo Clinic",
                  "Johns Hopkins",
                  "Cleveland Clinic",
                  "Mass General",
                ].map((hospital, i) => (
                  <motion.div
                    key={hospital}
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                  >
                    <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                      <Check className="text-primary h-3.5 w-3.5" />
                    </div>
                    <span>{hospital}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r blur-2xl" />

            <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-2xl">
              <div className="aspect-[4/3] overflow-hidden">
                <div className="relative h-full w-full">
                  {/* Original Image */}
                  <div className="absolute inset-0">
                    <img
                      src="/brain-after.png"
                      alt="Low quality medical scan"
                      className="h-full w-full object-cover opacity-90 grayscale"
                    />
                  </div>

                  {/* Enhanced Image with Clip Path */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)`,
                    }}
                  >
                    <div className="from-primary/10 absolute inset-0 bg-gradient-to-r to-transparent"></div>
                    <img
                      src="/brain-before.png"
                      alt="Enhanced medical scan"
                      className="h-full w-full object-cover brightness-110 contrast-110 saturate-150"
                    />
                  </div>

                  {/* Divider Line */}
                  <div className="bg-primary absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 transform">
                    <div className="bg-primary absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform cursor-grab items-center justify-center rounded-full">
                      <ArrowRight className="text-primary-foreground h-4 w-4 rotate-180" />
                      <ArrowRight className="text-primary-foreground h-4 w-4" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="bg-background/80 absolute top-4 left-4 rounded-md px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    Original Scan
                  </div>
                  <div className="bg-primary/80 text-primary-foreground absolute top-4 right-4 rounded-md px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    AI Enhanced
                  </div>
                </div>
              </div>

              <div className="bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Brain CT Scan</h3>
                    <p className="text-muted-foreground text-sm">
                      Enhanced with 98.7% accuracy
                    </p>
                  </div>
                  <Badge>4.2x Clearer</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  {[
                    { label: "Resolution", value: "2.4x Higher" },
                    { label: "Noise Reduction", value: "87%" },
                    { label: "Processing Time", value: "1.2 seconds" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">
                        {stat.label}
                      </p>
                      <p className="font-medium">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div
              className={cn(
                "border-border bg-card absolute -top-6 -right-6 hidden rounded-lg border p-4 shadow-lg lg:flex",
                "rotate-6 transform transition-all duration-500 ease-out",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Diagnostic Accuracy</p>
                  <p className="text-muted-foreground text-xs">
                    Improved by 43%
                  </p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "border-border bg-card absolute -bottom-4 -left-4 hidden rounded-lg border p-4 shadow-lg lg:flex",
                "-rotate-3 transform transition-all duration-500 ease-out",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">HIPAA Compliant</p>
                  <p className="text-muted-foreground text-xs">
                    End-to-end encryption
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="to-background absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-b from-transparent">
        <svg
          className="absolute bottom-0 h-16 w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
        >
          <path
            d="M0,42.9L48,53.8C96,64.7,192,86.4,288,85.3C384,84.2,480,60.3,576,53.8C672,47.4,768,58.3,864,58.3C960,58.3,1056,47.4,1152,42.9C1248,38.5,1344,40.6,1392,41.7L1440,42.9V74H1392C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74H0V42.9Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </section>
  );
}
