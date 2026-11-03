// Datos de la cuenta, el negocio y la suscripcion

import { store } from "@/models";
import { formatARS } from "@/shared/format";
import {
  LIMITES,
  limpiarNombrePersona,
  limpiarTelefono,
  limpiarTexto,
  validarCuit,
  validarTelefono,
  validarTexto,
} from "@/shared/validacion";
import type {
  DatabaseShape,
  EstadoSuscripcion,
  PreferenciasNotificaciones,
} from "@/entities";

const MESES_LARGO = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MESES_CORTO = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const ETIQUETA_SUSCRIPCION: Record<EstadoSuscripcion, string> = {
  trial: "Período de prueba",
  activa: "Activo",
  morosa: "Pago pendiente",
  cancelada: "Cancelado",
};

// Muestra la fecha como 15 Jul 2026
function fechaCorta(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MESES_CORTO[m - 1]} ${y}`;
}

// Datos de la cuenta que usa la pantalla de configuracion
export interface CuentaVM {
  nombre: string;
  apellido: string;
  email: string;
  cuit: string;
  negocio: string;
  rubro: string;
  fechaCreacionISO: string;
  telefonoContacto: string;
  telefonoWhatsapp: string;
  plan: {
    nombre: string;
    precioMensual: number;
    proximoCobro: string;
    estado: string;
    descripcion: string;
  };
  metodoPago: { tipo: string; ultimos4: string; vence: string };
  facturas: { fecha: string; desc: string; monto: string; estado: string }[];
  // Alertas de stock bajo y sin movimiento
  notificaciones: {
    stockBajo: boolean;
    sinMovimiento: boolean;
  };
}

export function cuentaView(state: DatabaseShape): CuentaVM {
  // Por ahora hay un solo negocio y un solo perfil
  const negocio = state.negocios[0];
  const perfil = state.perfiles[0];
  const rubro = state.rubros.find((r) => r.id === negocio.rubro_id);
  const suscripcion = state.suscripciones.find((s) => s.negocio_id === negocio.id);
  const plan = state.planes.find((p) => p.id === suscripcion?.plan_id);
  const tarjeta = state.metodos_pago.find((m) => m.negocio_id === negocio.id && m.activo);
  const whatsapp = state.negocio_telefonos.find(
    (t) => t.negocio_id === negocio.id && t.activo
  );
  const prefs = state.preferencias_notificaciones.find(
    (p) => p.negocio_id === negocio.id && p.perfil_id === perfil.id
  );

  const facturas = state.cobros
    .filter((c) => c.negocio_id === negocio.id)
    .sort((a, b) => b.creado_en.localeCompare(a.creado_en))
    .map((c) => {
      const f = c.creado_en.slice(0, 10);
      const [y, m] = f.split("-").map(Number);
      return {
        fecha: fechaCorta(f),
        desc: `Plan ${plan?.nombre ?? ""} – ${MESES_LARGO[m - 1]} ${y}`,
        monto: `${formatARS(c.monto_ars)} ARS`,
        estado:
          c.estado === "aprobado" ? "Pagado"
          : c.estado === "pendiente" ? "Pendiente"
          : "Rechazado",
      };
    });

  return {
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    email: perfil.email,
    cuit: negocio.cuit ?? "",
    negocio: negocio.nombre,
    rubro: rubro?.nombre ?? "",
    fechaCreacionISO: perfil.creado_en.slice(0, 10),
    telefonoContacto: perfil.telefono,
    telefonoWhatsapp: whatsapp?.numero ?? "—",
    plan: {
      nombre: plan?.nombre ?? "—",
      precioMensual: plan?.precio_ars ?? 0,
      proximoCobro: fechaCorta(suscripcion?.proxima_fecha_cobro ?? null),
      estado: suscripcion ? ETIQUETA_SUSCRIPCION[suscripcion.estado] : "—",
      descripcion: plan?.caracteristicas.descripcion ?? "",
    },
    metodoPago: {
      tipo: tarjeta?.marca ?? "—",
      ultimos4: tarjeta?.ultimos_4_digitos ?? "····",
      vence: tarjeta?.vencimiento ?? "—",
    },
    // Las alertas arrancan apagadas
    notificaciones: {
      stockBajo: prefs?.avisar_stock_bajo ?? false,
      sinMovimiento: prefs?.avisar_sin_movimiento ?? false,
    },
    facturas,
  };
}

type PatchCuenta = {
  nombre?: string;
  apellido?: string;
  telefonoContacto?: string;
  negocio?: string;
  cuit?: string;
  rubro?: string;
};

// Limpia y valida los datos antes de guardarlos
function validarPatchCuenta(patch: PatchCuenta): PatchCuenta {
  const out = { ...patch };
  let error: string | null = null;

  if (out.nombre !== undefined) {
    out.nombre = limpiarNombrePersona(out.nombre, LIMITES.PERSONA_NOMBRE.max).trim();
    error ??= validarTexto(out.nombre, LIMITES.PERSONA_NOMBRE, "El nombre");
  }
  if (out.apellido !== undefined) {
    out.apellido = limpiarNombrePersona(out.apellido, LIMITES.PERSONA_NOMBRE.max).trim();
    error ??= validarTexto(out.apellido, LIMITES.PERSONA_NOMBRE, "El apellido");
  }
  if (out.negocio !== undefined) {
    out.negocio = limpiarTexto(out.negocio, LIMITES.NEGOCIO_NOMBRE.max).trim();
    error ??= validarTexto(out.negocio, LIMITES.NEGOCIO_NOMBRE, "El nombre del negocio");
  }
  if (out.cuit !== undefined) {
    error ??= validarCuit(out.cuit);
  }
  if (out.telefonoContacto !== undefined) {
    out.telefonoContacto = limpiarTelefono(out.telefonoContacto).trim();
    error ??= validarTelefono(out.telefonoContacto);
  }

  if (error) throw new Error(error);
  return out;
}

// Guarda los datos del perfil y del negocio
export function updateCuenta(entrada: PatchCuenta) {
  const patch = validarPatchCuenta(entrada);
  const state = store.getState();
  const rubroId = patch.rubro
    ? state.rubros.find((r) => r.nombre === patch.rubro)?.id
    : undefined;
  store.setState({
    ...state,
    perfiles: state.perfiles.map((p, i) =>
      i === 0
        ? {
            ...p,
            ...(patch.nombre !== undefined && { nombre: patch.nombre }),
            ...(patch.apellido !== undefined && { apellido: patch.apellido }),
            ...(patch.telefonoContacto !== undefined && { telefono: patch.telefonoContacto }),
          }
        : p
    ),
    negocios: state.negocios.map((n, i) =>
      i === 0
        ? {
            ...n,
            ...(patch.negocio !== undefined && { nombre: patch.negocio }),
            ...(patch.cuit !== undefined && { cuit: patch.cuit || null }),
            ...(rubroId !== undefined && { rubro_id: rubroId }),
          }
        : n
    ),
  });
}

// Guarda las preferencias de notificaciones
export function updateNotificaciones(patch: {
  stockBajo?: boolean;
  sinMovimiento?: boolean;
}) {
  const state = store.getState();
  const existente = state.preferencias_notificaciones[0];

  if (!existente) {
    // Si todavia no hay preferencias creamos la primera
    const nueva: PreferenciasNotificaciones = {
      id: crypto.randomUUID(),
      negocio_id: state.negocios[0]?.id ?? "",
      perfil_id: state.perfiles[0]?.id ?? "",
      email_activo: false,
      avisar_stock_bajo: patch.stockBajo ?? false,
      avisar_sin_movimiento: patch.sinMovimiento ?? false,
      dias_sin_movimiento_umbral: 30,
      avisar_pedidos: false,
      creado_en: new Date().toISOString(),
    };
    store.setState({ ...state, preferencias_notificaciones: [nueva] });
    return;
  }

  // Si ya existen las actualizamos
  store.setState({
    ...state,
    preferencias_notificaciones: state.preferencias_notificaciones.map((p, i) =>
      i === 0
        ? {
            ...p,
            ...(patch.stockBajo !== undefined && { avisar_stock_bajo: patch.stockBajo }),
            ...(patch.sinMovimiento !== undefined && { avisar_sin_movimiento: patch.sinMovimiento }),
          }
        : p
    ),
  });
}
