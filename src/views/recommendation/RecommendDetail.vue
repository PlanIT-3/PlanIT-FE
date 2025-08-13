<template>
  <transition name="slide-reverse">
    <div
      v-if="product"
      class="absolute top-0 left-0 w-80 h-full bg-white shadow-lg p-6 z-20 overflow-y-auto no-scrollbar"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold"
        @click="$emit('close')"
        aria-label="닫기"
      >
        &times;
      </button>

      <h2 class="text-2xl font-semibold mb-1">{{ product.itemName }}</h2>
      <div class="text-xs text-gray-500 mb-3">
        ISIN: {{ product.isinCode }} &nbsp;|&nbsp; 코드: {{ product.shortenCode }} &nbsp;|&nbsp; 기준일:
        {{ product.baseDate }}
      </div>

      <div class="text-3xl font-extrabold mb-3">
        {{ formatPrice(product.closingPrice) }}원
        <span :class="product.changeRange > 0 ? 'text-red-500' : 'text-blue-500'" class="text-sm font-semibold ml-2">
          {{ product.changeRange > 0 ? "+" : "" }}{{ formatPrice(product.changeRange) }} ({{
            product.fluctuationRate
          }}%)
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        <div>
          <div class="text-gray-500">시가</div>
          <div>{{ formatPrice(product.marketOpenPrice) }}원</div>
        </div>
        <div>
          <div class="text-gray-500">고가</div>
          <div class="text-red-600 font-semibold">{{ formatPrice(product.highPrice) }}원</div>
        </div>
        <div>
          <div class="text-gray-500">저가</div>
          <div class="text-blue-600 font-semibold">{{ formatPrice(product.lowPrice) }}원</div>
        </div>
        <div>
          <div class="text-gray-500">전일비</div>
          <div :class="product.difference > 0 ? 'text-red-500' : 'text-blue-500'" class="font-semibold">
            {{ product.difference > 0 ? "+" : "" }}{{ formatPrice(product.difference) }}원
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h3 class="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">기본 정보</h3>
        <dl class="text-sm text-gray-700">
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>종목명</dt>
            <dd>{{ product.itemName }}</dd>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>단축 코드</dt>
            <dd>{{ product.shortenCode }}</dd>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>ISIN 코드</dt>
            <dd>{{ product.isinCode }}</dd>
          </div>
          <div class="flex justify-between py-1">
            <dt>기준일자</dt>
            <dd>{{ product.baseDate }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 class="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">가격 범위 분석</h3>
        <dl class="text-sm text-gray-700">
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>당일 최고가</dt>
            <dd class="text-red-600 font-semibold">{{ formatPrice(product.highPrice) }}원</dd>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>당일 최저가</dt>
            <dd class="text-blue-600 font-semibold">{{ formatPrice(product.lowPrice) }}원</dd>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100">
            <dt>가격 변동폭</dt>
            <dd>{{ formatPrice(product.changeRange) }}원</dd>
          </div>
        </dl>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded-md text-blue-800 text-sm">
        <div>거래 활성도</div>
        <div class="font-semibold">오늘 거래량: {{ formatTradeQuantity(product.tradeQuantity) }}만주</div>
        <div>거래대금: {{ formatTradePrice(product.tradePrice) }}원</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  product: Object,
});

function formatPrice(value) {
  if (!value) return "-";
  return Number(value).toLocaleString();
}

function formatTradeQuantity(value) {
  if (!value) return "-";
  return (Number(value) / 10000).toFixed(2);
}

function formatTradePrice(value) {
  if (!value) return "-";
  return (Number(value) / 10000).toLocaleString();
}
</script>

<style scoped>
.slide-reverse-enter-active,
.slide-reverse-leave-active {
  transition: transform 0.3s ease;
}
.slide-reverse-enter-from {
  transform: translateX(100%);
}
.slide-reverse-enter-to {
  transform: translateX(0);
}
.slide-reverse-leave-from {
  transform: translateX(0);
}
.slide-reverse-leave-to {
  transform: translateX(100%);
}

/* 스크롤바 숨기기 (크롬, 사파리) */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Firefox */
.no-scrollbar {
  scrollbar-width: none;
}

/* IE, Edge */
.no-scrollbar {
  -ms-overflow-style: none;
}
</style>
