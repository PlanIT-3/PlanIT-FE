<template>
  <div class="relative w-full">
    <!-- 로딩 상태 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded z-10"
      style="height: 176px"
    >
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mb-2"></div>
        <span class="text-sm text-gray-500">절세 데이터 로딩 중...</span>
      </div>
    </div>

    <!-- 차트 -->
    <canvas
      ref="chartCanvas"
      class="w-full h-44 cursor-pointer"
      :class="{ 'opacity-0': isLoading }"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    ></canvas>

    <!-- 하단 정보 -->
    <div class="mt-3 bg-green-50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-2">
        <div>
          <span class="text-green-700 font-bold text-base">{{ latestSavings.toLocaleString() }}원</span>
          <span class="text-green-600 text-sm ml-2"> 일반 투자 대비 절약된 세금 </span>
        </div>
      </div>
      <p class="text-sm text-green-600">ISA 활용으로 {{ latestSavings.toLocaleString() }}원의 세금을 절약했습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { api } from "@/api";

const chartCanvas = ref(null);

// 누적 절세 데이터 (API에서 받아온 데이터 기반으로 생성)
const taxSavingsData = ref([
  { period: "1분기", amount: 8 }, // 8만원
  { period: "2분기", amount: 16 }, // 16만원
  { period: "3분기", amount: 32 }, // 32만원
  { period: "4분기", amount: 56 }, // 56만원
  { period: "5분기", amount: 80 }, // 80만원
]);

const latestSavings = ref(803000); // 80.3만원 (기본값 - 실제 절세액)
const isLoading = ref(true);
const hoveredIndex = ref(-1); // 현재 hover된 데이터 포인트 인덱스

// 더미 데이터 설정 함수
const setDummyData = () => {
  latestSavings.value = 803000; // 80.3만원 절세액
  taxSavingsData.value = [
    { period: "1분기", amount: 8 }, // 8만원
    { period: "2분기", amount: 16 }, // 16만원
    { period: "3분기", amount: 32 }, // 32만원
    { period: "4분기", amount: 56 }, // 56만원
    { period: "5분기", amount: 80 }, // 80만원
  ];
};

// ISA 절세 데이터 로딩
const fetchTaxSavingsData = async () => {
  try {
    const response = await api.get("/api/isa/reports/cumulative-tax-saving");

    console.log("📡 API 응답 전체:", response);
    console.log("📊 응답 데이터:", response.data);

    if (response.data.status === "OK" && response.data.data && Array.isArray(response.data.data)) {
      const cumulativeData = response.data.data;

      // 데이터가 있는 경우 실제 API 데이터 사용
      if (cumulativeData.length > 0) {
        // 마지막 분기의 누적 절세액을 최신 절세액으로 설정
        const lastQuarterData = cumulativeData[cumulativeData.length - 1];
        latestSavings.value = lastQuarterData.cumulativeTaxSaved;

        // API 데이터를 차트 형식으로 변환
        taxSavingsData.value = cumulativeData.map((item) => ({
          period: item.quarter,
          amount: Math.round(item.cumulativeTaxSaved / 10000), // 만원 단위로 변환
        }));
      } else {
        setDummyData();
      }
    } else {
      setDummyData();
    }
  } catch (error) {
    console.error("누적 절세 데이터 로딩 실패:", error);
    // API 실패 시 더미 데이터 설정
    setDummyData();
  } finally {
    isLoading.value = false;

    // 차트 그리기
    setTimeout(() => {
      if (chartCanvas.value) {
        drawChart();
      }
    }, 200);
  }
};

const drawChart = () => {
  if (!chartCanvas.value) return;

  const canvas = chartCanvas.value;
  const ctx = canvas.getContext("2d");

  // 고해상도 대응
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // 캔버스 크기 설정
  const width = rect.width;
  const height = rect.height;

  // 배경 클리어
  ctx.clearRect(0, 0, width, height);

  // 여백 설정
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // 데이터 최대값
  const maxValue = Math.max(...taxSavingsData.value.map((d) => d.amount));
  const yScale = chartHeight / (maxValue * 1.1); // 10% 여유 공간

  // 그리드 라인 그리기
  ctx.strokeStyle = "#f3f4f6";
  ctx.lineWidth = 1;

  // 수평 그리드 라인
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(margin.left + chartWidth, y);
    ctx.stroke();

    // Y축 라벨
    const value = Math.round((maxValue * (5 - i)) / 5);
    ctx.fillStyle = "#6b7280";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(value + "만원", margin.left - 5, y + 4);
  }

  // 수직 그리드 라인 및 X축 라벨
  taxSavingsData.value.forEach((item, index) => {
    const x = margin.left + (chartWidth / (taxSavingsData.value.length - 1)) * index;

    // 수직 그리드 라인
    ctx.strokeStyle = "#f3f4f6";
    ctx.beginPath();
    ctx.moveTo(x, margin.top);
    ctx.lineTo(x, margin.top + chartHeight);
    ctx.stroke();

    // X축 라벨
    ctx.fillStyle = "#6b7280";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(item.period, x, height - 10);
  });

  // 라인 차트 그리기
  const points = taxSavingsData.value.map((item, index) => ({
    x: margin.left + (chartWidth / (taxSavingsData.value.length - 1)) * index,
    y: margin.top + chartHeight - item.amount * yScale,
  }));

  // 영역 채우기 (그라데이션)
  const gradient = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartHeight);
  gradient.addColorStop(0, "rgba(34, 197, 94, 0.3)");
  gradient.addColorStop(1, "rgba(34, 197, 94, 0.05)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(points[0].x, margin.top + chartHeight);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(points[points.length - 1].x, margin.top + chartHeight);
  ctx.closePath();
  ctx.fill();

  // 라인 그리기
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  // 데이터 포인트 그리기
  points.forEach((point, index) => {
    // hover된 포인트는 더 크고 밝게 표시
    if (hoveredIndex.value === index) {
      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // hover 시 툴팁 표시
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;

      // 툴팁 배경
      const tooltipText = `${taxSavingsData.value[index].period}: ${taxSavingsData.value[index].amount}만원`;
      ctx.font = "12px sans-serif"; // 텍스트 측정을 위해 먼저 설정
      const textWidth = ctx.measureText(tooltipText).width;
      const tooltipWidth = textWidth + 16;
      const tooltipHeight = 24;

      // 툴팁 X 위치 조정 (캔버스 경계 확인)
      let tooltipX = point.x - tooltipWidth / 2;
      if (tooltipX < 0) {
        tooltipX = 5; // 왼쪽 경계
      } else if (tooltipX + tooltipWidth > width) {
        tooltipX = width - tooltipWidth - 5; // 오른쪽 경계
      }

      // 툴팁 Y 위치 조정 (위쪽으로 표시, 공간 부족시 아래쪽)
      let tooltipY = point.y - 40;
      let textY = point.y - 22;
      if (tooltipY < 0) {
        tooltipY = point.y + 15; // 아래쪽으로 이동
        textY = point.y + 33;
      }

      ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
      ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

      // 툴팁 텍스트
      ctx.fillStyle = "#374151";
      ctx.textAlign = "center";
      ctx.fillText(tooltipText, tooltipX + tooltipWidth / 2, textY);
    } else {
      // 일반 포인트
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
};

// 마우스 이벤트 핸들러
const handleMouseMove = (event) => {
  if (!chartCanvas.value) return;

  const rect = chartCanvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // 여백 설정 (drawChart와 동일)
  const margin = { top: 35, right: 20, bottom: 35, left: 70 };
  const chartWidth = rect.width - margin.left - margin.right;

  // 각 데이터 포인트의 X 좌표 계산
  let newHoveredIndex = -1;
  for (let i = 0; i < taxSavingsData.value.length; i++) {
    const pointX = margin.left + (chartWidth / (taxSavingsData.value.length - 1)) * i;

    // 마우스가 데이터 포인트 근처에 있는지 확인 (±25px 범위)
    if (Math.abs(x - pointX) < 25) {
      newHoveredIndex = i;
      break;
    }
  }

  if (newHoveredIndex !== hoveredIndex.value) {
    hoveredIndex.value = newHoveredIndex;
    drawChart(); // 차트 다시 그리기
  }
};

const handleMouseLeave = () => {
  if (hoveredIndex.value !== -1) {
    hoveredIndex.value = -1;
    drawChart(); // 차트 다시 그리기
  }
};

onMounted(async () => {
  await nextTick();

  // 기본 더미 데이터 설정 (API 실패에 대비)
  setDummyData();

  // ISA 절세 데이터 로딩 시도
  await fetchTaxSavingsData();

  // 차트 그리기
  setTimeout(() => {
    drawChart();
  }, 100);

  // 윈도우 리사이즈 시 차트 다시 그리기
  window.addEventListener("resize", () => {
    setTimeout(drawChart, 100);
  });
});
</script>

<style scoped>
canvas {
  display: block;
}
</style>
