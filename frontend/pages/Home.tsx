import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
