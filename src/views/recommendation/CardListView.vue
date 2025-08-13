<template>
  <div class="flex flex-col gap-4 w-[366px] mx-auto py-8">
    <template v-if="loading">
      <div class="flex justify-center items-center h-24">
        <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </template>
    <template v-else>
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
      <div v-if="recommendList.length === 0" class="text-center text-gray-500">추천 상품이 없습니다.</div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import Card from "@/components/recommendation/Card.vue";
import productApi from "@/api/productApi";

const emit = defineEmits(["showDetail"]);

const recommendList = ref([]);
const loading = ref(true);

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
  loading.value = true;
  try {
    const res = await productApi.getRecommendList();
    recommendList.value = res.data || res;
  } catch (error) {
    console.error("추천 상품 불러오기 실패:", error);
  } finally {
    loading.value = false;
  }
});

function handleShowDetail(srtnCd) {
  emit("showDetail", srtnCd);
}
</script>
