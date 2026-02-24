<template>
  <div class="landing-bg">
    <div class="landing-overlay">
      <div class="landing-header">
        <img src="/logo.png" alt="Logo" class="landing-logo" />
        <h1>¡Bienvenido a AppConstrucción!</h1>
        <p class="landing-desc">
          La plataforma donde clientes y profesionales de la construcción se conectan para hacer realidad sus proyectos. Publica tu pedido o encuentra trabajo como profesional.
        </p>
      </div>
      <div class="landing-actions">
        <button class="landing-btn" @click="goLogin">Ingresar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goLogin() {
  router.push('/login');
}
</script>

<style scoped>
.landing-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #f7b733 0%, #fc4a1a 100%), url('/public/bg-login.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.landing-overlay {
  width: 100vw;
  min-height: 100vh;
  background: rgba(255,255,255,0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.landing-header {
  text-align: center;
  margin-bottom: 40px;
}
.landing-logo {
  width: 120px;
  margin-bottom: 18px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
}
.landing-header h1 {
  font-size: 2.2rem;
  color: #fc4a1a;
  margin-bottom: 12px;
  font-weight: 800;
}
.landing-desc {
  font-size: 1.15rem;
  color: #444;
  margin-bottom: 0;
}
.landing-actions {
  display: flex;
  justify-content: center;
}
.landing-btn {
  padding: 16px 40px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%);
  box-shadow: 0 2px 8px rgba(252,74,26,0.08);
  transition: background 0.2s, transform 0.2s;
}
.landing-btn:hover {
  background: linear-gradient(90deg, #fc4a1a 0%, #f7b733 100%);
  transform: translateY(-2px) scale(1.04);
}
</style>
