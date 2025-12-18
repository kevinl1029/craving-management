<template>
  <div class="orb-canvas-wrapper" ref="wrapper">
    <canvas ref="canvas" class="orb-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const wrapper = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let time = 0;

// Configuration
const BASE_RADIUS = 60; // Slightly smaller for the placeholder
const COLOR_CORE = 'rgba(255, 255, 255, 0.9)';
const COLOR_GLOW = 'rgba(74, 157, 168, 0.4)';

// State for smooth transitions
const currentRadius = ref(BASE_RADIUS);
const targetRadius = ref(BASE_RADIUS);

const resize = () => {
  if (!canvas.value || !wrapper.value) return;
  const width = wrapper.value.clientWidth;
  const height = wrapper.value.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  
  canvas.value.width = width * dpr;
  canvas.value.height = height * dpr;
  
  if (ctx) ctx.scale(dpr, dpr);
  
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;
};

const updateState = () => {
  // Simple autonomous breathing cycle
  // ~4 second cycle (similar to real app default)
  const breathCycle = Math.sin(time * 1.5); 
  
  // Map sine wave (-1 to 1) to a radius multiplier (1.0 to 1.35)
  // inhale (positive) -> expand, exhale (negative) -> contract
  const scale = 1.0 + (breathCycle + 1) * 0.175; // Maps -1..1 to 1.0..1.35
  
  targetRadius.value = BASE_RADIUS * scale;

  // Smoothly interpolate radius
  currentRadius.value += (targetRadius.value - currentRadius.value) * 0.05;
};

const drawOrb = (centerX: number, centerY: number) => {
  if (!ctx) return;

  const radius = currentRadius.value;
  
  // Wobble effect
  ctx.beginPath();
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    
    // Noise components
    const noise1 = Math.sin(angle * 3 + time * 0.8) * 2.5;
    const noise2 = Math.cos(angle * 5 - time * 0.6) * 1.5;
    const breathing = Math.sin(time * 0.5) * 1.5;
    
    // Scale wobble with radius (more intense when expanded)
    const wobbleScale = (currentRadius.value / BASE_RADIUS) * 0.2;
    const dynamicWobble = (noise1 + noise2) * wobbleScale;

    const r = radius + dynamicWobble + breathing;
    
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient fill
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
  gradient.addColorStop(0, COLOR_CORE);
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(74, 157, 168, 0)');

  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Glow
  ctx.shadowBlur = 30;
  ctx.shadowColor = COLOR_GLOW;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.shadowBlur = 0; // Reset
};

const loop = () => {
  if (!ctx || !canvas.value) return;
  
  const width = canvas.value.width / (window.devicePixelRatio || 1);
  const height = canvas.value.height / (window.devicePixelRatio || 1);
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, width, height);
  
  time += 0.02;
  
  updateState();
  
  drawOrb(centerX, centerY);

  animationFrameId = requestAnimationFrame(loop);
};

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    loop();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.orb-canvas-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-canvas {
  width: 100%;
  height: 100%;
}
</style>
