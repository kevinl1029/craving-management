<template>
  <div class="orb-canvas-wrapper" ref="wrapper">
    <canvas ref="canvas" class="orb-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    mode?: 'idle' | 'breathe' | 'observe' | 'release';
    // For 'breathe' mode
    phase?: 'inhale' | 'exhale';
    // For 'observe' mode (0-100)
    intensity?: number;
    // For 'release' mode (0-1)
    progress?: number;
    opacity?: number; // 0-1
  }>(),
  {
    mode: 'idle',
    phase: 'exhale',
    intensity: 100,
    progress: 0,
    opacity: 1,
  }
);

const wrapper = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let time = 0;

// Configuration
const BASE_RADIUS = 100;
const COLOR_CORE = 'rgba(255, 255, 255, 0.9)';
const COLOR_GLOW = 'rgba(74, 157, 168, 0.4)';

// State for smooth transitions
const currentRadius = ref(BASE_RADIUS);
const targetRadius = ref(BASE_RADIUS);
const currentIntensity = ref(props.intensity);

// Particles for release mode
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}
let particles: Particle[] = [];

const resize = () => {
  if (!canvas.value || !wrapper.value) return;
  // Use clientWidth/Height to get the layout size, ignoring transforms (like scale(0))
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
  // Smoothly interpolate intensity
  currentIntensity.value += (props.intensity - currentIntensity.value) * 0.05;

  // Determine target radius based on mode
  if (props.mode === 'breathe') {
    // Tuned: 35% inflation (1.0 -> 1.35) to match Observe start
    targetRadius.value = props.phase === 'inhale' ? BASE_RADIUS * 1.35 : BASE_RADIUS * 1.0;
  } else if (props.mode === 'observe') {
    // Map intensity directly to scale (e.g. 135 -> 1.35, 50 -> 0.5)
    const scale = currentIntensity.value / 100;
    targetRadius.value = BASE_RADIUS * scale;
  } else if (props.mode === 'release') {
    // Shrink to 0 based on progress
    targetRadius.value = BASE_RADIUS * 0.5 * (1 - props.progress);
  } else {
    targetRadius.value = BASE_RADIUS;
  }

  // Smoothly interpolate radius
  // Tuned: Slower interpolation for more gradual breathing (0.05 -> 0.03)
  currentRadius.value += (targetRadius.value - currentRadius.value) * 0.03;
};

const drawOrb = (centerX: number, centerY: number) => {
  if (!ctx) return;

  const radius = currentRadius.value;
  
  // Wobble effect
  // We'll draw a shape by connecting points around a circle, 
  // modifying the radius with sine waves based on time and angle.
  ctx.beginPath();
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    
    // Noise components - TUNED: Slower and less amplitude
    const noise1 = Math.sin(angle * 3 + time * 0.8) * 2.5; // Slower time, less amp
    const noise2 = Math.cos(angle * 5 - time * 0.6) * 1.5; // Slower time, less amp
    const breathing = Math.sin(time * 0.5) * 1.5; // Slower breathing
    
    // Intensity wobble (more intense = more wobble)
    const wobbleFactor = props.mode === 'observe' ? (currentIntensity.value / 100) : 0.2;
    const dynamicWobble = (noise1 + noise2) * wobbleFactor;

    const r = radius + dynamicWobble + breathing;
    
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Apply global opacity - REMOVED (handled in loop)
  // ctx.globalAlpha = props.opacity ?? 1;

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
  // Re-stroke for glow definition
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.shadowBlur = 0; // Reset
  // ctx.globalAlpha = 1; // Reset alpha - REMOVED (handled by restore)
};

const spawnParticles = (centerX: number, centerY: number) => {
  if (props.mode !== 'release' || props.progress >= 1) return;
  
  // Breath cycle for release mode (approx 4s cycle)
  // We want particles to spawn only during the "exhale" part of this simulated cycle
  const releaseBreathCycle = Math.sin(time * 1.5); // ~4s period
  const isExhaling = releaseBreathCycle < 0; // Exhale phase
  
  if (!isExhaling) return;

  // Spawn rate increases with progress, but modulated by breath intensity
  const intensity = Math.abs(releaseBreathCycle); // 0 to 1 during exhale
  const spawnRate = (1 + Math.floor(props.progress * 8)) * intensity;
  
  for (let i = 0; i < spawnRate; i++) {
    if (Math.random() > 0.4) continue; // Don't spawn every frame
    
    const angle = Math.random() * Math.PI * 2;
    const r = currentRadius.value;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * (Math.random() * 2),
      vy: Math.sin(angle) * (Math.random() * 2) - 1, // Slight upward drift initially
      life: 1.0,
      maxLife: 1.0,
      size: Math.random() * 3 + 1
    });
  }
};

const drawParticles = () => {
  if (!ctx) return;
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= 0.01;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // Gravity
    
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
    ctx.fill();
  }
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
  
  if (props.mode === 'release') {
    spawnParticles(centerX, centerY);
    drawParticles();
  }
  
  // Apply opacity
  // In release mode, we fade out based on progress. In all modes, we respect props.opacity.
  const releaseOpacity = props.mode === 'release' ? (1 - props.progress) : 1;
  const globalOpacity = props.opacity ?? 1;
  const finalOpacity = releaseOpacity * globalOpacity;
  
  if (finalOpacity > 0.01) {
    ctx.save();
    ctx.globalAlpha = finalOpacity;
    drawOrb(centerX, centerY);
    ctx.restore();
  }

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
