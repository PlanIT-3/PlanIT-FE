<template>
  <div class="summary-box">
    <div class="summary-inner">
      <h2 class="summay-title">
        <slot name="title"> 🔍 요약 한 마디 </slot>
      </h2>

      <p class="summary-text">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.summary-box {
  width: 346px;
  height: 191px;
  background: #dbeafe;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.summary-inner {
  width: 100%;
}

.summay-title {
  font-size: 16px;
  font-weight: 600;
  color: #12512a;
  margin-top: 1px;
}

.summary-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #18703a;
  white-space: pre-line; /*줄 바꿈 문자 표현 */
}
</style>
