<template>
  <Header />
  <div class="flex-1 flex flex-col items-center">
    <div class="absolute left-0 right-0 w-full bg-white rounded-t-3xl rounded-b-3xl shadow-lg px-6 pt-12 pb-8 flex flex-col justify-start items-center z-10" style="top: 108px; height: calc(100vh - 108px);">
      <!-- 목표명 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표명</div>
        <input type="text" placeholder="목표명을 입력하세요." class="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border-none placeholder-gray-400" />
      </div>
      <br>
      <!-- 목표 금액 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표 금액</div>
        <input type="number" placeholder="금액을 입력하세요." class="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border-none placeholder-gray-400" />
      </div>
      <br>
      <!-- 목표 기간 -->
       
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">목표 기간</div>
        <div class="flex gap-2 items-center">
          <div class="flex flex-col items-start flex-1">
            <span class="text-xs text-gray-400 mb-1">start</span>
            <input type="date" class="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border-none" />
          </div>
          <div class="flex flex-col items-start flex-1">
            <span class="text-xs text-gray-400 mb-1">end</span>
            <input type="date" class="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border-none" />
          </div>
        </div>
      </div>
      <br>
      <!-- 합당 비율 설정 -->
      <div class="w-full mb-4">
        <div class="font-bold text-gray-800 mb-1">합당 비율 설정</div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-gray-500">예적금</span>
          <input type="range" min="0" max="100" value="40" class="flex-1 accent-purple-400" />
          <span class="text-xs text-gray-500">ISA</span>
        </div>
        <div class="flex justify-between text-xs text-gray-400">
          <span>2,000만원</span>
          <span>3,000만원</span>
        </div>
      </div>
      <br>
      <!-- 합당할 자산 -->
      <div class="w-full">
        <div class="font-bold text-gray-800 mb-1">합당할 자산</div>
        <div class="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <span class="text-gray-400 text-sm mb-2">합당할 자산이 없습니다.</span>
          <button class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-400 hover:bg-gray-100">+</button>
        </div>
      </div>

      
      
    </div>
    
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import RebalanceCard from '@/components/goal/RebalanceCard.vue';
</script>