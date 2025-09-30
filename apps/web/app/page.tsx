import { Suspense } from 'react';
import SearchBar from '@/components/search/SearchBar';
import FeaturedComplexes from '@/components/complex/FeaturedComplexes';
import RecentDeals from '@/components/complex/RecentDeals';
import Hero from '@/components/ui/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <Hero />

      {/* 검색 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              원하는 아파트를 찾아보세요
            </h2>
            <p className="text-lg text-gray-600">
              실거래가와 현재 매물 정보를 한 번에 확인하세요
            </p>
          </div>

          <Suspense fallback={<div className="animate-pulse h-12 bg-gray-200 rounded-lg" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* 인기 단지 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              인기 아파트 단지
            </h2>
            <p className="text-lg text-gray-600">
              거래량이 많고 관심도가 높은 단지들을 확인해보세요
            </p>
          </div>

          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>}>
            <FeaturedComplexes />
          </Suspense>
        </div>
      </section>

      {/* 최근 실거래 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              최근 실거래 현황
            </h2>
            <p className="text-lg text-gray-600">
              최신 부동산 거래 정보를 실시간으로 확인하세요
            </p>
          </div>

          <Suspense fallback={<div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>}>
            <RecentDeals />
          </Suspense>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              실시간 부동산 데이터
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25,847</div>
              <div className="text-gray-600">등록된 단지</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1,234,567</div>
              <div className="text-gray-600">실거래 데이터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">45,678</div>
              <div className="text-gray-600">현재 매물</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">매일</div>
              <div className="text-gray-600">데이터 업데이트</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}