<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표명</div>
        <input
          type="text"
          v-model="goalName"
          placeholder="목표명을 입력하세요."
          class="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border-none placeholder-gray-400"
        />
      </div>
      <br />
      <!-- 목표 금액 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표 금액</div>
        <input
          type="number"
          v-model.number="goalAmount"
          placeholder="금액을 입력하세요."
          class="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border-none placeholder-gray-400"
        />
      </div>
      <br />
      <!-- 목표 기간 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표 기간</div>
        <div class="flex gap-2 items-center">
          <div class="flex flex-col items-start flex-1">
            <span class="text-xs text-gray-400 mb-1">start</span>
            <input
              type="date"
              v-model="startDate"
              class="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border-none"
            />
          </div>
          <div class="flex flex-col items-start flex-1">
            <span class="text-xs text-gray-400 mb-1">end</span>
            <input
              type="date"
              v-model="endDate"
              class="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border-none"
            />
          </div>
        </div>
      </div>
      <br />
      <!-- 할당 비율 설정 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">할당 비율 설정</div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-gray-500">예적금</span>
          <input type="range" min="0" max="100" v-model.number="depositRatio" class="flex-1 accent-purple-400" />
          <span class="text-xs text-gray-500">ISA</span>
        </div>
        <div class="flex justify-between text-xs text-gray-400">
          <span>{{ formattedDepositAmount }}원</span>
          <span>{{ formattedIsaAmount }}원</span>
        </div>
      </div>
      <br />
      <!-- 합당할 자산 -->
      <div class="w-full">
        <div class="font-bold text-gray-800 mb-1">할당할 자산</div>
        <div
          class="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50"
        >
          <span class="text-gray-400 text-sm mb-2">할당할 자산이 없습니다.</span>
          <button
            @click="saveGoalAndOpenModal"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-400 hover:bg-gray-100"
          >
            +
          </button>
          <AddRegisterModal
            :isOpen="showModal"
            @close="showModal = false"
            :depositAmount="depositAmount"
            :isaAmount="isaAmount"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, resolveDirective } from "vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import AddRegisterModal from "./AddRegisterModal.vue";
import Api from "@/api/objectApi";

// v-model 변수
const showModal = ref(false);

// goal에 저장 할 값들
const goalName = ref(""); //목표명
const goalAmount = ref(0); // 목표 금액
const depositRatio = ref(50); // 예적금 비율 (0~100, 기본 50%)
const isaRate = computed(() => 100 - depositRatio.value); // isa 비율
const startDate = ref("");
const endDate = ref("");

//계산 값들
const depositAmount = computed(() => Math.round(goalAmount.value * (depositRatio.value / 100)));
const isaAmount = computed(() => Math.round(goalAmount.value * (1 - depositRatio.value / 100)));
const formattedDepositAmount = computed(() => depositAmount.value.toLocaleString());
const formattedIsaAmount = computed(() => isaAmount.value.toLocaleString());

//api
const saveGoalAndOpenModal = async () => {
  const goalData = {
    goalName: goalName.value,
    targetAmount: goalAmount.value,
    startDate: startDate.value,
    endDate: endDate.value,
    depositRate: depositRatio.value,
    isaRate: isaRate.value,
  };

  try {
    const response = await Api.createNewGoal(goalData);
    console.log(response);
    if (response.status === 200) {
      const createdGoal = response.data.data;
      localStorage.setItem("currentGoalId", createdGoal.goalId);
      console.log("Goal created successfully with ID ", createdGoal.goalId);
      showModal.value = true;
    }
  } catch (error) {
    console.error("Failed to create goal:", error);
    alert(" 목표 생성에 실패했습니다. 다시 시도해주세요 ");
  }
};
</script>
