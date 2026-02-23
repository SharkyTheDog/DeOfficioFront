<template>
  <div class="container">
    <div class="form-card">
      <h2>{{ isEditing ? 'Editar Pedido' : 'Publicar Nuevo Pedido' }}</h2>
      <p class="subtitle">Describe lo que necesitas para tu proyecto de hogar</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Título del Pedido</label>
          <input v-model="pedido.titulo" type="text" placeholder="Ej: Pintar fachada de casa" required />
        </div>

        <div class="row">
          <div class="form-group">
            <label>Ubicación</label>
            <input v-model="pedido.ubicacion" type="text" placeholder="Ciudad o Barrio" required />
          </div>
          <div class="form-group">
            <label>Teléfono de Contacto</label>
            <input v-model="pedido.telefono_cont" type="text" placeholder="+54 9..." required />
          </div>
        </div>

        <div class="form-group">
          <label>Presupuesto Estimado ($)</label>
          <input v-model="pedido.presupuesto_e" type="number" placeholder="Monto aproximado" required />
        </div>

        <div class="form-group">
          <label>Categoría</label>
          <select v-model="pedido.categoria_id" required>
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Descripción detallada</label>
          <textarea v-model="pedido.descripcion" rows="4" placeholder="Cuéntanos más detalles del trabajo..."></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="enviando">
          {{ enviando ? (isEditing ? 'Guardando...' : 'Publicando...') : (isEditing ? 'Guardar cambios' : 'Publicar Pedido') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const enviando = ref(false);

// Obtenemos los datos del usuario logueado para sacar su ID
const usuarioData = JSON.parse(localStorage.getItem('usuarioLogueado'));

  const pedido = ref({
    cliente_id: usuarioData?.id, // Se asigna automáticamente
    titulo: '',
    descripcion: '',
    ubicacion: '',
    telefono_cont: '',
    presupuesto_e: null,
    estado: 'Pendiente', // Estado inicial por defecto
    categoria_id: null
  });

  const categorias = ref([]);
  const isEditing = ref(false);
  const editId = ref(null);

  onMounted(async () => {
    try {
      const res = await api.get('/api/supabase/table/categorias');
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      categorias.value = data.map(c => ({ id: String(c.id ?? c.Id), nombre: c.nombre_categoria ?? c.nombre }));
    } catch (e) {
      console.error('No se pudieron cargar las categorias:', e);
    }

    // Si venimos a editar, cargamos pedido desde localStorage
    try {
      const editRaw = localStorage.getItem('pedidoEdit');
      if (editRaw) {
        const e = JSON.parse(editRaw);
        editId.value = e.id;
        isEditing.value = true;
        // Mapear campos al objeto pedido (categoria_id como string para el select)
        pedido.value = {
          cliente_id: e.cliente_id ?? e.clienteId ?? e.user_id,
          titulo: e.titulo || '',
          descripcion: e.descripcion || '',
          ubicacion: e.ubicacion || '',
          telefono_cont: e.telefono_contacto || e.telefono_cont || e.telefono || '',
          presupuesto_e: e.presupuesto_estimado || e.presupuesto || null,
          estado: e.estado || 'Pendiente',
          categoria_id: e.categoria_id != null ? String(e.categoria_id) : (e.categoriaId != null ? String(e.categoriaId) : null)
        };
        console.log('DEBUG: categorias cargadas:', categorias.value);
        console.log('DEBUG: pedido precargado.categoria_id =', pedido.value.categoria_id);
      }
    } catch (e) {
      console.error('No se pudo cargar pedido para editar:', e);
    }
  });

const handleSubmit = async () => {
  const sesion = localStorage.getItem('usuarioLogueado');
  if (!sesion) {
    alert("No se encontró una sesión activa.");
    return;
  }

  const usuario = JSON.parse(sesion);
  
  // LOG DE SEGURIDAD: Mira la consola del navegador (F12) al hacer clic
  console.log("Datos del usuario logueado:", usuario);

  // Aseguramos cliente_id tomando primero usuario.id y como fallback localStorage.userId
  const userId = usuario.id || localStorage.getItem('userId');
  pedido.value.cliente_id = userId;

  // Construimos el payload con las claves que el backend espera
  const payload = {
    cliente_id: pedido.value.cliente_id,
    categoria_id: pedido.value.categoria_id,
    titulo: pedido.value.titulo,
    descripcion: pedido.value.descripcion,
    ubicacion: pedido.value.ubicacion,
    telefono_contacto: pedido.value.telefono_cont,
    presupuesto_estimado: pedido.value.presupuesto_e,
    estado: pedido.value.estado
  };

  console.log("Objeto que se envía a Java:", JSON.stringify(payload));

  enviando.value = true;
  try {
    if (isEditing.value && editId.value) {
      // PATCH
      await api.patch(`/api/pedidos/${editId.value}`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
      // limpiar estado de edición
      localStorage.removeItem('pedidoEdit');
      alert('¡Pedido actualizado con éxito!');
      router.push('/mis-pedidos');
    } else {
      const response = await api.post('/api/pedidos/crear', payload);
      alert('¡Pedido publicado con éxito!');
      router.push('/mis-pedidos');
    }
  } catch (error) {
    console.error("Error al enviar:", error.response?.data || error.message);
    alert("Error: " + (error.response?.data || "No se pudo conectar con el servidor"));
  } finally {
    enviando.value = false;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}
.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 600px;
}
h2 { margin-bottom: 5px; color: #1a1a1a; }
.subtitle { color: #666; font-size: 0.9rem; margin-bottom: 25px; }

.form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

label { font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: #444; }
input, textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
}
input:focus, textarea:focus { outline: none; border-color: #4eb783; }

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit:hover { background: #333; }
.btn-submit:disabled { background: #ccc; }
</style>