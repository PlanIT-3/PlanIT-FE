<template>
  <DefaultLayout>
    <div class="flex flex-col w-full pb-24">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ isEditMode ? '목표 수정하기' : '새로운 목표 만들기' }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ isEditMode ? '목표를 수정하고 관리해보세요' : '달성하고 싶은 목표를 설정해보세요' }}
        </p>
      </div>

      <!-- Progress Indicator -->
      <div v-if="!isEditMode" class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500">진행률</span>
          <span class="text-xs font-medium text-indigo-600">{{ progressPercentage }}%</span>
        </div>
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Form Sections with Card Style -->
      <div class="space-y-4">
        <!-- 기본 정보 카드 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
              <span class="text-sm font-bold text-indigo-600">1</span>
            </span>
            기본 정보
          </h2>

          <!-- 목표명 입력 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              어떤 목표를 이루고 싶으신가요?
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="goalName"
                @focus="focusField = 'goalName'"
                @blur="focusField = null; validateGoalName()"
                placeholder="예: 내 집 마련, 결혼 자금"
                :class="[
                  'w-full px-4 py-4 rounded-xl text-base transition-all duration-200',
                  'border-2 bg-gray-50 placeholder-gray-400',
                  focusField === 'goalName' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100',
                  goalNameError ? 'border-red-400 bg-red-50' : ''
                ]"
              />
              <transition name="fade">
                <span v-if="goalName.length > 0 && !goalNameError" class="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </transition>
            </div>
            <transition name="slide">
              <p v-if="goalNameError" class="mt-2 text-xs text-red-500 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ goalNameError }}
              </p>
            </transition>
          </div>

          <!-- 목표 금액 입력 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              목표 금액은 얼마인가요?
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="formattedGoalAmountInput"
                @input="handleAmountInput"
                @focus="focusField = 'goalAmount'"
                @blur="focusField = null; validateGoalAmount()"
                placeholder="0"
                :class="[
                  'w-full px-4 py-4 pr-12 rounded-xl text-base transition-all duration-200',
                  'border-2 bg-gray-50 placeholder-gray-400 text-right font-medium',
                  focusField === 'goalAmount' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100',
                  goalAmountError ? 'border-red-400 bg-red-50' : ''
                ]"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">원</span>
            </div>
            <transition name="slide">
              <div v-if="goalAmount > 0" class="mt-2 px-3 py-2 bg-indigo-50 rounded-lg">
                <p class="text-sm font-medium text-indigo-700">{{ convertToKoreanAmount(goalAmount) }}</p>
              </div>
            </transition>
            <transition name="slide">
              <p v-if="goalAmountError" class="mt-2 text-xs text-red-500 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ goalAmountError }}
              </p>
            </transition>
          </div>

          <!-- 목표 기간 선택 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              언제까지 달성하실 건가요?
            </label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1.5 font-medium">시작일</label>
                <input
                  type="date"
                  v-model="startDate"
                  :min="todayDate"
                  @focus="focusField = 'startDate'"
                  @blur="focusField = null; validateDates()"
                  :class="[
                    'w-full px-3 py-3 rounded-xl text-sm transition-all duration-200',
                    'border-2 bg-gray-50',
                    focusField === 'startDate' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100',
                    dateError ? 'border-red-400 bg-red-50' : ''
                  ]"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1.5 font-medium">종료일</label>
                <input
                  type="date"
                  v-model="endDate"
                  :min="startDate || todayDate"
                  @focus="focusField = 'endDate'"
                  @blur="focusField = null; validateDates()"
                  :class="[
                    'w-full px-3 py-3 rounded-xl text-sm transition-all duration-200',
                    'border-2 bg-gray-50',
                    focusField === 'endDate' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100',
                    dateError ? 'border-red-400 bg-red-50' : ''
                  ]"
                />
              </div>
            </div>
            <transition name="slide">
              <div v-if="startDate && endDate && !dateError" class="mt-3 flex items-center justify-between px-3 py-2.5 bg-green-50 rounded-lg">
                <span class="text-sm text-green-700">목표 달성 기간</span>
                <span class="text-sm font-semibold text-green-800">{{ calculatePeriod }}</span>
              </div>
            </transition>
            <transition name="slide">
              <p v-if="dateError" class="mt-2 text-xs text-red-500 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ dateError }}
              </p>
            </transition>
          </div>
        </div>

        <!-- 자산 배분 카드 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
              <span class="text-sm font-bold text-indigo-600">2</span>
            </span>
            자산 배분
          </h2>

          <!-- 할당 비율 슬라이더 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-4">
              예적금과 ISA 비율을 조절해주세요
            </label>
            
            <!-- 비율 표시 -->
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span class="text-sm font-medium text-gray-700">예적금</span>
                <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {{ depositRatio }}%
                </span>
              </div>
              <div class="flex items-center">
                <span class="mr-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  {{ isaRate }}%
                </span>
                <span class="text-sm font-medium text-gray-700">ISA</span>
                <div class="w-3 h-3 rounded-full bg-purple-500 ml-2"></div>
              </div>
            </div>

            <!-- 커스텀 슬라이더 -->
            <div class="relative mb-6">
              <!-- 배경 트랙 -->
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <!-- 예적금 영역 (파란색) -->
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-200 absolute left-0"
                  :style="{ width: `${depositRatio}%` }"
                ></div>
                <!-- ISA 영역 (보라색) -->
                <div 
                  class="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-200 absolute right-0"
                  :style="{ width: `${isaRate}%` }"
                ></div>
              </div>
              <!-- 실제 슬라이더 input (투명) -->
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model.number="depositRatio"
                @input="depositRatio = $event.target.value"
                @mousedown="isDragging = true"
                @mouseup="isDragging = false"
                @touchstart="isDragging = true"
                @touchend="isDragging = false"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                style="-webkit-appearance: none; -moz-appearance: none;"
              />
              <!-- 슬라이더 핸들 -->
              <div 
                class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 transition-all duration-200 pointer-events-none"
                :class="isDragging ? 'border-purple-600 scale-110' : 'border-purple-500'"
                :style="{ left: `calc(${depositRatio}% - 12px)` }"
              >
                <div class="absolute inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
              </div>
            </div>

            <!-- 금액 표시 카드 -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-blue-600">예적금</span>
                  <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-blue-900">{{ formattedDepositAmount }}</p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-purple-600">ISA</span>
                  <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-purple-900">{{ formattedIsaAmount }}</p>
              </div>
            </div>
          </div>

          <!-- 자산 할당 섹션 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              목표 달성에 사용할 자산을 선택해주세요
            </label>

            <!-- 할당된 자산이 있을 때 -->
            <div v-if="hasAnyAllocation" class="space-y-3 mb-4">
              <transition-group name="list" tag="div">
                <!-- 예적금 할당 카드 -->
                <div 
                  v-if="depositAccounts.length" 
                  key="deposit-card"
                  class="bg-blue-50 rounded-xl p-4 border border-blue-100"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-blue-900">예적금 계좌</p>
                        <p class="text-xs text-blue-600">{{ depositAccounts.length }}개 계좌</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold text-blue-700">{{ formatWan(depositTotal) }}</span>
                  </div>
                  <div class="space-y-2">
                    <div 
                      v-for="acc in depositAccounts" 
                      :key="acc.accountId"
                      class="flex items-center justify-between py-2 px-3 bg-white rounded-lg"
                    >
                      <span class="text-sm text-gray-700">{{ acc.accountName }}</span>
                      <span class="text-sm font-medium text-gray-900">{{ formatWan(acc.myAmount ?? 0) }}</span>
                    </div>
                  </div>
                </div>

                <!-- ISA 할당 카드 -->
                <div 
                  v-if="isaProducts.length" 
                  key="isa-card"
                  class="bg-purple-50 rounded-xl p-4 border border-purple-100"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-purple-900">ISA 계좌</p>
                        <p class="text-xs text-purple-600">{{ isaProducts.length }}개 상품</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold text-purple-700">{{ formatWan(isaTotal) }}</span>
                  </div>
                  <div class="space-y-2">
                    <div 
                      v-for="p in isaProducts" 
                      :key="p.memberProductId"
                      class="flex items-center justify-between py-2 px-3 bg-white rounded-lg"
                    >
                      <div class="flex items-center">
                        <span class="text-sm text-gray-700">{{ p.itemName }}</span>
                        <span v-if="p.quantity > 1" class="ml-1 text-xs text-gray-500">×{{ p.quantity }}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">
                        {{ formatWan((p.presentAmount ?? 0) * (p.quantity ?? 1)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>

            <!-- 자산 추가 버튼 -->
            <button
              @click="handleOpenModal"
              class="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-200 group"
            >
              <div class="flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mr-3 transition-colors">
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-500 group-hover:text-indigo-600">
                  {{ hasAnyAllocation ? '자산 추가하기' : '자산 선택하기' }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- 완료 버튼 섹션 - 편집 모드에서만 표시 -->
        <div v-if="isEditMode" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md mt-4">
          <button
            :disabled="!canComplete || isLoading"
            @click="handleCompleteGoal"
            :class="[
              'w-full py-4 rounded-xl font-semibold text-base transition-all duration-200',
              canComplete && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="!isLoading">
              {{ isEditMode ? '목표 수정 완료' : '목표 설정 완료' }}
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              처리 중...
            </span>
          </button>
          
          <!-- 완료 조건 안내 -->
          <div v-if="!canComplete" class="mt-3 text-center">
            <p class="text-xs text-gray-500">
              {{ getIncompleteMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- 모달 -->
      <AddRegisterModal
        :isOpen="showModal"
        @close="showModal = false"
        :goalId="goalId"
        :isaAmount="isaAmount"
        :depositAmount="depositAmount"
      />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import AddRegisterModal from "./AddRegisterModal.vue";
import Api from "@/api/objectApi";
import isaApi from "@/api/isaApi";

const route = useRoute();
const router = useRouter();

// State
const showModal = ref(false);
const goalId = ref(null);
const goalName = ref("");
const goalAmount = ref(0); // 원 단위
const depositRatio = ref(50);
const startDate = ref("");
const endDate = ref("");
const isaProducts = ref([]);
const depositAccounts = ref([]);
const focusField = ref(null);
const isLoading = ref(false);
const isDragging = ref(false);

// Validation errors
const goalNameError = ref("");
const goalAmountError = ref("");
const dateError = ref("");

// Computed
const isaRate = computed(() => 100 - depositRatio.value);
const depositAmount = computed(() => Math.round(goalAmount.value * (depositRatio.value / 100)));
const isaAmount = computed(() => Math.round(goalAmount.value * (isaRate.value / 100)));
const todayDate = computed(() => new Date().toISOString().split('T')[0]);
const isEditMode = computed(() => !!goalId.value);

// Formatted amounts
const formattedGoalAmountInput = ref("");
const formattedDepositAmount = computed(() => depositAmount.value.toLocaleString('ko-KR') + '원');
const formattedIsaAmount = computed(() => isaAmount.value.toLocaleString('ko-KR') + '원');

// Progress calculation
const progressPercentage = computed(() => {
  let progress = 0;
  if (goalName.value) progress += 25;
  if (goalAmount.value > 0) progress += 25;
  if (startDate.value && endDate.value) progress += 25;
  if (hasAnyAllocation.value) progress += 25;
  return progress;
});

// Period calculation
const calculatePeriod = computed(() => {
  if (!startDate.value || !endDate.value) return "";
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (days < 30) return `${days}일`;
  if (days < 365) return `약 ${Math.round(days / 30)}개월`;
  return `약 ${Math.round(days / 365)}년 ${Math.round((days % 365) / 30)}개월`;
});

// 합계(원 )
const isaTotal = computed(() =>
  isaProducts.value.reduce((sum, p) => sum + Number(p.presentAmount ?? 0) * Number(p.quantity ?? 1), 0)
);

const depositTotal = computed(() => depositAccounts.value.reduce((sum, acc) => sum + Number(acc.myAmount ?? 0), 0));

// 원 → 만원(절삭) 함수 →
const toWanFloor = (n) => Math.round(Number(n ?? 0) / 10000);
const formatWan = (n) => toWanFloor(n).toLocaleString("ko-KR") + "만원";

// 완료 버튼 활성 조건 1: 목표 이름 , 금액 , 날짜 (중복 제거됨)

const fetchIsaChecked = async (gid) => {
  try {
    const res = await isaApi.getIsaProductsForEdit(gid);
    const list = res?.data ?? res;
    const rows = Array.isArray(list?.data) ? list.data : Array.isArray(list) ? list : [];

    // checked=true만 필터 → 화면에서 쓰는 필드로 매핑
    // 1) 체크된 것만
    const onlyChecked = rows.filter((r) => !!r.checked);
    // 2) 같은 memberProductId 중복 제거
    const deduped = dedupeBy(onlyChecked, "memberProductId");
    // 3) 화면 모델로 매핑
    isaProducts.value = deduped.map((r) => ({
      memberProductId: toNum(r.memberProductId),
      itemName: r.itemName ?? "",
      presentAmount: toNum(r.presentAmount) || 0,
      quantity: toNum(r.quantity) || 0,
    }));
  } catch (e) {
    console.error("ISA 목록불러오기 실패:", e);
    isaProducts.value = [];
  }
};

// Validation computed
const hasAnyAllocation = computed(() => 
  (isaProducts.value?.length || 0) > 0 || (depositAccounts.value?.length || 0) > 0
);
const requiredFilled = computed(() =>
  String(goalName.value || "").trim().length > 0 &&
  Number(goalAmount.value) > 0 &&
  !!startDate.value &&
  !!endDate.value
);
const canComplete = computed(() => requiredFilled.value && hasAnyAllocation.value);

const getIncompleteMessage = computed(() => {
  if (!goalName.value) return "목표명을 입력해주세요";
  if (!goalAmount.value) return "목표 금액을 입력해주세요";
  if (!startDate.value || !endDate.value) return "목표 기간을 설정해주세요";
  if (!hasAnyAllocation.value) return "자산을 할당해주세요";
  return "";
});

// Methods
const handleAmountInput = (event) => {
  const value = event.target.value.replace(/[^0-9]/g, '');
  goalAmount.value = Number(value);
  formattedGoalAmountInput.value = value ? Number(value).toLocaleString('ko-KR') : '';
};

const convertToKoreanAmount = (amount) => {
  if (!amount) return "";
  const 억 = Math.floor(amount / 100000000);
  const 만 = Math.floor((amount % 100000000) / 10000);
  const parts = [];
  if (억 > 0) parts.push(`${억}억`);
  if (만 > 0) parts.push(`${만}만`);
  if (parts.length === 0) parts.push(`${amount}원`);
  else parts.push("원");
  return parts.join(" ");
};

// Validation methods
const validateGoalName = () => {
  if (!goalName.value?.trim()) {
    goalNameError.value = "목표명을 입력해주세요";
    return false;
  }
  if (goalName.value.length < 2) {
    goalNameError.value = "목표명은 2자 이상 입력해주세요";
    return false;
  }
  goalNameError.value = "";
  return true;
};

const validateGoalAmount = () => {
  if (!goalAmount.value || goalAmount.value <= 0) {
    goalAmountError.value = "목표 금액을 입력해주세요";
    return false;
  }
  if (goalAmount.value < 10000) {
    goalAmountError.value = "목표 금액은 1만원 이상이어야 합니다";
    return false;
  }
  goalAmountError.value = "";
  return true;
};

const validateDates = () => {
  if (!startDate.value || !endDate.value) {
    dateError.value = "시작일과 종료일을 모두 선택해주세요";
    return false;
  }
  if (new Date(endDate.value) <= new Date(startDate.value)) {
    dateError.value = "종료일은 시작일보다 이후여야 합니다";
    return false;
  }
  dateError.value = "";
  return true;
};
// API methods
const fetchGoalDetails = async (id) => {
  try {
    isLoading.value = true;
    const res = await Api.getGoal(id);
    const body = res && typeof res === "object" && "data" in res ? res.data : res;
    const goalData = body?.data ?? body;
    if (!goalData) return;

    goalName.value = goalData.goalName;
    goalAmount.value = Number(goalData.targetAmount ?? 0);
    formattedGoalAmountInput.value = goalAmount.value.toLocaleString('ko-KR');
    depositRatio.value =
      typeof goalData.depositRate === "number" ? goalData.depositRate : 100 - Number(goalData.isaRate ?? 50);

    // 날짜 처리 (배열 또는 문자열 모두 대응)
    if (Array.isArray(goalData.startDate)) {
      const [year, month, day] = goalData.startDate;
      startDate.value = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } else {
      startDate.value = (goalData.startDate ?? "").toString().slice(0, 10);
    }

    if (Array.isArray(goalData.endDate)) {
      const [year, month, day] = goalData.endDate;
      endDate.value = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } else {
      endDate.value = (goalData.endDate ?? "").toString().slice(0, 10);
    }
    //예적금
    const rawDeposits = Array.isArray(goalData.depositAccounts) ? goalData.depositAccounts : [];
    const seen = new Set();
    const minimalDeposits = [];
    for (const acc of rawDeposits) {
      const key = acc.accountNumber || acc.accountName;
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      minimalDeposits.push({
        id: acc.memberAccountId ?? acc.accountId ?? key,
        accountNumber: acc.accountNumber ?? "",
        accountName: acc.accountName ?? "",
        myAmount: acc.myAmount ?? 0,
      });
    }
    depositAccounts.value = minimalDeposits;
    await fetchIsaChecked(id);
  } catch (error) {
    console.error("목표 상세 정보 불러오기 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

// 라우터 쿼리 감지()
watch(
  () => route.query.goalId,
  async (newId) => {
    const id = Number(newId ?? localStorage.getItem("currentGoalId"));
    if (id && !Number.isNaN(id)) {
      goalId.value = id;
      await fetchGoalDetails(id);
    }
  },
  { immediate: true } //처음 마운트 될 때 바로 한번 실행
);

// + 버튼: 생성 모드면 먼저 생성, 편집 모드면 할당 비율 저장 후 모달 오픈
const handleOpenModal = async () => {
  if (!isEditMode.value) {
    const payload = {
      goalName: goalName.value,
      targetAmount: Number(goalAmount.value),
      startDate: startDate.value,
      endDate: endDate.value,
      depositRate: Number(depositRatio.value),
      isaRate: Number(100 - depositRatio.value),
    };
    
    try {
      isLoading.value = true;
      const response = await Api.createNewGoal(payload);
      if (response?.status === 200 || response?.status === 201 || response?.data?.status === "OK") {
        const createdGoalId = response.data?.data?.goalId ?? response.data?.goalId;
        goalId.value = createdGoalId;
        localStorage.setItem("currentGoalId", createdGoalId);
        router.replace({ query: { goalId: createdGoalId } });
        showModal.value = true;
      }
    } catch (e) {
      console.error("목표 생성 실패:", e);
      alert("목표 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      isLoading.value = false;
    }
  } else {
    // 편집 모드: 현재 설정된 할당 비율을 먼저 저장
    try {
      const payload = {
        goalName: goalName.value,
        targetAmount: Number(goalAmount.value),
        startDate: startDate.value,
        endDate: endDate.value,
        depositRate: Number(depositRatio.value),
        isaRate: Number(100 - depositRatio.value),
      };
      
      await Api.updateGoal(goalId.value, payload);
      console.log("할당 비율 저장 완료:", `예적금 ${depositRatio.value}%, ISA ${100 - depositRatio.value}%`);
    } catch (e) {
      console.error("할당 비율 저장 실패:", e);
    }
    
    showModal.value = true;
  }
};

const handleCompleteGoal = async () => {
  if (!validateGoalName() || !validateGoalAmount() || !validateDates()) {
    return;
  }

  try {
    isLoading.value = true;
    const payload = {
      goalName: goalName.value,
      targetAmount: Number(goalAmount.value),
      startDate: startDate.value,
      endDate: endDate.value,
      depositRate: Number(depositRatio.value),
      isaRate: Number(100 - depositRatio.value),
    };

    const res = await Api.updateGoal(goalId.value, payload);
    const ok = res?.status === 200 || res?.status === 201 || res?.data?.status === "OK";
    
    if (ok) {
      localStorage.removeItem("currentGoalId");
      router.push({ path: "/goal" });
    } else {
      console.warn("update 응답 확인:", res);
      alert("저장 결과를 확인할 수 없습니다.");
    }
  } catch (e) {
    console.error("목표 수정 실패:", e);
    alert("목표 저장에 실패했습니다. 다시 시도해주세요.");
  } finally {
    isLoading.value = false;
  }
};

//중복이슈
// --- helpers: 숫자화 & 중복제거 ---
const toNum = (v) => Number(v ?? 0);

/** rows 배열에서 key(기본 memberProductId) 기준으로 중복 제거 */
function dedupeBy(rows, key = "memberProductId") {
  const m = new Map();
  for (const r of rows) {
    const id = toNum(r?.[key]);
    if (!m.has(id)) m.set(id, r);
  }
  return Array.from(m.values());
}
</script>

<style scoped>
/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
