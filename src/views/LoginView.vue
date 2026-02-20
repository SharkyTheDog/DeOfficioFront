<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>¡Bienvenido de nuevo!</h1>
        <p>Ingresa a tu cuenta para gestionar tus proyectos</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-login">
          {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>

      <div v-if="mensajeError" class="error-badge">
        {{ mensajeError }}
      </div>

      <div class="login-footer">
        <p>¿No tienes una cuenta? <router-link to="/registro">Regístrate gratis</router-link></p>
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

    localStorage.setItem('usuarioLogueado', JSON.stringify(response.data));
    router.push('/proyectos');
  } catch (error) {
    mensajeError.value = error.response?.data || 'Credenciales inválidas';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  position: fixed; /* Esto hace que se superponga a todo */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999; /* Asegura que esté por encima de cualquier menú rebelde */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-header { text-align: center; margin-bottom: 30px; }
.login-header h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
.login-header p { color: #666; font-size: 14px; }

.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; color: #444; font-weight: 500; }

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover { background: #5a6fd6; }
.btn-login:disabled { background: #ccc; }

.error-badge {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.login-footer { margin-top: 25px; text-align: center; font-size: 14px; color: #666; }
.login-footer a { color: #667eea; text-decoration: none; font-weight: bold; }
</style>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>