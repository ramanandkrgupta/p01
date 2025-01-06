import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80"
        alt="Hero background"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-1 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Expert Services at Your Doorstep
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          From home cleaning to beauty services, we bring trusted professionals to your location
        </p>
        <div className="flex gap-4 justify-center">
        <Link href="/services">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Explore Services
        </Button>
        </Link>
        <Link href="/partners">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Become a Partners
        </Button>
        </Link>
         
         
        </div>
      </div>
    </section>
  );
}