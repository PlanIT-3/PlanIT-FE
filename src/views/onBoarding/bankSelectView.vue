<script setup>
import { ref } from "vue";
import Button from "@/components/base/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 은행 목록
const banks = [
  { name: "BNK", file: "BNK.svg" },
  { name: "IBK", file: "IBK.svg" },
  { name: "KB국민", file: "KB.svg" },
  { name: "MG새마을금고", file: "MG새마을금고.svg" },
  { name: "SC제일", file: "SC제일.svg" },
  { name: "Sh수협", file: "Sh수협.svg" },
  { name: "광주", file: "광주.svg" },
  { name: "농협", file: "농협.svg" },
  { name: "신한", file: "신한.svg" },
  { name: "신협", file: "신협.svg" },
  { name: "씨티", file: "씨티.svg" },
  { name: "우리", file: "우리.svg" },
  { name: "우체국", file: "우체국.svg" },
  { name: "카카오뱅크", file: "카카오뱅크.svg" },
  { name: "케이뱅크", file: "케이뱅크.svg" },
  { name: "토스", file: "토스.svg" },
  { name: "하나", file: "하나.svg" },
  { name: "한국투자", file: "한국투자.svg" },
];

// 모든 SVG를 한 번에 import
const svgModules = import.meta.glob("@/assets/icons/bank/*.svg", { eager: true, as: "url" });

// 파일명 → URL 매핑
const bankIcons = {};
for (const path in svgModules) {
  const file = path.split("/").pop();
  bankIcons[file] = svgModules[path];
}

const selectedBanks = ref([]);
function selectBank(bank) {
  const idx = selectedBanks.value.findIndex((b) => b.name === bank.name);
  if (idx === -1) {
    selectedBanks.value.push(bank);
  } else {
    selectedBanks.value.splice(idx, 1);
  }
}
function onComplete() {
  if (selectedBanks.value.length === 0) {
    alert("은행을 선택하세요.");
    return;
  }
  alert(selectedBanks.value.map((b) => b.name).join(", ") + "이(가) 선택되었습니다.");
  router.push("/bank-login");
}
</script>

<template>
  <div class="bankSelect-view flex flex-col items-center min-h-screen py-8 px-4">
    <h2 class="text-xl font-medium mb-8">은행 선택</h2>
    <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-10 w-full max-w-md">
      <div
        v-for="bank in banks"
        :key="bank.name"
        class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all"
        :class="
          selectedBanks.some((b) => b.name === bank.name)
            ? 'border-2 border-[#433D8B] bg-white shadow text-[#433D8B] font-bold'
            : 'border border-transparent bg-transparent text-gray-800'
        "
        @click="selectBank(bank)"
        style="min-width: 180px"
      >
        <img
          :src="bankIcons[bank.file]"
          :alt="bank.name + ' 아이콘'"
          class="w-10 h-10 mr-4"
          @error="console.log('이미지 에러:', bank.file, bankIcons[bank.file])"
        />
        <span class="text-base">{{ bank.name }}</span>
      </div>
    </div>
    <Button label="완료" @click="onComplete" class="w-full max-w-md" />
  </div>
</template>

<style scoped>
.bankSelect-view {
  max-height: 100vh;
}
</style>
