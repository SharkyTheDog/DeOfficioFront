import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// IMPORTANTE: Importamos la nueva vista que creaste
import ProyectosView from '../views/ProyectosView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/proyectos', // Esta es la URL que verás en el navegador
      name: 'proyectos',
      component: ProyectosView // Este es el archivo ProyectosView.vue
    },
  ],
})

export default router