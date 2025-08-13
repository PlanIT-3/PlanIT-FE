<template>
  <div class="relative">
    <div class="flex flex-col items-center">
      <RecommendBanner />
    </div>
    <div
      class="flex flex-col gap-4 w-[366px] mx-auto py-4 overflow-y-auto pb-16 custom-scroll"
      style="max-height: 500px"
    >
      <!-- CardListView에 이벤트 핸들러 추가 -->
      <CardListView @showDetail="openDetail" />
    </div>

    <!-- 상세 슬라이드 패널 -->
    <transition name="slide-left">
      <ProductDetail
        v-if="showDetail && selectedProduct"
        :product="selectedProduct"
        @close="closeDetail"
        class="absolute top-[-70px] left-[-15px] w-80 h-full bg-white shadow-lg z-20"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RecommendBanner from "@/components/recommendation/RecommendBanner.vue";
import CardListView from "./CardListView.vue";
import ProductDetail from "@/views/recommendation/RecommendDetail.vue";
import productApi from "@/api/productApi";

const showDetail = ref(false);
const selectedProduct = ref(null);

async function openDetail(srtnCd) {
  try {
    const res = await productApi.getProductDetail(srtnCd);
    selectedProduct.value = res.data || res;
    showDetail.value = true;
  } catch (error) {
    console.error("상품 상세 조회 실패:", error);
  }
}

function closeDetail() {
  showDetail.value = false;
  selectedProduct.value = null;
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(-100%); /* 왼쪽 밖에서 시작 */
}
.slide-left-enter-to {
  transform: translateX(0%);
}
.slide-left-leave-from {
  transform: translateX(0%);
}
.slide-left-leave-to {
  transform: translateX(-100%); /* 왼쪽으로 사라짐 */
}
</style>
