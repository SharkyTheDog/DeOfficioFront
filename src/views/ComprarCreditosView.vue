<template>
  <div class="creditos-bg">
    <div class="creditos-card">
      <h2>Comprar Créditos</h2>
      <p class="desc">Elige un paquete de créditos para poder publicar como profesional.</p>
      <div v-if="cargando" class="loading">Cargando paquetes...</div>
      <div v-else>
        <div class="paquetes-list">
          <div v-for="p in paquetes" :key="p.id" class="paquete">
            <div class="paquete-info">
              <span class="creditos">{{ p.cantidad_cred }} créditos</span>
              <span class="precio">${{ p.precio_pesos }}</span>
            </div>
            <button class="btn-comprar" @click="comprar(p)">Comprar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const paquetes = ref([]);
const cargando = ref(false);

const cargarPaquetes = async () => {
  cargando.value = true;
  try {
    const res = await api.get('/api/supabase/table/paquetes_creditos');
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    paquetes.value = data.filter(p => p.activo);
  } catch (e) {
    paquetes.value = [];
  } finally {
    cargando.value = false;
  }
};

const comprar = (paquete) => {
  // Aquí iría la lógica de compra (integración con pago, etc.)
  alert(`Comprar ${paquete.cantidad_cred} créditos por $${paquete.precio_pesos}`);
};

onMounted(cargarPaquetes);
</script>

<style scoped>
.creditos-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #f7b733 0%, #fc4a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.creditos-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 36px 28px 28px 28px;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.creditos-card h2 {
  color: #fc4a1a;
  font-size: 2rem;
  margin-bottom: 12px;
}
.desc {
  color: #666;
  margin-bottom: 24px;
  text-align: center;
}
.loading {
  color: #fc4a1a;
  font-weight: 600;
}
.paquetes-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.paquete {
  background: #fff8f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(252,74,26,0.08);
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.paquete-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.creditos {
  font-size: 1.2rem;
  font-weight: 700;
  color: #764ba2;
}
.precio {
  font-size: 1.1rem;
  color: #fc4a1a;
  font-weight: 600;
}
.btn-comprar {
  padding: 10px 22px;
  background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-comprar:hover {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
</style>
