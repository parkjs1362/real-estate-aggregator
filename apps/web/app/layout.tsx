import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '부동산 데이터 플랫폼 | 실거래가와 매물정보 한번에',
  description: '국토교통부 공식 데이터 기반 아파트 실거래가와 현재 매물 정보를 제공합니다. 관심 단지를 즐겨찾기하고 가격 변동 알림을 받아보세요.',
  keywords: ['부동산', '아파트', '실거래가', '매물', '시세', '투자', '주택'],
  authors: [{ name: 'Real Estate Platform Team' }],
  openGraph: {
    title: '부동산 데이터 플랫폼',
    description: '실거래가와 매물정보를 한 번에 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Google Search Console 등 검증용
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 필수 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* 검색엔진 최적화 */}
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

        {/* 소셜 미디어 */}
        <meta property="og:site_name" content="부동산 데이터 플랫폼" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* PWA 설정 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>

      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* 헤더 */}
          <Header />

          {/* 메인 컨텐츠 */}
          <main className="flex-1">
            {children}
          </main>

          {/* 푸터 */}
          <Footer />
        </div>

        {/* 토스트 알림 */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* 개발 환경에서만 표시되는 정보 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
            🚧 개발 모드
          </div>
        )}
      </body>
    </html>
  );
}