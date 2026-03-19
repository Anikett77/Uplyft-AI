"use client"
import Image from "next/image";
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Works from "@/components/Works";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
<div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
  <main className="w-full">
    <Navbar />
    <HeroSection />
    <Features/>
    <Works/>
    <Testimonials/>
    <Footer/>
  </main>
</div>
  );
}
