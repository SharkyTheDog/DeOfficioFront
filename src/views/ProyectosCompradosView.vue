<template>
  <div class="proyectos-comprados">
    <h1>Proyectos Contratados</h1>
    <table v-if="proyectos.length" class="tabla-proyectos">
      <thead>
        <tr>
          <th>Pedido ID</th>
          <th>Título</th>
          <th>Cliente</th>
          <th>Email Cliente</th>
          <th>Monto Pagado</th>
          <th>Fecha Desbloqueo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proyecto in proyectos" :key="proyecto.pedido_id">
          <td>{{ proyecto.pedido_id }}</td>
          <td>{{ proyecto.pedido_titulo }}</td>
          <td>{{ proyecto.cliente_nombre }}</td>
          <td>{{ proyecto.cliente_email }}</td>
          <td>{{ proyecto.monto_pagado }}</td>
          <td>{{ proyecto.fecha_desbloqueo ? new Date(proyecto.fecha_desbloqueo).toLocaleString() : '' }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No tienes proyectos contratados aún.
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'ProyectosCompradosView',
  data() {
    return {
      proyectos: []
    };
  },
  async mounted() {
    try {
      // Obtener el usuario_id del usuario logueado
      const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
      const usuarioId = usuario?.id;
      if (!usuarioId) throw new Error('No se encontró el usuario logueado');
      // Llamada al backend para obtener los pedidos contratados usando la vista v_contactos_obreros
      const response = await api.get(`/api/supabase/table/v_contactos_obreros?usuario_id=eq.${usuarioId}`);
      this.proyectos = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    } catch (error) {
      console.error('Error al obtener proyectos contratados:', error);
    }
  }
};
</script>

<style scoped>
.proyectos-comprados {
  padding: 2rem;
}
.tabla-proyectos {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}
.tabla-proyectos th, .tabla-proyectos td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.tabla-proyectos th {
  background: #f5f5f5;
}
</style>
