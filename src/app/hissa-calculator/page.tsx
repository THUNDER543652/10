import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HissaCalculatorClient from './HissaCalculatorClient';

export const metadata: Metadata = {
  title: 'Hissa Calculator',
  description: 'Calculate land ownership shares, beneficiary allocations, and area in Kanals, Marla, and square feet.',
};

export default function HissaCalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HissaCalculatorClient />
      <Footer />
    </main>
  );
}
