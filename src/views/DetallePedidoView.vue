<template>
  <div class="detalle-pedido">
    <h1>Detalle del Pedido</h1>
    <div v-if="pedido">
      <p><strong>ID:</strong> {{ pedido.id }}</p>
      <p><strong>Título:</strong> {{ pedido.titulo }}</p>
      <p><strong>Descripción:</strong> {{ pedido.descripcion }}</p>
      <p><strong>Fecha de creación:</strong> {{ pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleString() : '' }}</p>
      <!-- No mostrar teléfono -->
      <div class="acciones">
        <button @click="comprarPedido">Comprar</button>
        <button @click="volver">Volver</button>
      </div>
    </div>
    <div v-else>Cargando pedido...</div>
  </div>
</template>

<script>
import api from '../services/api';
export default {
  name: 'DetallePedidoView',
  data() {
    return {
      pedido: null
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const response = await api.get(`/api/supabase/table/pedidos?id=eq.${id}`);
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      this.pedido = data[0] || null;
    } catch (error) {
      console.error('Error al obtener el pedido:', error);
    }
  },
  methods: {
    async comprarPedido() {
      // Aquí deberías hacer la lógica de compra (POST a tu backend)
      alert('Funcionalidad de compra pendiente de implementar');
    },
    volver() {
      this.$router.push({ name: 'buscar-pedidos' });
    }
  }
};
</script>

<style scoped>
.detalle-pedido { padding: 2rem; max-width: 600px; margin: auto; }
.acciones { margin-top: 2rem; display: flex; gap: 1rem; }
</style>
