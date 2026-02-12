import { Navbar } from '@/components/layout/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { HowToPlay } from '@/components/landing/how-to-play';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowToPlay />
      </main>
      <Footer />
    </>
  );
}
