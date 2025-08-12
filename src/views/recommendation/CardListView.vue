<template>
  <div class="flex flex-col gap-4 w-[366px] mx-auto py-8">
    <Card
      v-for="(item, index) in recommendList"
      :key="index"
      :title="item.itemName"
      :ratio="`종가: ${item.closingPrice}원`"
      :yield="`수익률 ${item.fluctuationRate}%`"
      :risk="item.investType"
      :riskVariant="getRiskVariant(item.investType)"
      :shortenCode="item.shortenCode"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "@/components/recommendation/Card.vue";
import productApi from "@/api/productApi";

const recommendList = ref([]);

function getRiskVariant(investType) {
  // 백엔드 investType 값이 영어(SAFE, MODERATE, AGGRESSIVE)이므로 변환 필요
  switch (investType) {
    case "SAFE":
      return "two";
    case "MODERATE":
      return "one";
    case "AGGRESSIVE":
      return "three";
    default:
      return "one";
  }
}

onMounted(async () => {
  try {
    const res = await productApi.getRecommendList();
    // API가 data.data 형태로 오면 아래처럼 처리
    recommendList.value = res.data || res;
  } catch (error) {
    console.error("추천 상품 불러오기 실패:", error);
  }
});
</script>
