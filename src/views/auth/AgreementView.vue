<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <div class="flex items-center p-4 pt-12">
      <button @click="$router.go(-1)" class="p-2 -ml-2">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    </div>

    <!-- Title -->
    <div class="px-6 pb-6">
      <h1 class="text-2xl font-bold text-gray-900">약관 동의</h1>
    </div>

    <!-- Terms Content -->
    <div class="flex-1 px-6 pb-6">
      <!-- PlanIT Usage Agreement -->
      <div class="bg-gray-100 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <span class="text-base font-medium text-gray-900">planIT 사용 설명서</span>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>

      <!-- Terms Sections -->
      <div class="space-y-4">
        <!-- Section 1: 필수 이용 약관 -->
        <div class="border-b border-gray-200 pb-4">
          <div class="flex items-center mb-3">
            <div
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3',
                terms.essential.all ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
              ]"
              @click="toggleAllEssential"
            >
              <svg v-if="terms.essential.all" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-base font-medium text-gray-900">필수 이용 약관</span>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="space-y-2 ml-9">
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.essential.service ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('essential', 'service')"
                >
                  <svg
                    v-if="terms.essential.service"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">서비스 이용약관</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.essential.privacy ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('essential', 'privacy')"
                >
                  <svg
                    v-if="terms.essential.privacy"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">개인정보 처리방침</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Section 2: 금융 서비스 약관 -->
        <div class="border-b border-gray-200 pb-4">
          <div class="flex items-center mb-3">
            <div
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3',
                terms.financial.all ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
              ]"
              @click="toggleAllFinancial"
            >
              <svg v-if="terms.financial.all" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-base font-medium text-gray-900">금융 서비스 약관</span>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="space-y-2 ml-9">
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.financial.info ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('financial', 'info')"
                >
                  <svg v-if="terms.financial.info" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">금융정보 이용 동의서</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.financial.investment ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('financial', 'investment')"
                >
                  <svg
                    v-if="terms.financial.investment"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">투자정보 제공 서비스 약관</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.financial.thirdParty ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('financial', 'thirdParty')"
                >
                  <svg
                    v-if="terms.financial.thirdParty"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">제3자 서비스 연동 약관</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.financial.ai ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('financial', 'ai')"
                >
                  <svg v-if="terms.financial.ai" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">AI 서비스 이용약관</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Section 3: 선택 약관 -->
        <div class="border-b border-gray-200 pb-4">
          <div class="flex items-center mb-3">
            <div
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3',
                terms.optional.all ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
              ]"
              @click="toggleAllOptional"
            >
              <svg v-if="terms.optional.all" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-base font-medium text-gray-900">선택 약관</span>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="space-y-2 ml-9">
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center mr-3 cursor-pointer',
                    terms.optional.marketing ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white',
                  ]"
                  @click="toggleTerm('optional', 'marketing')"
                >
                  <svg
                    v-if="terms.optional.marketing"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">마케팅 정보 수신 동의</span>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <Button @click="handleAgree" :disabled="!canProceed || isProcessing" label="완료"></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/base/Button.vue";

const router = useRouter();
const isProcessing = ref(false);

// 약관 동의 상태 관리
const terms = reactive({
  essential: {
    all: false,
    service: false,
    privacy: false,
  },
  financial: {
    all: false,
    info: false,
    investment: false,
    thirdParty: false,
    ai: false,
  },
  optional: {
    all: false,
    marketing: false,
  },
});

// 필수 약관이 모두 동의되었는지 확인
const canProceed = computed(() => {
  return (
    terms.essential.service &&
    terms.essential.privacy &&
    terms.financial.info &&
    terms.financial.investment &&
    terms.financial.thirdParty &&
    terms.financial.ai
  );
});

// 개별 약관 토글
const toggleTerm = (category, term) => {
  terms[category][term] = !terms[category][term];
  updateAllStatus(category);
};

// 카테고리별 전체 선택/해제
const toggleAllEssential = () => {
  const newValue = !terms.essential.all;
  terms.essential.all = newValue;
  terms.essential.service = newValue;
  terms.essential.privacy = newValue;
};

const toggleAllFinancial = () => {
  const newValue = !terms.financial.all;
  terms.financial.all = newValue;
  terms.financial.info = newValue;
  terms.financial.investment = newValue;
  terms.financial.thirdParty = newValue;
  terms.financial.ai = newValue;
};

const toggleAllOptional = () => {
  const newValue = !terms.optional.all;
  terms.optional.all = newValue;
  terms.optional.marketing = newValue;
};

// 카테고리별 전체 선택 상태 업데이트
const updateAllStatus = (category) => {
  if (category === "essential") {
    terms.essential.all = terms.essential.service && terms.essential.privacy;
  } else if (category === "financial") {
    terms.financial.all =
      terms.financial.info && terms.financial.investment && terms.financial.thirdParty && terms.financial.ai;
  } else if (category === "optional") {
    terms.optional.all = terms.optional.marketing;
  }
};

// 약관 동의 완료 처리
const handleAgree = () => {
  if (canProceed.value && !isProcessing.value) {
    isProcessing.value = true;
    console.log("Terms agreed", terms);
    // 약관 동의 정보를 서버에 전송하거나 로컬 스토리지에 저장
    alert("회원가입이 완료되었습니다.");
    router.push("/login");
  }
};
</script>
