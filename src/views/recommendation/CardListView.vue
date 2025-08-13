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
      @showDetail="handleShowDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import Card from "@/components/recommendation/Card.vue";
import productApi from "@/api/productApi";

const emit = defineEmits(["showDetail"]); // 부모 컴포넌트에 이벤트 전달용

const recommendList = ref([]);

function getRiskVariant(investType) {
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
    recommendList.value = res.data || res;
  } catch (error) {
    console.error("추천 상품 불러오기 실패:", error);
  }
});

function handleShowDetail(srtnCd) {
  emit("showDetail", srtnCd); // 상위 컴포넌트로 이벤트 전달
}
</script>
