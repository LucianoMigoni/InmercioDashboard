import { useEffect, useMemo, useState } from "react";
import { IoAdd, IoCreate, IoTrash, IoClose, IoWarning, IoPricetag, IoCubeOutline, IoOptions } from "react-icons/io5";
import { CheckIcon } from "../../components/icons/CheckIcon";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable, FilterPanel, FilterLabel, Modal, Pagination, SearchInput, type Columna } from "../../components/dashboard";
import { Button } from "../../components/ui/button";
import { Dropdown } from "../../components/ui/dropdown";

import { addCategoria, addProducto, deleteCategoria, deleteProducto, productosPorCategoria, productosView, statsInventario, updateCategoria, updateProducto, ETIQUETA_ESTADO, type DatosProducto, type ProductoVM } from "@/controllers";

import { LIMITES, acotarNumero, limpiarCampoNumerico, limpiarTexto, validarTexto } from "@/shared/validacion";

import type { Categoria, EstadoProducto } from "@/entities";

import { useDatabase } from "@/models";

// Etiqueta con el estado del producto
function EstadoIndicador({ estado }: { estado: EstadoProducto }) {
  if (estado === "disponible") return null;

  const agotado = estado === "agotado";
  const colors = agotado ? "bg-[#FCE3E6] text-[#D32F4B]" : "bg-[#FFE8CC] text-[#F5923E]";
  const label = ETIQUETA_ESTADO[estado];

  return (
    <span
      className="group/estado relative inline-flex w-5 h-5 flex-shrink-0 align-middle"
      title={label}
      aria-label={label}
    >
      <span
        className={`absolute left-0 top-0 z-10 flex items-center h-5 rounded-full overflow-hidden max-w-5 transition-[max-width] duration-300 ease-out group-hover/estado:max-w-[120px] ${colors}`}
      >
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          {agotado ? (
            <span className="text-[12px] font-extrabold leading-none">!</span>
          ) : (
            <IoWarning size={12} />
          )}
        </span>
        <span className="pr-2.5 text-[10px] font-semibold whitespace-nowrap">{label}</span>
      </span>
    </span>
  );
}

type CampoOrden = "nombre" | "categoria" | "stock" | "precio";
type CampoColumna = CampoOrden | "acciones";
type FormState = DatosProducto & { tipoVenta: "unidad" | "peso" };

// Muestra el stock en rojo si esta agotado y en naranja si esta bajo
function StockTexto({ producto }: { producto: ProductoVM }) {
  return (
    <span
      className={`font-semibold ${producto.stock === 0
        ? "text-[#FF2244]"
        : producto.stock < producto.minimo
          ? "text-orange-500"
          : "text-[#000000]"
        }`}
    >
      {producto.stock} {producto.unidadMedida}
    </span>
  );
}

export function Inventario() {
  const state = useDatabase();
  const productosDb = productosView(state);
  const categorias = state.categorias;

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [tipoFiltro, setTipoFiltro] = useState<"Todos" | "Por Peso" | "Por Unidad">("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState<"Todos" | EstadoProducto>("Todos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [ordenCampo, setOrdenCampo] = useState<CampoOrden>("nombre");
  const [ordenDir, setOrdenDir] = useState<"asc" | "desc">("asc");

  // Hasta 50 productos por pagina
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 50;

  // Ventana para crear o editar productos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<ProductoVM | null>(null);

  // Ventana de categorias
  const [categoriasAbierto, setCategoriasAbierto] = useState(false);

  // Producto que se quiere borrar
  const [productoAEliminar, setProductoAEliminar] = useState<ProductoVM | null>(null);

  const CATEGORIAS = useMemo(
    () => ["Todas", ...categorias.map((c) => c.nombre)],
    [categorias]
  );

  // Si la categoria filtrada ya no existe volvemos a Todas
  useEffect(() => {
    if (categoriaFiltro !== "Todas" && !CATEGORIAS.includes(categoriaFiltro)) {
      setCategoriaFiltro("Todas");
    }
  }, [CATEGORIAS, categoriaFiltro]);

  const stats = statsInventario(productosDb);

  // Mensaje de tabla vacia
  const hayProductos = productosDb.length > 0;
  const mensajeVacio = hayProductos
    ? "No se encontraron productos con esos filtros."
    : "Todavía no cargaste ningún producto.";

  const minNum = precioMin === "" ? null : Number(precioMin);
  const maxNum = precioMax === "" ? null : Number(precioMax);

  const productos = productosDb
    .filter((p) => {
      const matchSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
      const matchTipo =
        tipoFiltro === "Todos" ||
        (tipoFiltro === "Por Peso" && p.tipoVenta === "peso") ||
        (tipoFiltro === "Por Unidad" && p.tipoVenta === "unidad");
      const matchEstado = estadoFiltro === "Todos" || p.estado === estadoFiltro;
      const matchPrecio =
        (minNum === null || p.precio >= minNum) && (maxNum === null || p.precio <= maxNum);
      return matchSearch && matchCat && matchTipo && matchEstado && matchPrecio;
    })
    .sort((a, b) => {
      const va = a[ordenCampo];
      const vb = b[ordenCampo];
      if (typeof va === "string" && typeof vb === "string") {
        return ordenDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return ordenDir === "asc" ? va - vb : vb - va;
      }
      return 0;
    });

  // Cantidad de filtros activos
  const filtrosActivos =
    (categoriaFiltro !== "Todas" ? 1 : 0) +
    (tipoFiltro !== "Todos" ? 1 : 0) +
    (estadoFiltro !== "Todos" ? 1 : 0) +
    (precioMin !== "" || precioMax !== "" ? 1 : 0);

  function limpiarFiltros() {
    setCategoriaFiltro("Todas");
    setTipoFiltro("Todos");
    setEstadoFiltro("Todos");
    setPrecioMin("");
    setPrecioMax("");
  }

  // Paginacion
  const totalPaginas = Math.max(1, Math.ceil(productos.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = productos.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const desde = productos.length === 0 ? 0 : (paginaActual - 1) * POR_PAGINA + 1;
  const hasta = (paginaActual - 1) * POR_PAGINA + visibles.length;

  // Vuelve a la primera pagina cuando cambian los filtros
  useEffect(() => {
    setPagina(1);
  }, [busqueda, categoriaFiltro, tipoFiltro, estadoFiltro, precioMin, precioMax, ordenCampo, ordenDir]);

  function toggleOrden(campo: CampoOrden) {
    if (ordenCampo === campo) {
      setOrdenDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOrdenCampo(campo);
      setOrdenDir("asc");
    }
  }

  function abrirNuevo() {
    setEditandoProducto(null);
    setModalAbierto(true);
  }

  function abrirEdicion(p: ProductoVM) {
    setEditandoProducto(p);
    setModalAbierto(true);
  }

  function eliminar(p: ProductoVM) {
    setProductoAEliminar(p);
  }

  function confirmarEliminar() {
    if (productoAEliminar) {
      deleteProducto(productoAEliminar.id);
    }
    setProductoAEliminar(null);
  }

  const columnas: Columna<ProductoVM, CampoColumna>[] = [
    {
      campo: "nombre",
      label: "Producto",
      ordenable: true,
      render: (p) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#000000]">{p.nombre}</span>
          <EstadoIndicador estado={p.estado} />
        </div>
      ),
    },
    {
      campo: "categoria",
      label: "Categoría",
      ordenable: true,
      className: "text-[#404040]",
      render: (p) => p.categoria,
    },
    {
      campo: "stock",
      label: "Stock",
      ordenable: true,
      className: "whitespace-nowrap",
      render: (p) => (
        <div className="flex items-center gap-2">
          <StockTexto producto={p} />
          <span className="text-xs text-[#888888]">/ mín. {p.minimo} {p.unidadMedida}</span>
        </div>
      ),
    },
    {
      campo: "precio",
      label: "Precio",
      ordenable: true,
      className: "text-[#000000] whitespace-nowrap",
      render: (p) => (
        <div className="flex items-center gap-1.5">
          <span>${p.precio.toLocaleString("es-AR")}</span>
          <span className="text-xs text-[#888888]">x 1 {p.unidadMedida}</span>
        </div>
      ),
    },
    {
      campo: "acciones",
      label: "Acciones",
      render: (p) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="w-7 h-7" onClick={() => abrirEdicion(p)}>
            <IoCreate size={13} />
          </Button>
          <Button variant="destructiveOutline" size="icon" className="w-7 h-7" onClick={() => eliminar(p)}>
            <IoTrash size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Productos", value: stats.total, color: "text-[#000000]" },
          { label: "Stock Bajo", value: stats.stockBajo, color: "text-orange-500" },
          { label: "Agotados", value: stats.agotados, color: "text-[#FF2244]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
            <p className={`font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#404040] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>

        {/* Barra de herramientas */}
        <div className="px-5 py-4 flex flex-col gap-3 border-b border-[#E4E4E4]">
          {/* Titulo, buscador y boton de agregar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <h3 className="text-[#000000]">Inventario de Productos</h3>
              <p className="text-xs text-[#575757] mt-0.5">Gestioná el stock, precios y categorías</p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput
                value={busqueda}
                onChange={setBusqueda}
                placeholder="Buscar producto..."
                className="flex-1 sm:flex-initial"
                inputClassName="w-full sm:w-44"
              />
              <Button variant="secondary" className="flex-shrink-0" onClick={() => setCategoriasAbierto(true)}>
                <IoPricetag size={14} />
                Categorías
              </Button>
              <Button className="flex-shrink-0" onClick={abrirNuevo}>
                <IoAdd size={16} />
                Agregar
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <FilterPanel activos={filtrosActivos} onLimpiar={limpiarFiltros}>
            <div>
              <FilterLabel>Categoría</FilterLabel>
              <Dropdown
                value={categoriaFiltro}
                options={CATEGORIAS.map((cat) => ({ value: cat, label: cat }))}
                onSelect={setCategoriaFiltro}
              />
            </div>

            <div>
              <FilterLabel>Estado de stock</FilterLabel>
              <Dropdown
                value={estadoFiltro}
                options={[
                  { value: "Todos", label: "Todos" },
                  { value: "disponible", label: "Disponible" },
                  { value: "stock_bajo", label: "Stock Bajo" },
                  { value: "agotado", label: "Agotado" },
                ]}
                onSelect={(v) => setEstadoFiltro(v as "Todos" | EstadoProducto)}
              />
            </div>

            <div>
              <FilterLabel>Tipo de venta</FilterLabel>
              <Dropdown
                value={tipoFiltro}
                options={["Todos", "Por Peso", "Por Unidad"].map((t) => ({ value: t, label: t }))}
                onSelect={(v) => setTipoFiltro(v as "Todos" | "Por Peso" | "Por Unidad")}
              />
            </div>

            <div>
              <FilterLabel>Precio ($)</FilterLabel>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={LIMITES.PRECIO.max}
                  value={precioMin}
                  onChange={(e) => setPrecioMin(limpiarCampoNumerico(e.target.value, LIMITES.PRECIO))}
                  placeholder="Mín."
                  className="w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/15"
                />
                <span className="text-[#ADADAD] text-sm">–</span>
                <input
                  type="number"
                  min={0}
                  max={LIMITES.PRECIO.max}
                  value={precioMax}
                  onChange={(e) => setPrecioMax(limpiarCampoNumerico(e.target.value, LIMITES.PRECIO))}
                  placeholder="Máx."
                  className="w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/15"
                />
              </div>
            </div>
          </FilterPanel>
        </div>

        <DataTable
          columnas={columnas}
          filas={visibles}
          filaKey={(p) => p.id}
          ordenCampo={ordenCampo}
          ordenDir={ordenDir}
          onOrden={(campo) => toggleOrden(campo as CampoOrden)}
          vacio={{ icon: hayProductos ? IoOptions : IoCubeOutline, mensaje: mensajeVacio }}
          renderCard={(p) => (
            <div className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#000000] leading-tight break-words">{p.nombre}</p>
                  <p className="text-xs text-[#404040] mt-0.5">{p.categoria}</p>
                </div>
                <EstadoIndicador estado={p.estado} />
              </div>
              <div className="flex items-end justify-between gap-3 mt-2.5">
                <div className="min-w-0">
                  <p className="text-sm leading-tight">
                    <StockTexto producto={p} />
                    <span className="text-xs text-[#888888]"> / mín. {p.minimo} {p.unidadMedida}</span>
                  </p>
                  <p className="text-sm text-[#000000] mt-1">
                    ${p.precio.toLocaleString("es-AR")}{" "}
                    <span className="text-xs text-[#888888]">x 1 {p.unidadMedida}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => abrirEdicion(p)}>
                    <IoCreate size={14} />
                  </Button>
                  <Button variant="destructiveOutline" size="icon" className="w-8 h-8" onClick={() => eliminar(p)}>
                    <IoTrash size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        />

        {/* Paginacion */}
        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPagina={setPagina}
          desde={desde}
          hasta={hasta}
          total={productos.length}
          sustantivo="productos"
        />
      </div>

      {/* Ventana para crear o editar productos */}
      {modalAbierto && (
        <ProductoModal
          producto={editandoProducto}
          productos={productosDb}
          categorias={categorias}
          onClose={() => setModalAbierto(false)}
        />
      )}

      {/* Ventana de categorias */}
      {categoriasAbierto && (
        <CategoriasModal
          categorias={categorias}
          onClose={() => setCategoriasAbierto(false)}
        />
      )}

      {/* Confirmar borrado */}
      {productoAEliminar && (
        <ConfirmDialog
          title="Eliminar producto"
          variant="destructive"
          onCancel={() => setProductoAEliminar(null)}
          onConfirm={confirmarEliminar}
        >
          ¿Seguro que querés eliminar{" "}
          <span className="font-semibold text-[#000000]">{productoAEliminar.nombre}</span> del inventario?
          El producto deja de aparecer en el catálogo; su historial de
          movimientos se conserva.
        </ConfirmDialog>
      )}
    </div>
  );
}

// Ventana para crear o editar un producto

const inputCls =
  "w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2.5 bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/20 transition-colors";

// Unidades de venta
const UNIDADES_PESO = ["kg", "g", "l", "ml"];

const OPCIONES_PESO = [
  { val: "kg", label: "Kilogramos", hint: "kg" },
  { val: "g", label: "Gramos", hint: "g" },
  { val: "l", label: "Litros", hint: "l" },
  { val: "ml", label: "Mililitros", hint: "ml" },
] as const;

const NOMBRE_UNIDAD: Record<string, string> = {
  "kg": "kilo",
  "g": "gramo",
  "l": "litro",
  "ml": "mililitro",
  "u.": "unidad",
};

function formStateDesde(
  producto: ProductoVM | null,
  categorias: Categoria[]
): FormState {
  if (producto) {
    return {
      nombre: producto.nombre,
      categoria: producto.categoria,
      unidadMedida: producto.unidadMedida,
      stock: producto.stock,
      minimo: producto.minimo,
      precio: producto.precio,
      tipoVenta: producto.tipoVenta,
    };
  }
  return {
    nombre: "",
    categoria: categorias[0]?.nombre ?? "",
    unidadMedida: "u.",
    stock: 0,
    minimo: 0,
    precio: 0,
    tipoVenta: "unidad",
  };
}

function ProductoModal({
  producto,
  productos,
  categorias,
  onClose,
}: {
  producto: ProductoVM | null;
  productos: ProductoVM[];
  categorias: Categoria[];
  onClose: () => void;
}) {
  const editando = producto !== null;
  const [form, setForm] = useState<FormState>(() =>
    formStateDesde(producto, categorias)
  );

  const unidad =
    form.tipoVenta === "unidad"
      ? "u."
      : UNIDADES_PESO.includes(form.unidadMedida)
        ? form.unidadMedida
        : "kg";

  const nombreLimpio = form.nombre.trim();
  const duplicado = productos.some(
    (p) => p.id !== producto?.id && p.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );
  const errorNombre = nombreLimpio
    ? validarTexto(form.nombre, LIMITES.PRODUCTO_NOMBRE, "El nombre") ??
    (duplicado ? "Ya existe un producto con ese nombre." : null)
    : null;
  const nombreValido = nombreLimpio.length > 0 && !errorNombre;

  const num = (v: string, tope: { max: number; decimales: number }) =>
    v === "" ? 0 : acotarNumero(Number(v), tope);

  function guardar() {
    if (!nombreValido) return;
    const datos: DatosProducto = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      unidadMedida: unidad,
      stock: form.stock,
      minimo: form.minimo,
      precio: form.precio,
    };
    if (editando && producto) {
      updateProducto(producto.id, datos);
    } else {
      addProducto(datos);
    }
    onClose();
  }

  return (
    <Modal
      title={editando ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
      scroll
      notifyOverlay
      footer={
        <>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={guardar} disabled={!nombreValido}>
            {editando ? "Guardar cambios" : "Crear producto"}
          </Button>
        </>
      }
    >
      {/* Formulario */}
      <div className="px-5 pb-5 space-y-4">
        <Field label="Nombre del producto" required>
          <input
            autoFocus
            value={form.nombre}
            maxLength={LIMITES.PRODUCTO_NOMBRE.max}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                nombre: limpiarTexto(e.target.value, LIMITES.PRODUCTO_NOMBRE.max),
              }))
            }
            className={inputCls}
            placeholder="Ej: Semillas de Chía Orgánica"
          />
          {errorNombre && <p className="text-xs text-[#FF2244] mt-1.5">{errorNombre}</p>}
        </Field>

        <Field label="Categoría">
          <Dropdown
            value={form.categoria}
            options={[
              { value: "-", label: "No asignado" },
              ...categorias.map((c) => ({ value: c.nombre, label: c.nombre })),
            ]}
            onSelect={(v) => setForm((f) => ({ ...f, categoria: v }))}
          />
        </Field>

        {/* Tipo de venta */}
        <Field label="Tipo de venta">
          <div className="grid grid-cols-2 gap-2">
            {([
              { val: "unidad", label: "Por unidad", hint: "u." },
              { val: "peso", label: "Por peso", hint: "g/kg/l/ml" },
            ] as const).map((opt) => {
              const activo = form.tipoVenta === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      tipoVenta: opt.val,
                      unidadMedida:
                        opt.val === "unidad"
                          ? "u."
                          : UNIDADES_PESO.includes(f.unidadMedida)
                            ? f.unidadMedida
                            : "kg",
                    }))
                  }
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${activo
                    ? "border-[#FFAD60] bg-[#FFE8CC] text-[#000000]"
                    : "border-[#E4E4E4] bg-white text-[#575757] hover:border-[#FFAD60]"
                    }`}
                >
                  {opt.label} <span className="text-xs text-[#888888]">({opt.hint})</span>
                </button>
              );
            })}
          </div>

          {/* Unidad de peso o volumen */}
          {form.tipoVenta === "peso" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {OPCIONES_PESO.map((opt) => {
                const activo = unidad === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, unidadMedida: opt.val }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${activo
                      ? "border-[#FFAD60] bg-[#FFE8CC] text-[#000000]"
                      : "border-[#E4E4E4] bg-white text-[#575757] hover:border-[#FFAD60]"
                      }`}
                  >
                    {opt.label} <span className="text-[#888888]">({opt.hint})</span>
                  </button>
                );
              })}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stock actual">
            <div className="relative">
              <input
                type="number"
                min={0}
                max={LIMITES.STOCK.max}
                step="any"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: num(e.target.value, LIMITES.STOCK) }))}
                className={`${inputCls} pr-9`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] pointer-events-none">{unidad}</span>
            </div>
          </Field>
          <Field label="Stock mínimo">
            <div className="relative">
              <input
                type="number"
                min={0}
                max={LIMITES.STOCK.max}
                step="any"
                value={form.minimo}
                onChange={(e) => setForm((f) => ({ ...f, minimo: num(e.target.value, LIMITES.STOCK) }))}
                className={`${inputCls} pr-9`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] pointer-events-none">{unidad}</span>
            </div>
          </Field>
        </div>

        <Field label={`Precio por ${NOMBRE_UNIDAD[unidad] ?? "unidad"}`}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] pointer-events-none">$</span>
            <input
              type="number"
              min={0}
              max={LIMITES.PRECIO.max}
              step="any"
              value={form.precio}
              onChange={(e) => setForm((f) => ({ ...f, precio: num(e.target.value, LIMITES.PRECIO) }))}
              className={`${inputCls} pl-7`}
              placeholder="0"
            />
          </div>
        </Field>
      </div>
    </Modal>
  );
}

// Ventana para gestionar categorias

function CategoriasModal({
  categorias,
  onClose,
}: {
  categorias: Categoria[];
  onClose: () => void;
}) {
  const state = useDatabase();
  const conteo = productosPorCategoria(state);

  // Nueva categoria
  const [nueva, setNueva] = useState("");
  const [errorNueva, setErrorNueva] = useState("");

  // Categoria que se esta renombrando
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreBorrador, setNombreBorrador] = useState("");
  const [errorEdicion, setErrorEdicion] = useState("");

  // Categoria que se quiere borrar
  const [catAEliminar, setCatAEliminar] = useState<Categoria | null>(null);

  function crear() {
    const nombre = nueva.trim();
    if (!nombre) return;
    const errorLargo = validarTexto(nombre, LIMITES.CATEGORIA_NOMBRE, "El nombre");
    if (errorLargo) {
      setErrorNueva(errorLargo);
      return;
    }
    const yaExiste = categorias.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (yaExiste) {
      setErrorNueva("Ya existe una categoría con ese nombre.");
      return;
    }
    addCategoria(nombre);
    setNueva("");
    setErrorNueva("");
  }

  function empezarEdicion(c: Categoria) {
    setEditandoId(c.id);
    setNombreBorrador(c.nombre);
    setErrorEdicion("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNombreBorrador("");
    setErrorEdicion("");
  }

  function confirmarEdicion() {
    if (!editandoId) return;
    const errorLargo = validarTexto(nombreBorrador, LIMITES.CATEGORIA_NOMBRE, "El nombre");
    if (errorLargo) {
      setErrorEdicion(errorLargo);
      return;
    }
    const ok = updateCategoria(editandoId, nombreBorrador);
    if (!ok) {
      setErrorEdicion("Ya existe una categoría con ese nombre.");
      return;
    }
    cancelarEdicion();
  }

  function confirmarEliminar() {
    if (catAEliminar) {
      deleteCategoria(catAEliminar.id);
    }
    setCatAEliminar(null);
  }

  return (
    <Modal
      title="Categorías"
      onClose={onClose}
      scroll
      notifyOverlay
      footer={
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="px-5 pb-5 space-y-4">
        {/* Agregar categoria */}
        <Field label="Nueva categoría">
          <div className="flex gap-2">
            <input
              value={nueva}
              maxLength={LIMITES.CATEGORIA_NOMBRE.max}
              onChange={(e) => {
                setNueva(limpiarTexto(e.target.value, LIMITES.CATEGORIA_NOMBRE.max));
                setErrorNueva("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  crear();
                }
              }}
              placeholder="Ej: Infusiones"
              className={inputCls}
            />
            <Button
              type="button"
              size="icon"
              onClick={crear}
              disabled={!nueva.trim()}
              title="Agregar categoría"
              className="w-10 h-auto flex-shrink-0 rounded-xl"
            >
              <IoAdd size={16} />
            </Button>
          </div>
          {errorNueva && <p className="text-xs text-[#FF2244] mt-1.5">{errorNueva}</p>}
        </Field>

        {/* Lista de categorias */}
        <div>
          <p className="block text-xs font-semibold text-[#575757] mb-1.5">
            Tus categorías ({categorias.length})
          </p>
          {categorias.length === 0 ? (
            <p className="text-sm text-[#575757] py-4 text-center">
              Todavía no creaste ninguna categoría.
            </p>
          ) : (
            <div className="border border-[#E4E4E4] rounded-xl divide-y divide-[#E4E4E4] overflow-hidden">
              {categorias.map((c) => {
                const productosUsando = conteo.get(c.id) ?? 0;
                const enEdicion = editandoId === c.id;
                return (
                  <div key={c.id} className="px-3 py-2.5 bg-white">
                    {enEdicion ? (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={nombreBorrador}
                            maxLength={LIMITES.CATEGORIA_NOMBRE.max}
                            onChange={(e) => {
                              setNombreBorrador(limpiarTexto(e.target.value, LIMITES.CATEGORIA_NOMBRE.max));
                              setErrorEdicion("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                confirmarEdicion();
                              }
                              if (e.key === "Escape") {
                                e.stopPropagation();
                                cancelarEdicion();
                              }
                            }}
                            className={inputCls}
                          />
                          <Button
                            type="button"
                            size="icon"
                            onClick={confirmarEdicion}
                            disabled={!nombreBorrador.trim()}
                            title="Guardar nombre"
                            className="flex-shrink-0 rounded-xl"
                          >
                            <CheckIcon size={15} />
                          </Button>
                          <Button
                            type="button"
                            variant="tertiary"
                            size="icon"
                            onClick={cancelarEdicion}
                            title="Cancelar"
                            className="flex-shrink-0 rounded-xl"
                          >
                            <IoClose size={15} />
                          </Button>
                        </div>
                        {errorEdicion && <p className="text-xs text-[#FF2244] mt-1.5">{errorEdicion}</p>}
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#000000] break-words">{c.nombre}</p>
                          <p className="text-xs text-[#888888]">
                            {productosUsando === 1 ? "1 producto" : `${productosUsando} productos`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="secondary" size="icon" className="w-7 h-7" onClick={() => empezarEdicion(c)}>
                            <IoCreate size={13} />
                          </Button>
                          <Button variant="destructiveOutline" size="icon" className="w-7 h-7" onClick={() => setCatAEliminar(c)}>
                            <IoTrash size={13} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmar borrado */}
      {catAEliminar && (
        <ConfirmDialog
          title="Eliminar categoría"
          variant="destructive"
          onCancel={() => setCatAEliminar(null)}
          onConfirm={confirmarEliminar}
        >
          ¿Seguro que querés eliminar la categoría{" "}
          <span className="font-semibold text-[#000000]">{catAEliminar.nombre}</span>?
          {(conteo.get(catAEliminar.id) ?? 0) > 0 && (
            <> Los productos que la usan van a quedar como «Sin categoría».</>
          )}
        </ConfirmDialog>
      )}
    </Modal>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#575757] mb-1.5">
        {label}
        {required && <span className="text-[#FF2244] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
