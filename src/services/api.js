import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080', // La URL donde corre tu Spring Boot
  headers: {
    'Content-Type': 'application/json'
  }
})

// Si hay userId guardado, lo ponemos como header por defecto
try {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    api.defaults.headers.common['X-User-Id'] = storedUserId;
  }
} catch (e) {
  // localStorage puede fallar en entornos no-browser, ignoramos
}

export default api