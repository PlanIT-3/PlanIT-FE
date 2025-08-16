<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 목표명 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표명</div>
        <input
          type="text"
          v-model="goalName"
          placeholder="목표명을 입력하세요."
          class="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border-none placeholder-gray-400"
        />
      </div>

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

      <!-- 할당할 자산 -->
      <div class="w-full">
        <div class="font-bold text-gray-800 mb-1">할당할 자산</div>

        <!-- 배정 있음 -->
        <div v-if="isaProducts.length || depositAccounts.length" class="space-y-3">
          <!-- 예적금 카드 -->
          <div v-if="depositAccounts.length" class="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-blue-900">예적금 계좌 할당</div>
              <div class="text-xs text-blue-700">합계 {{ formatWan(depositTotal) }}</div>
            </div>
            <ul class="mt-2 text-xs text-blue-800 space-y-1">
              <li v-for="acc in depositAccounts" :key="acc.accountId" class="leading-5">
                <span class="font-medium">{{ acc.accountName }}</span>
                <!-- <span v-if="acc.bankName" class="text-blue-600"> · {{ acc.bankName }}</span> -->
                <span class="ml-1">— {{ formatWan(acc.myAmount ?? 0) }}</span>
              </li>
            </ul>
          </div>

          <!-- ISA 카드 -->
          <div v-if="isaProducts.length" class="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-blue-900">ISA 계좌 할당</div>
              <div class="text-xs text-blue-700">합계 {{ formatWan(isaTotal) }}</div>
            </div>
            <ul class="mt-2 text-xs text-blue-800 space-y-1">
              <li v-for="p in isaProducts" :key="p.memberProductId" class="leading-5">
                <span class="font-medium">{{ p.itemName }}</span>
                <span v-if="p.quantity"> × {{ p.quantity }}</span>
                <span class="ml-1">{{ formatWan((p.presentAmount ?? 0) * (p.quantity ?? 1)) }}</span>
              </li>
            </ul>
          </div>

          <!-- 추가 배정 버튼 -->
          <div class="flex justify-center">
            <button
              @click="handleOpenModal"
              class="mt-1 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-400 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        <!-- 배정 없음(빈 상태) -->
        <div
          v-else
          class="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50"
        >
          <span class="text-gray-400 text-sm mb-2">할당할 자산이 없습니다.</span>
          <button
            @click="handleOpenModal"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-400 hover:bg-gray-100"
          >
            +
          </button>
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

      <!-- 완료 버튼: goalId가 있을 때만 노출 -->
      <div v-if="isEditMode" class="mt-6 pb-24">
        <button
          class="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canComplete"
          @click="handleCompleteGoal"
        >
          목표 설정 완료
        </button>
      </div>
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

const showModal = ref(false);
const goalId = ref(null);
const goalName = ref("");
const goalAmount = ref(0); // 원 단위
const depositRatio = ref(50);
const startDate = ref("");
const endDate = ref("");
const isaProducts = ref([]);
const depositAccounts = ref([]);

const isaRate = computed(() => 100 - depositRatio.value);
// 분배 금액 - 원 단위
const depositAmount = computed(() => Math.round(goalAmount.value * (depositRatio.value / 100)));
const isaAmount = computed(() => Math.round(goalAmount.value * (isaRate.value / 100)));
const formattedDepositAmount = computed(() => depositAmount.value.toLocaleString());
const formattedIsaAmount = computed(() => isaAmount.value.toLocaleString());

// 편집 모드 여부
const isEditMode = computed(() => !!goalId.value);

// 합계(원 )
const isaTotal = computed(() =>
  isaProducts.value.reduce((sum, p) => sum + Number(p.presentAmount ?? 0) * Number(p.quantity ?? 1), 0)
);

const depositTotal = computed(() => depositAccounts.value.reduce((sum, acc) => sum + Number(acc.myAmount ?? 0), 0));

// 원 → 만원(절삭) 함수 →
const toWanFloor = (n) => Math.floor(Number(n ?? 0) / 10000);
const formatWan = (n) => toWanFloor(n).toLocaleString("ko-KR") + "만원";

// 완료 버튼 활성 조건 1: 목표 이름 , 금액 , 날짜
const requiredFilled = computed(
  () =>
    String(goalName.value || "").trim().length > 0 &&
    Number(goalAmount.value) > 0 &&
    !!startDate.value &&
    !!endDate.value
);

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

//완료 버튼 활성 조건 2 : isa 나 예적금 할당하기
const hasAnyAllocation = computed(
  () => (isaProducts.value?.length || 0) > 0 || (depositAccounts.value?.length || 0) > 0
);

// 완료버튼 활성
const canComplete = computed(() => requiredFilled.value && hasAnyAllocation.value);

//ISA  할당 후 edit 페이지 돌아올 때 get api 데이터받아오기
const fetchGoalDetails = async (id) => {
  try {
    const res = await Api.getGoal(id);
    const body = res && typeof res === "object" && "data" in res ? res.data : res;
    const goalData = body?.data ?? body;
    if (!goalData) return;

    goalName.value = goalData.goalName;
    goalAmount.value = Number(goalData.targetAmount ?? 0);
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

// + 버튼: 생성 모드면 먼저 생성, 편집 모드면 모달만 오픈
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
    }
  } else {
    showModal.value = true;
  }
};

// 완료 버튼: 기본 필드 업데이트 후 이동
const handleCompleteGoal = async () => {
  try {
    const payload = {
      goalName: goalName.value,
      targetAmount: Number(goalAmount.value),
      startDate: startDate.value,
      endDate: endDate.value,
      depositRate: Number(depositRatio.value),
      isaRate: Number(100 - depositRatio.value),
    };

    const res = await Api.saveGoal(goalId.value, payload);
    const ok = res?.status === 200 || res?.status === 201 || res?.data?.status === "OK";
    if (ok) {
      alert("목표가 저장되었습니다.");
      localStorage.removeItem("currentGoalId");
      router.push({ path: "/goal" });
    } else {
      console.warn("update 응답 확인:", res);
      alert("저장 결과를 확인할 수 없습니다.");
    }
  } catch (e) {
    console.error("목표 수정 실패:", e);
    alert("목표 저장에 실패했습니다. 다시 시도해주세요.");
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
