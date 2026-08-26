import { NextResponse } from 'next/server';
import { createVerificationToken, makeCertificateId, type CertificateData } from '@/lib/certificates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const certificate: CertificateData = {
      certificateId: makeCertificateId(),
      name: String(body.name || 'Typing Champion').trim().slice(0, 80),
      netWpm: Number(body.netWpm || 0),
      grossWpm: Number(body.grossWpm || 0),
      accuracy: Number(body.accuracy || 0),
      cpm: Number(body.cpm || 0),
      wordsTyped: Number(body.wordsTyped || 0),
      correctWords: Number(body.correctWords || 0),
      incorrectWords: Number(body.incorrectWords || 0),
      mistakes: Number(body.mistakes || 0),
      backspaces: Number(body.backspaces || 0),
      elapsedTime: String(body.elapsedTime || '0:00'),
      duration: String(body.duration || '1m'),
      difficulty: String(body.difficulty || 'easy'),
      grade: String(body.grade || 'D'),
      issuedOn: new Date().toISOString(),
    };
    const token = createVerificationToken(certificate);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    return NextResponse.json({ certificate, verifyUrl: `${baseUrl}/verify/${token}` });
  } catch {
    return NextResponse.json({ error: 'Unable to create certificate.' }, { status: 400 });
  }
}
