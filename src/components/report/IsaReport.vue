<template>
  <div class="w-full max-w-xl flex flex-col gap-4">
    <IsaTaxSavingStatus />

    <GraphBoxNonPeriod title="ISA vs 일반 계좌 세금 비교">
      <TaxComparisonChart />
    </GraphBoxNonPeriod>

    <GraphBoxNonPeriod title="누적 절세 효과">
      <CumulativeTaxSavingsChart />
    </GraphBoxNonPeriod>

    <TaxSavingsSummary />
  </div>
</template>

<script setup>
import api from "@/api";
import GraphBox from "./GraphBox.vue";
import GraphBoxNonPeriod from "./GraphBoxNonPeriod.vue";
import IsaTaxSavingStatus from "./IsaTaxSavingStatus.vue";
import CumulativeTaxSavingsChart from "./CumulativeTaxSavingsChart.vue";
import TaxComparisonChart from "./TaxComparisonChart.vue";
import TaxSavingsSummary from "./TaxSavingsSummary.vue";
</script>

<style scoped></style>
