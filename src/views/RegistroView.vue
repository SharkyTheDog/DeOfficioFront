<script setup>
import { ref } from 'vue'
import axios from 'axios'

// El objeto coincide con tu modelo en Java y columnas en Supabase
const usuario = ref({
  nombres: '',    // Antes era Nombres
  apellidos: '',  // Antes era Apellidos
  email: '',
  pass_hash: '',  // Antes era Pass_hash
  rol: 'Cliente',
  telefono: ''
})

const mensaje = ref('')
const error = ref(false)

const registrar = async () => {
  try {
    const url = 'http://localhost:8080/api/usuarios/registro' 
    await axios.post(url, usuario.value)
    mensaje.value = "¡Registro exitoso! Ya puedes iniciar sesión."
    error.value = false
    // Limpiar campos
    usuario.value = { Nombres: '', Apellidos: '', Email: '', Pass_hash: '', Rol: 'Cliente', Telefono: '' }
  } catch (err) {
    mensaje.value = "Error al registrar: " + (err.response?.data || err.message)
    error.value = true
  }
}
</script>

<template>
  <div class="registro-container">
    <div class="form-card">
      <h2>Crear Cuenta</h2>
      <p>Completa tus datos para registrarte</p>

      <form @submit.prevent="registrar">
        <div class="row">
          <input v-model="usuario.nombres" placeholder="Nombres" required />
          <input v-model="usuario.apellidos" placeholder="Apellidos" required />
        </div>
        
        <input v-model="usuario.email" type="email" placeholder="Correo electrónico" required />
        <input v-model="usuario.pass_hash" type="password" placeholder="Contraseña" required />
        <input v-model="usuario.telefono" placeholder="Teléfono" />

        <label>Tipo de Usuario:</label>
        <select v-model="usuario.rol">
          <option value="Cliente">Busco Servicios</option>
          <option value="Profesional">Ofrezco Servicios</option>
        </select>

        <button type="submit" class="btn-primary">Registrarse</button>
      </form>

      <p v-if="mensaje" :class="['status-msg', { 'error': error }]">{{ mensaje }}</p>
    </div>
  </div>
</template>

<style scoped>
.registro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}
.form-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
.row { display: flex; gap: 10px; }
input, select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.status-msg { margin-top: 15px; text-align: center; font-weight: bold; }
.status-msg.error { color: red; }
</style>