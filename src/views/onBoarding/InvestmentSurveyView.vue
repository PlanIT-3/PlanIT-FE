<template>
  <div class="min-h-screen bg-gradient-to-b from-[#2D2363] to-white flex flex-col relative">
    <OnboardingHeader />
    <div class="flex-1 flex flex-col items-center">
      <!-- 설문 카드 -->
      <CardContainer>
        <template v-if="!showResult">
          <!-- Progress Bar -->
          <div class="w-full mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-gray-400">진행률</span>
              <span class="text-xs text-gray-400">{{ currentIndex + 1 }}/{{ questions.length }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-[#4B3C8A] h-2.5 rounded-full"
                :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
              ></div>
            </div>
          </div>
          <!-- 질문 -->
          <div class="mb-6 font-bold text-gray-800 text-base w-full">
            {{ questions[currentIndex].question }}
          </div>
          <!-- 체크리스트 -->
          <form class="w-full">
            <div class="flex flex-col gap-3 text-sm text-gray-700">
              <label
                v-for="(choice, idx) in questions[currentIndex].choices"
                :key="idx"
                class="flex items-center gap-2"
              >
                <input type="radio" :name="'q' + currentIndex" :value="idx" v-model="selected" />
                {{ choice.text }}
              </label>
            </div>
          </form>
          <!-- 다음/완료 버튼 -->
          <button
            class="w-full py-3 rounded-lg text-white font-semibold bg-[#B9AFFF] shadow-md disabled:bg-[#B9AFFF]/50 transition mt-8"
            :disabled="selected === null"
            @click="nextOrFinish"
          >
            {{ currentIndex === questions.length - 1 ? "완료" : "다음" }}
          </button>
        </template>
        <template v-else>
          <div class="w-full flex flex-col items-center justify-center h-full">
            <div class="text-lg font-bold mb-4">당신의 투자 성향은?</div>
            <div class="text-2xl font-extrabold text-[#4B3C8A] mb-2">{{ resultType }}</div>
            <div class="text-gray-700">가장 높은 점수를 받은 성향입니다.</div>
            <button class="mt-8 text-[#4B3C8A] underline" @click="resetSurvey">다시하기</button>
          </div>
        </template>
      </CardContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import OnboardingHeader from "@/components/common/OnboardingHeader.vue";
import CardContainer from "@/components/common/CardContainer.vue";

const types = ["안전형", "안정추구형", "위험중립형", "적극투자형", "공격투자형"];

const questions = [
  {
    question: "Q1. 당신의 주요 투자 목적은 무엇인가요?",
    choices: [
      { text: "① 원금 보전 및 생활 안정", scores: [4, 2, 0, 0, 0] },
      { text: "② 은퇴/교육 등 계획적 자금 마련", scores: [2, 3, 2, 1, 0] },
      { text: "③ 중장기 자산 증식", scores: [0, 1, 3, 3, 1] },
      { text: "④ 고수익 추구 (자산 크게 불리기)", scores: [0, 0, 1, 2, 4] },
    ],
  },
  {
    question: "Q2. 투자 가능 기간은 얼마나 되나요?",
    choices: [
      { text: "① 1년 이하", scores: [4, 3, 0, 0, 0] },
      { text: "② 1~3년", scores: [2, 3, 2, 1, 0] },
      { text: "③ 3~5년", scores: [0, 1, 3, 3, 2] },
      { text: "④ 5년 이상", scores: [0, 0, 1, 2, 4] },
    ],
  },
  {
    question: "Q3. 손실이 발생했을 때 어떻게 대응하시겠습니까?",
    choices: [
      { text: "① 손실 발생 시 즉시 투자금 회수", scores: [4, 2, 0, 0, 0] },
      { text: "② 손실 일정 수준까지 기다림", scores: [2, 3, 2, 1, 0] },
      { text: "③ 계속 보유 (장기 투자 시 믿음 유지)", scores: [0, 1, 3, 3, 1] },
      { text: "④ 오히려 추가 투자 (저가 매수)", scores: [0, 0, 1, 2, 4] },
    ],
  },
  {
    question: "Q4. 연간 기대 수익률은 어느 정도인가요?",
    choices: [
      { text: "① 2~3% (예금 수준)", scores: [4, 3, 0, 0, 0] },
      { text: "② 4~6%", scores: [2, 3, 2, 1, 0] },
      { text: "③ 7~10%", scores: [0, 1, 3, 3, 1] },
      { text: "④ 10% 이상", scores: [0, 0, 1, 2, 4] },
    ],
  },
  {
    question: "Q5. 본인의 투자 경험을 선택하세요",
    choices: [
      { text: "① 예·적금, 보험 외 투자 경험 없음", scores: [4, 2, 0, 0, 0] },
      { text: "② 일부 펀드, ETF 경험 있음", scores: [1, 3, 2, 1, 0] },
      { text: "③ 주식 직접 매매 경험 있음", scores: [0, 1, 3, 3, 1] },
      { text: "④ 레버리지/가상자산/파생상품 경험 있음", scores: [0, 0, 1, 2, 4] },
    ],
  },
  {
    question: "Q6. 투자 실패 시 감내 가능한 손실 규모는?",
    choices: [
      { text: "① -5% 미만도 견디기 힘들다", scores: [4, 3, 0, 0, 0] },
      { text: "② -10% 정도까지 가능", scores: [2, 3, 2, 1, 0] },
      { text: "③ -20%까지 가능", scores: [0, 1, 3, 3, 1] },
      { text: "④ -30% 이상도 감내 가능", scores: [0, 0, 1, 2, 4] },
    ],
  },
];

const currentIndex = ref(0);
const selected = ref(null);
const answers = ref([]); // 각 문항별 선택 인덱스
const scores = ref([0, 0, 0, 0, 0]);
const showResult = ref(false);

const resultType = computed(() => {
  const max = Math.max(...scores.value);
  const idx = scores.value.findIndex((s) => s === max);
  return types[idx];
});

const router = useRouter();

watch(showResult, (val) => {
  if (val) {
    router.push({
      name: "InvestmentSurveyResult",
      query: { type: resultType.value },
    });
  }
});

function nextOrFinish() {
  if (selected.value === null) return;
  // 선택값 저장
  answers.value[currentIndex.value] = selected.value;
  // 점수 누적
  const choiceScores = questions[currentIndex.value].choices[selected.value].scores;
  for (let i = 0; i < scores.value.length; i++) {
    scores.value[i] += choiceScores[i];
  }
  // 다음 문항 or 결과
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++;
    selected.value = answers.value[currentIndex.value] ?? null;
  } else {
    showResult.value = true;
  }
}

function resetSurvey() {
  currentIndex.value = 0;
  selected.value = null;
  answers.value = [];
  scores.value = [0, 0, 0, 0, 0];
  showResult.value = false;
}
</script>

<style scoped>
body {
  background: linear-gradient(to bottom, #2d2363 0%, #4b3c8a 40%, #b9afff 80%, #fff 100%);
}
</style>
