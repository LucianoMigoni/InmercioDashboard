import { Link } from "react-router";
import { IoBook, IoAdd, IoOpen, IoMail } from "react-icons/io5";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionItem, AccordionContent } from "../../components/ui/accordion";
import { WhatsAppIcon } from "../../components/icons/WhatsAppIcon";
import { SearchBox } from "../../docs/Shell";

// Preguntas frecuentes
const faqs = [
  {
    q: "¿Cómo agrego un nuevo producto al inventario?",
    a: "Ve a la sección \"Inventario\", haz clic en el botón \"Agregar Producto\" en la esquina superior derecha, completa el formulario con el nombre, SKU, categoría, cantidad y precio, y guarda los cambios.",
  },
  {
    q: "¿Cómo configuro las alertas de stock mínimo?",
    a: "En la sección \"Inventario\", edita cualquier producto y establece el campo \"Mínimo\" con la cantidad deseada. El sistema te avisará automáticamente cuando el stock alcance ese nivel.",
  },
  {
    q: "¿Cómo exporto los datos del inventario?",
    a: "En la sección \"Inventario\", utiliza el botón de exportar (ícono de descarga) para obtener un archivo CSV o PDF con todos los datos actuales del inventario.",
  },
  {
    q: "¿Puedo cambiar mi plan de suscripción?",
    a: "Sí. Ve a \"Configuración\" → \"Perfil\" y haz clic en \"Ver todos los planes\". Desde ahí puedes actualizar o cambiar tu plan de suscripción.",
  },
  {
    q: "¿Cómo se actualiza el stock en tiempo real?",
    a: "Inmercio sincroniza automáticamente los movimientos de entrada y salida cada vez que se registra un pedido o movimiento. Puedes ver los cambios reflejados inmediatamente en el panel \"Principal\" y en \"Resumen\".",
  },
];

export function Ayuda() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFAD60] to-[#F5923E] p-6 text-white shadow-lg">
        <h2 className="text-white mb-1">Centro de Ayuda</h2>
        <p className="text-white/80 text-sm mb-4">
          Encuentra guías, tutoriales y respuestas a tus preguntas.
        </p>
        {/* Buscador */}
        <div className="max-w-md">
          <SearchBox placeholder="Buscar en la ayuda..." />
        </div>
      </div>

      {/* Accesos rapidos */}
      <Link
        to="/documentacion"
        className="w-full bg-white rounded-2xl p-5 border border-[#E4E4E4] text-left hover:border-[#FFAD60] hover:shadow-md transition-all group cursor-pointer flex items-center gap-4"
        style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}
      >
        <div className="w-10 h-10 rounded-xl bg-[#B3C9E8] flex items-center justify-center flex-shrink-0">
          <IoBook size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#000000] group-hover:text-[#FFAD60] transition-colors">
            Documentación
          </p>
          <p className="text-xs text-[#575757] mt-0.5">Guías completas del sistema</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#909090] group-hover:text-[#FFAD60] transition-colors flex-shrink-0">
          <span>Explorar</span>
          <IoOpen size={11} />
        </div>
      </Link>

      {/* Preguntas frecuentes */}
      <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
        <h3 className="text-[#000000] mb-4">Preguntas Frecuentes</h3>
        {faqs.length === 0 ? (
          <p className="text-sm text-[#575757] py-4 text-center">No hay preguntas frecuentes disponibles.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                value={String(i)}
                key={i}
                className="rounded-xl border border-[#E4E4E4] last:border-b! bg-white px-5 py-1 transition-all has-[[data-state=open]]:border-[#FFAD60]/30 has-[[data-state=open]]:bg-[#F6F6F6]"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-2 py-3 text-left text-sm font-medium text-[#000000] transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180 cursor-pointer">
                    {faq.q}
                    <IoAdd
                      size={16}
                      className="shrink-0 text-[#FFAD60] transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="pb-3 text-sm text-[#575757] leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* WhatsApp */}
        <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <WhatsAppIcon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">¿No encontraste lo que buscabas?</p>
              <p className="text-xs text-[#575757]">Escribinos por WhatsApp y te ayudamos.</p>
            </div>
          </div>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB855] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors flex-shrink-0"
          >
            <WhatsAppIcon size={20} className="text-white" />
            Escribinos por WhatsApp
          </a>
        </div>

        {/* Correo de soporte */}
        <a
          href="mailto:soporte@inmercio.com"
          className="bg-white rounded-2xl border border-[#E4E4E4] p-5 flex items-center gap-4 transition-all hover:border-[#C5D6F0] hover:-translate-y-0.5 cursor-pointer"
          style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#E4ECF9] flex items-center justify-center flex-shrink-0">
            <IoMail size={18} className="text-[#4A77C2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#575757]">Correo de Soporte</p>
            <p className="text-sm font-semibold text-[#000000] truncate">soporte@inmercio.com</p>
          </div>
        </a>
      </div>
    </div>
  );
}