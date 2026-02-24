<template>
	<div class="container">
		<div v-if="usuario && usuario.rol === 'Profesional'">
			<div class="header">
				<h2>Panel Profesional</h2>
			</div>
			<div class="info-pro">
				<p>Bienvenido, {{ usuario.nombres }}. Aquí pronto verás tus oportunidades y postulaciones.</p>
				<p>Por ahora, este panel es exclusivo para clientes que publican pedidos.</p>
			</div>
		</div>
		<div v-else>
			<div class="header">
				<h2>Mis Pedidos</h2>
				<div>
					<button @click="nuevoPedido" class="btn-new">Nuevo Pedido</button>
					<button @click="refresh" class="btn-refresh">Refrescar</button>
					<label style="margin-left:12px">Auto-refresh:</label>
					<input type="checkbox" v-model="autoRefresh" />
					<label style="margin-left:8px">Interval (s):</label>
					<input type="number" v-model.number="refreshIntervalSec" min="5" style="width:70px" />
				</div>
			</div>
			<div v-if="cargando">Cargando pedidos...</div>
			<div v-else>
				<table class="pedidos-table">
					<thead>
						<tr>
							<th>Categoría</th>
							<th>Título</th>
							<th>Ubicación</th>
							<th>Teléfono</th>
							<th>Presupuesto</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="p in pagedPedidos" :key="p.id">
							<td>{{ categoriaNombre(p.categoria_id) }}</td>
							<td>{{ p.titulo }}</td>
							<td>{{ p.ubicacion }}</td>
							<td>{{ p.telefono_contacto }}</td>
							<td>{{ p.presupuesto_estimado }}</td>
							<td>{{ p.estado }}</td>
							<td>
								<button @click="startEdit(p)" class="btn-edit">Editar</button>
							</td>
						</tr>
						<tr v-if="pedidos.length === 0">
							<td colspan="6">No hay pedidos todavía.</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination">
					<button @click="prevPage" :disabled="page===1">Anterior</button>
					<span>Página {{ page }} de {{ totalPages }}</span>
					<button @click="nextPage" :disabled="page===totalPages">Siguiente</button>
					<label style="margin-left:12px">Tamaño:</label>
					<select v-model.number="pageSize">
						<option :value="5">5</option>
						<option :value="10">10</option>
						<option :value="20">20</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const pedidos = ref([]);
const categorias = ref([]);
const cargando = ref(false);
const router = useRouter();
const usuario = ref(null);

onMounted(() => {
	const data = localStorage.getItem('usuarioLogueado');
	usuario.value = data ? JSON.parse(data) : null;
});

// Pagination and auto-refresh
const page = ref(1);
const pageSize = ref(10);
const autoRefresh = ref(false);
const refreshIntervalSec = ref(30);
let timer = null;

const cargarCategorias = async () => {
	try {
		const res = await api.get('/api/supabase/table/categorias');
		const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
		categorias.value = data.map(c => ({ id: String(c.id ?? c.Id), nombre: c.nombre_categoria ?? c.nombre }));
	} catch (e) {
		console.error('No se pudieron cargar las categorias:', e);
		categorias.value = [];
	}
};

const cargarPedidos = async () => {
	cargando.value = true;
	try {
		const user = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
		const userId = user.id || localStorage.getItem('userId');
		if (!userId) {
			pedidos.value = [];
			return;
		}
		const res = await api.get(`/api/pedidos/mios`, { params: { userId } });
		const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
		pedidos.value = data;
		// reset to first page if needed
		if (page.value > totalPages.value) page.value = 1;
	} catch (e) {
		console.error('Error cargando pedidos:', e);
		pedidos.value = [];
	} finally {
		cargando.value = false;
	}
};

const startEdit = (p) => {
	// Guardamos el pedido en localStorage y navegamos al formulario de creación (en modo edición)
	localStorage.setItem('pedidoEdit', JSON.stringify(p));
	router.push({ name: 'nuevo-pedido' });
};

const categoriaNombre = (id) => {
	const c = categorias.value.find(x => String(x.id) === String(id));
	return c ? c.nombre : id;
};

const totalPages = computed(() => Math.max(1, Math.ceil(pedidos.value.length / pageSize.value)));
const pagedPedidos = computed(() => {
	const start = (page.value - 1) * pageSize.value;
	return pedidos.value.slice(start, start + pageSize.value);
});

const prevPage = () => { if (page.value > 1) page.value -= 1; };
const nextPage = () => { if (page.value < totalPages.value) page.value += 1; };

const refresh = () => cargarPedidos();

const startAutoRefresh = () => {
	stopAutoRefresh();
	timer = setInterval(() => {
		cargarPedidos();
	}, Math.max(5000, refreshIntervalSec.value * 1000));
};
const stopAutoRefresh = () => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
};

watch(autoRefresh, (val) => {
	if (val) startAutoRefresh(); else stopAutoRefresh();
});

watch(refreshIntervalSec, (n) => {
	if (autoRefresh.value) startAutoRefresh();
});

onMounted(async () => {
	await cargarCategorias();
	await cargarPedidos();
});

const nuevoPedido = () => router.push({ name: 'nuevo-pedido' });
</script>

<style scoped>
.container { padding: 20px; }
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.btn-new { padding:8px 12px; background:#4eb783; color:white; border:none; border-radius:6px; cursor:pointer; }
.btn-refresh { padding:8px 10px; margin-left:8px; background:#67aef0; color:white; border:none; border-radius:6px; cursor:pointer; }
.pedidos-table {
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
	margin-top: 16px;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 4px 16px rgba(252,74,26,0.08);
	overflow: hidden;
}
.pedidos-table th {
	background: linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%);
	color: #fff;
	font-weight: 700;
	padding: 12px;
	border: none;
	font-size: 1.05rem;
}
.pedidos-table td {
	padding: 12px;
	border: none;
	font-size: 1rem;
	color: #333;
}
.pedidos-table tr {
	transition: background 0.2s;
}
.pedidos-table tbody tr:hover {
	background: #fff8f0;
}
.pagination { margin-top:12px; display:flex; gap:10px; align-items:center; }
.btn-edit {
	padding: 8px 16px;
	background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 2px 8px rgba(102,126,234,0.08);
	transition: background 0.2s;
}
.btn-edit:hover {
	background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
.btn-save {
	padding: 8px 16px;
	background: linear-gradient(90deg, #4eb783 0%, #42b983 100%);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	margin-right: 6px;
	box-shadow: 0 2px 8px rgba(76,183,131,0.08);
	transition: background 0.2s;
}
.btn-save:hover {
	background: linear-gradient(90deg, #42b983 0%, #4eb783 100%);
}
.btn-cancel {
	padding: 8px 16px;
	background: #eee;
	color: #333;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
}
.btn-cancel:hover {
	background: #ddd;
}
</style>
*** End Patch
