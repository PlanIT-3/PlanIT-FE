<template>
  <div class="w-full h-full flex flex-col relative">
    <!-- 스크롤 가능한 전체 컨텐츠 -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <!-- 헤더 영역 -->
      <MainHeader class="relative z-10" />
      
      <!-- 메인 컨텐츠 영역 -->
      <div class="bg-transparent -mt-[100px] relative z-20 pb-20">
        <div class="px-6 pt-12 pb-4">
          <div class="flex flex-col items-center">
          <!-- 전체 자산 카드 -->
          <div class="h-[200px] w-[calc(100%-8px)] max-w-[500px] bg-white rounded-2xl shadow-lg p-5 flex items-center justify-around -mt-[7px] mb-6 relative z-20">
            <div class="flex flex-col justify-center items-start w-auto h-[132px] mr-4 pr-4 flex-shrink-0 min-w-0">
              <div class="text-black text-base font-semibold mb-1 text-left whitespace-nowrap">전체 자산</div>
              <div class="text-gray-600 text-sm mb-1 text-left whitespace-nowrap">총 7개 계좌 관리 중</div>
              <div class="text-black text-2xl font-bold mb-1 text-left whitespace-nowrap">3,015,000원</div>
              <div class="text-green-600 text-xs text-left whitespace-nowrap">전월 대비 +12.5%</div>
            </div>
            <div class="ml-6 w-56 h-56 flex items-center justify-center">
              <v-chart class="w-full h-full" :option="chartOption" autoresize />
            </div>
          </div>

          <!-- 목표 슬라이더 카드 -->
          <div class="h-[220px] w-[calc(100%-16px)] max-w-[380px] mb-6 bg-white rounded-2xl shadow-lg p-4 relative overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <router-link
                to="/goal/detail"
                class="flex items-center text-black text-sm font-semibold hover:text-indigo-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                나의 목표
              </router-link>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            
            <div class="goals-slider absolute top-[38px] left-0 w-full h-[171px] overflow-hidden">
              <div
                class="flex transition-transform duration-300 ease-in-out h-full"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
              >
                <!-- 첫 번째 목표 카드 -->
                <div class="min-w-full h-full flex">
                  <div class="w-full h-[170px] bg-white p-4 relative">
                    <div class="absolute left-4 top-4 w-[250px] h-[117px]">
                      <div class="flex items-center text-black text-xs font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                        자가용 구매하기
                      </div>
                    </div>

                    <div class="absolute right-4 top-6">
                      <div class="bg-green-500 rounded-full h-5 px-3 flex items-center justify-center">
                        <span class="text-white text-xs font-semibold">목표 달성 !</span>
                      </div>
                    </div>

                    <div class="absolute left-4 top-18 flex flex-wrap gap-1 text-xs">
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-green-500"></div>
                        <span class="text-gray-600">주거래 60%</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-green-600"></div>
                        <span class="text-gray-600">적금 40%</span>
                      </div>
                    </div>

                    <div class="absolute left-4 bottom-16 w-[calc(100%-32px)] h-3">
                      <div class="bg-gray-300 rounded-full h-3 w-full relative overflow-hidden">
                        <div class="bg-green-500 h-3 rounded-l-full absolute left-0" style="width: 60%"></div>
                        <div class="bg-green-600 h-3 rounded-r-full absolute" style="width: 40%; left: 60%"></div>
                      </div>
                    </div>

                    <div class="bg-green-50 rounded-lg h-10 w-[calc(100%-32px)] absolute left-4 bottom-4 p-2">
                      <div class="text-green-800 text-xs font-bold">예상 달성일: 2025-12-28</div>
                      <div class="text-green-600 text-xs">목표보다 199일 빠름</div>
                    </div>
                  </div>
                </div>

                <!-- 두 번째 목표 카드 -->
                <div class="min-w-full h-full flex">
                  <div class="w-full h-[170px] bg-white p-4 relative">
                    <div class="absolute left-4 top-4 w-[250px]">
                      <div class="flex items-center text-black text-xs font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        유럽 여행 자금
                      </div>
                      <div class="text-blue-600 text-xs mt-2 font-medium">진행 중 (75%)</div>
                    </div>

                    <div class="absolute right-4 top-6">
                      <div class="bg-blue-500 rounded-full h-5 px-3 flex items-center justify-center">
                        <span class="text-white text-xs font-semibold">75%</span>
                      </div>
                    </div>

                    <div class="absolute left-4 top-18 flex flex-wrap gap-1 text-xs">
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-blue-500"></div>
                        <span class="text-gray-600">주거래 40%</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-cyan-500"></div>
                        <span class="text-gray-600">적금 25%</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-purple-500"></div>
                        <span class="text-gray-600">투자 10%</span>
                      </div>
                    </div>

                    <div class="absolute left-4 bottom-16 w-[calc(100%-32px)] h-3">
                      <div class="bg-gray-300 rounded-full h-3 w-full relative overflow-hidden">
                        <div class="bg-blue-500 h-3 absolute left-0" style="width: 40%"></div>
                        <div class="bg-cyan-500 h-3 absolute" style="width: 25%; left: 40%"></div>
                        <div class="bg-purple-500 h-3 absolute" style="width: 10%; left: 65%"></div>
                      </div>
                    </div>

                    <div class="bg-blue-50 rounded-lg h-10 w-[calc(100%-32px)] absolute left-4 bottom-2 p-2">
                      <div class="text-blue-800 text-xs font-bold">예상 달성일: 2025-08-20</div>
                      <div class="text-blue-600 text-xs">1,500,000원 / 2,000,000원</div>
                    </div>
                  </div>
                </div>

                <!-- 세 번째 목표 카드 -->
                <div class="min-w-full h-full flex">
                  <div class="w-full h-[170px] bg-white p-4 relative">
                    <div class="absolute left-4 top-4 w-[250px]">
                      <div class="flex items-center text-black text-xs font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        비상 자금 마련
                      </div>
                      <div class="text-orange-600 text-xs mt-2 font-medium">진행 중 (45%)</div>
                    </div>

                    <div class="absolute right-4 top-6">
                      <div class="bg-orange-500 rounded-full h-5 px-3 flex items-center justify-center">
                        <span class="text-white text-xs font-semibold">45%</span>
                      </div>
                    </div>

                    <div class="absolute left-4 top-18 flex flex-wrap gap-1 text-xs">
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-orange-500"></div>
                        <span class="text-gray-600">비상금 30%</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-sm mr-1 bg-yellow-500"></div>
                        <span class="text-gray-600">예금 15%</span>
                      </div>
                    </div>

                    <div class="absolute left-4 bottom-16 w-[calc(100%-32px)] h-3">
                      <div class="bg-gray-300 rounded-full h-3 w-full relative overflow-hidden">
                        <div class="bg-orange-500 h-3 absolute left-0" style="width: 30%"></div>
                        <div class="bg-yellow-500 h-3 absolute" style="width: 15%; left: 30%"></div>
                      </div>
                    </div>

                    <div class="bg-orange-50 rounded-lg h-10 w-[calc(100%-32px)] absolute left-4 bottom-2 p-2">
                      <div class="text-orange-800 text-xs font-bold">예상 달성일: 2026-03-15</div>
                      <div class="text-orange-600 text-xs">4,500,000원 / 10,000,000원</div>
                    </div>
                  </div>
                </div>

                <!-- 목표 추가 버튼 -->
                <div class="min-w-full h-full flex">
                  <button
                    class="w-full h-[170px] bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 flex flex-col items-center justify-center group"
                  >
                    <div
                      class="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>

                    <div class="text-center">
                      <p
                        class="text-gray-600 group-hover:text-indigo-600 text-sm font-medium transition-colors duration-200"
                      >
                        새 목표 추가
                      </p>
                      <p class="text-gray-400 group-hover:text-indigo-400 text-xs mt-1 transition-colors duration-200">
                        목표를 설정하고 달성해보세요
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Slide Indicators -->
            <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                v-for="(slide, index) in 4"
                :key="index"
                @click="currentSlide = index"
                :class="[
                  'w-2 h-2 rounded-full transition-colors',
                  currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300',
                ]"
              ></button>
            </div>

            <!-- Navigation Arrows -->
            <button
              v-if="currentSlide > 0"
              @click="previousSlide"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-20"
            >
              <span class="text-gray-600">‹</span>
            </button>

            <button
              v-if="currentSlide < 3"
              @click="nextSlide"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-20"
            >
              <span class="text-gray-600">›</span>
            </button>
          </div>

          <!-- Investment Status Section -->
          <div class="h-auto w-[calc(100%-16px)] max-w-[380px] bg-white rounded-2xl shadow-lg p-5">
            <!-- Header -->
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <div class="text-indigo-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-gray-800 whitespace-nowrap">최근 투자 현황</h3>
              </div>
              <button class="text-xs text-indigo-600 font-medium whitespace-nowrap">전체보기</button>
            </div>

            <!-- Asset and ROI Summary -->
            <div class="flex justify-between items-baseline mb-3">
              <div class="min-w-0 flex-shrink-0">
                <p class="text-sm text-gray-500 whitespace-nowrap">총 투자 자산</p>
                <p class="text-xl font-bold whitespace-nowrap">12,450,000원</p>
              </div>
              <div class="text-right min-w-0 flex-shrink-0">
                <p class="text-sm text-gray-500 whitespace-nowrap">총 수익률</p>
                <p class="text-xl font-bold text-green-600 whitespace-nowrap">+8.2%</p>
              </div>
            </div>

            <!-- Time Period Toggle Buttons -->
            <div class="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1 mb-3">
              <button
                @click="selectPeriod('daily')"
                :class="[
                  'w-full py-1 text-xs rounded-md transition-colors duration-200',
                  selectedPeriod === 'daily' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
                ]"
              >
                일
              </button>
              <button
                @click="selectPeriod('weekly')"
                :class="[
                  'w-full py-1 text-xs rounded-md transition-colors duration-200',
                  selectedPeriod === 'weekly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
                ]"
              >
                주
              </button>
              <button
                @click="selectPeriod('monthly')"
                :class="[
                  'w-full py-1 text-xs rounded-md transition-colors duration-200',
                  selectedPeriod === 'monthly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
                ]"
              >
                월
              </button>
            </div>

            <!-- Investment Chart -->
            <div class="h-[150px]">
              <v-chart class="w-full h-full" :option="investmentChartOption" autoresize />
            </div>

            <!-- Quick Actions -->
            <div class="flex justify-between mt-4">
              <button
                class="flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg py-2 px-4 text-xs font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                투자 추가
              </button>
              <button
                class="flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg py-2 px-4 text-xs font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                분석 보기
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 하단 고정 내비게이션 -->
    <NavBar class="absolute bottom-0 left-0 right-0 z-30" />
  </div>
</template>

<script>
import { ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import headerBg from "@/assets/images/headerBackground.svg";
import logoSvg from "@/assets/images/Logo.svg";
import MainHeader from "@/components/common/MainHeader.vue";
import NavBar from "@/components/common/NavBar.vue";

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

export default {
  name: "MainView",
  components: {
    MainHeader,
    NavBar,
    VChart,
  },
  setup() {
    const currentSlide = ref(0);

    const nextSlide = () => {
      if (currentSlide.value < 3) {
        currentSlide.value++;
      }
    };

    const previousSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--;
      }
    };

    // Data for investment chart
    const selectedPeriod = ref("daily");
    const investmentData = {
      daily: {
        labels: ["-6일", "-5일", "-4일", "-3일", "-2일", "-1일", "오늘"],
        returns: [7.5, 7.8, 8.0, 7.9, 8.2, 8.1, 8.2],
        avgReturns: [7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.15],
      },
      weekly: {
        labels: ["-6주", "-5주", "-4주", "-3주", "-2주", "-1주", "이번주"],
        returns: [5.5, 6.2, 6.8, 7.0, 7.5, 8.0, 8.2],
        avgReturns: [5.8, 6.0, 6.5, 6.8, 7.2, 7.6, 7.9],
      },
      monthly: {
        labels: ["-6달", "-5달", "-4달", "-3달", "-2달", "-1달", "이번달"],
        returns: [2.1, 3.5, 4.0, 5.8, 6.5, 7.2, 8.2],
        avgReturns: [2.5, 3.0, 3.8, 4.9, 5.8, 6.8, 7.5],
      },
    };

    // ECharts option for investment chart
    const investmentChartOption = ref({});

    const selectPeriod = (period) => {
      selectedPeriod.value = period;
      updateInvestmentChart();
    };

    const updateInvestmentChart = () => {
      const data = investmentData[selectedPeriod.value];
      investmentChartOption.value = {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const date = params[0].axisValue;
            let result = `${date}<br/>`;
            params.forEach((item) => {
              result += `${item.seriesName}: ${item.value}%<br/>`;
            });
            return result;
          },
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "category", boundaryGap: false, data: data.labels, axisLabel: { fontSize: 10 } },
        yAxis: {
          type: "value",
          axisLabel: { formatter: "{value}%", fontSize: 10 },
          splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
        },
        series: [
          {
            name: "수익률",
            type: "line",
            smooth: true,
            data: data.returns,
            itemStyle: { color: "#3b82f6" },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
                  { offset: 1, color: "rgba(59, 130, 246, 0)" },
                ],
              },
            },
          },
          {
            name: "평균 수익률",
            type: "line",
            smooth: true,
            data: data.avgReturns,
            itemStyle: { color: "#10b981" },
            lineStyle: { type: "dashed" },
          },
        ],
      };
    };

    // Initial chart setup
    updateInvestmentChart();

    // 개선된 차트 옵션 - 계좌별 세분화
    const chartOption = ref({
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `목표 현황<br/>${params.name}: ${params.value}개 (${params.percent}%)`;
        },
        backgroundColor: "rgba(0,0,0,0.8)",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
          fontSize: 13,
        },
      },
      series: [
        {
          name: "목표 현황",
          type: "pie",
          radius: ["45%", "90%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 2,
            borderColor: "#fff",
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: "rgba(0, 0, 0, 0.1)",
          },
          label: {
            show: false,
          },
          data: [
            // 완료된 목표들 (계좌별 세분화)
            {
              value: 1,
              name: "자가용-주거래",
              itemStyle: { color: "#10b981" },
            },
            {
              value: 1,
              name: "자가용-적금",
              itemStyle: { color: "#059669" },
            },

            // 진행 중인 목표들 (계좌별 세분화)
            {
              value: 1,
              name: "여행-주거래",
              itemStyle: { color: "#3b82f6" },
            },
            {
              value: 1,
              name: "여행-적금",
              itemStyle: { color: "#06b6d4" },
            },
            {
              value: 1,
              name: "여행-투자",
              itemStyle: { color: "#8b5cf6" },
            },
            {
              value: 1,
              name: "비상-통장",
              itemStyle: { color: "#f59e0b" },
            },
            {
              value: 1,
              name: "비상-예금",
              itemStyle: { color: "#eab308" },
            },
          ],
          animationType: "scale",
          animationEasing: "elasticOut",
          animationDelay: function (idx) {
            return Math.random() * 200;
          },
        },
      ],
    });

    return {
      currentSlide,
      nextSlide,
      previousSlide,
      headerBg,
      logoSvg,
      chartOption,
      selectedPeriod,
      selectPeriod,
      investmentChartOption,
    };
  },
};
</script>