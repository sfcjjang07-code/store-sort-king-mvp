import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '편의점 정리왕',
  description: '야간 알바 생존 퍼즐 MVP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
