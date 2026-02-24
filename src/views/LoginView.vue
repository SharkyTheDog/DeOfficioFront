<template>
  <div class="login-bg">
    <div class="login-overlay">
      <div class="login-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div class="login-card">
        <h1 class="login-title">Iniciar sesión</h1>
        <form @submit.prevent="handleLogin" class="login-form">
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="Correo electrónico"
            class="login-input"
          />
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="Contraseña"
            class="login-input"
          />
          <button type="submit" :disabled="loading" class="btn-login">
            {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
          </button>
        </form>
        <button class="btn-crear-cuenta" @click="router.push('/registro')">
          Crear cuenta
        </button>
        <div v-if="mensajeError" class="error-badge">
          {{ mensajeError }}
        </div>
        <div class="login-links">
          <a href="#" @click.prevent>Olvidé mi contraseña</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const mensajeError = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  mensajeError.value = '';
  
  try {
    const response = await axios.post('http://localhost:8080/api/usuarios/login', {
      email: email.value,
      pass_hash: password.value
    });

    const usuario = response.data;
    // Guardar usuario completo y el id por separado
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    if (usuario && usuario.id) {
      localStorage.setItem('userId', usuario.id);
      // Establecer header por defecto para axios
      try { axios.defaults.headers.common['X-User-Id'] = usuario.id; } catch(e) {}
    }

    // Redirigir siempre a /mis-pedidos después del login
    router.push('/mis-pedidos');
  } catch (error) {
    mensajeError.value = error.response?.data || 'Credenciales inválidas';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  min-height: 80vh;
  width: 100vw;
  background: #fdf3ec;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
}
.login-overlay {
  width: 100vw;
  min-height: 80vh;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-logo {
  margin-bottom: 30px;
  text-align: center;
}
.login-logo img {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
}
.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 36px 28px 28px 28px;
  max-width: 400px;
  width: 100%;
  min-width: 260px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.login-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #fc4a1a;
  margin-bottom: 22px;
  text-align: center;
  letter-spacing: 1px;
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
  align-items: stretch;
}
.login-input {
  width: 100%;
  min-width: 0;
  padding: 13px 14px;
  border: 1.5px solid #f7b733;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff8f0;
  color: #333;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
}
.login-input:focus {
  border-color: #fc4a1a;
}
.btn-login {
  width: 100%;
  min-width: 0;
  padding: 13px 0;
  background: linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(252,74,26,0.08);
  transition: background 0.2s;
  box-sizing: border-box;
  display: block;
}
.btn-login:hover {
  background: linear-gradient(90deg, #fc4a1a 0%, #f7b733 100%);
}
.btn-login:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
.error-badge {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px;
  border-radius: 8px;
  margin-top: 18px;
  text-align: center;
  font-size: 14px;
}
.login-links {
  margin-top: 22px;
  text-align: center;
  font-size: 15px;
}
.login-links a {
  color: #fc4a1a;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s;
}
.login-links a:hover {
  color: #f7b733;
}
</style>
<style scoped>
.btn-crear-cuenta {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 8px;
  padding: 12px 0;
  background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102,126,234,0.08);
  transition: background 0.2s;
  display: block;
}
.btn-crear-cuenta:hover {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
</style>