<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categorias = ref([])
const cargando = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const url = 'http://localhost:8080/api/supabase/table/Categorias?schema=appContruccion'
    const response = await axios.get(url)
    // Guardamos los datos en nuestra variable reactiva
    categorias.value = response.data
  } catch (err) {
    console.error("Error:", err)
    error.value = "No se pudieron cargar las categorías."
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <div class="proyectos-container">
    <header class="header">
      <h1>Explorar Categorías</h1>
      <p>Selecciona un oficio para ver los profesionales disponibles</p>
    </header>

    <div v-if="cargando" class="loader">Cargando oficios...</div>

    <div v-else-if="error" class="error-card">{{ error }}</div>

    <div v-else class="grid">
      <div v-for="cat in categorias" :key="cat.id" class="categoria-card">
        <div class="icon-box">
          🛠️
        </div>
        <h3>{{ cat.Nombre_Cate }}</h3>
        <p>Especialistas en {{ cat.Nombre_Cate.toLowerCase() }} listos para ayudarte.</p>
        <button class="btn-explorar">Ver Profesionales</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.proyectos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.categoria-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0;
}

.categoria-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  border-color: #42b883;
}

.icon-box {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.categoria-card h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.categoria-card p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.btn-explorar {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-explorar:hover {
  background-color: #33a06f;
}

.loader {
  text-align: center;
  font-size: 1.2rem;
  color: #42b883;
}
</style>