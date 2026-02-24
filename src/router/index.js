import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import HomeView from '../views/HomeView.vue'
import ProyectosView from '../views/ProyectosView.vue'
import LoginView from '../views/LoginView.vue'
import MisPedidosView from '../views/MisPedidosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/proyectos', // Esta es la URL que verás en el navegador
      name: 'proyectos',
      component: ProyectosView // Este es el archivo ProyectosView.vue
    },
    {
      path: '/mis-pedidos',
      name: 'mis-pedidos',
      component: MisPedidosView
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue')
    },
    {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/comprar-creditos',
    name: 'comprar-creditos',
    component: () => import('../views/ComprarCreditosView.vue')
  },
  {
    path: '/nuevo-pedido',
    name: 'nuevo-pedido',
    component: () => import('../views/CrearPedidoView.vue')
  },
  ],
})
router.beforeEach((to, from, next) => {
  const estaLogueado = localStorage.getItem('usuarioLogueado');

  // Permitir acceso libre a landing, login y registro
  if (['landing', 'login', 'registro'].includes(to.name)) {
    next();
    return;
  }

  // Si el usuario NO está logueado y va a otra ruta, redirigir a landing
  if (!estaLogueado) {
    next({ name: 'landing' });
  } 
  // Si ya está logueado e intenta ir al login, mándalo a mis-pedidos
  else if (estaLogueado && to.name === 'login') {
    next({ name: 'mis-pedidos' });
  }
  else {
    next();
  }
});
export default router