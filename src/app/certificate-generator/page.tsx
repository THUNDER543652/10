import type { Metadata } from 'next';
import Header from '@/components/Header';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';
import PageUtilities from '@/components/PageUtilities';

export const metadata: Metadata = {
  title: 'Typing Certificate Generator | TestWizard',
  description: 'Generate a premium, verifiable TestWizard typing speed certificate.',
};

export default function CertificateGeneratorPage() {
  return <><Header /><CertificateGenerator /><PageUtilities /></>;
}
