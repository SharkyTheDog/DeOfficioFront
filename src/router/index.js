import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// IMPORTANTE: Importamos la nueva vista que creaste
import ProyectosView from '../views/ProyectosView.vue' 
import LoginView from '../views/LoginView.vue'

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
  path: '/nuevo-pedido',
  name: 'nuevo-pedido',
  component: () => import('../views/CrearPedidoView.vue')
},
  ],
})
router.beforeEach((to, from, next) => {
  const estaLogueado = localStorage.getItem('usuarioLogueado');

  // 1. Si el usuario NO está logueado y NO va hacia el login o registro
  if (!estaLogueado && to.name !== 'login' && to.name !== 'registro') {
    next({ name: 'login' });
  } 
  // 2. Si ya está logueado e intenta ir al login, mándalo al inicio o proyectos
  else if (estaLogueado && to.name === 'login') {
    next({ name: 'proyectos' });
  }
  // 3. En cualquier otro caso, dejar pasar
  else {
    next();
  }
});
export default router