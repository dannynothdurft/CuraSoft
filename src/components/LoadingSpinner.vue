<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">GO.VITAL</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ff6f61;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  font-size: 25px;
  color: #ff6f61;
  font-family: 'BebasNeue';
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
