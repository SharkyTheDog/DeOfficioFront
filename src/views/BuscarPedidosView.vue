<template>
  <div class="buscar-pedidos">
    <h1>Buscar Pedidos Disponibles</h1>
    <table v-if="pedidos.length" class="tabla-pedidos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidos" :key="pedido.id">
          <td>{{ pedido.id }}</td>
          <td>{{ pedido.titulo }}</td>
          <td>{{ pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleString() : '' }}</td>
          <td>
            <button @click="verDetalle(pedido.id)">Ver detalle</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>No hay pedidos disponibles.</div>
  </div>
</template>

<script>
import api from '../services/api';
export default {
  name: 'BuscarPedidosView',
  data() {
    return {
      pedidos: []
    };
  },
  async mounted() {
    try {
      // Traer pedidos ordenados de más nuevo a más viejo
      const response = await api.get('/api/supabase/table/pedidos?order=fecha_creacion.desc');
      this.pedidos = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  },
  methods: {
    verDetalle(id) {
      this.$router.push({ name: 'detalle-pedido', params: { id } });
    }
  }
};
</script>

<style scoped>
.buscar-pedidos { padding: 2rem; }
.tabla-pedidos { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
.tabla-pedidos th, .tabla-pedidos td { border: 1px solid #ddd; padding: 8px; text-align: center; }
.tabla-pedidos th { background: #f5f5f5; }
</style>
