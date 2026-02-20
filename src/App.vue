<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter(); 
const usuario = ref(null);

const verificarSesion = () => {
  const data = localStorage.getItem('usuarioLogueado');
  usuario.value = data ? JSON.parse(data) : null;
};

const logout = () => {
  localStorage.removeItem('usuarioLogueado');
  usuario.value = null;
  router.push('/login');
};

onMounted(verificarSesion);
watch(() => route.path, verificarSesion);
</script>

<template>
  <nav v-if="usuario && route.name !== 'login' && route.name !== 'registro'" class="nav-minimal">
    <div class="nav-content">
      <div class="brand">CONSTRU<span>APP</span></div>

      <div class="nav-center">
        <router-link to="/" class="link">Inicio</router-link>
        <router-link to="/proyectos" class="link">Mis Proyectos</router-link>
        <router-link to="/nuevo-pedido" class="link">+ Nuevo Pedido</router-link>
      </div>

      <div class="nav-right">
        <span class="user-greeting">Hola, <b>{{ usuario.nombres }}</b></span>
        <button @click="logout" class="logout-minimal">Cerrar Sesión</button>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<style scoped>
.nav-minimal {
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 1.5rem;
  height: 65px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand { font-weight: 800; font-size: 1.1rem; color: #1a1a1a; letter-spacing: 1px; }
.brand span { color: #4eb783; }
.nav-center { display: flex; gap: 30px; }
.link {
  text-decoration: none;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 5px 0;
  border-bottom: 2px solid transparent;
}
.link:hover, .router-link-active { color: #000; border-bottom: 2px solid #000; }
.nav-right { display: flex; align-items: center; gap: 20px; }
.user-greeting { font-size: 0.85rem; color: #444; }
.logout-minimal {
  background: transparent;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}
.logout-minimal:hover { background: #f5f5f5; border-color: #999; }
</style>