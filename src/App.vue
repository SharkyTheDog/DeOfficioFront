<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink> | 
      <RouterLink to="/proyectos">Mis Proyectos</RouterLink>
    </nav>
  </header>

  <main class="contenido-principal">
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
}
.contenido-principal {
  padding: 0 2rem;
}
a {
  text-decoration: none;
  color: #42b883;
  font-weight: bold;
}
.router-link-active {
  color: #35495e; /* Color diferente cuando estás en esa página */
}
</style>
