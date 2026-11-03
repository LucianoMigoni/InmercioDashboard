// Contenido del centro de ayuda

export interface Step { title: string; body: string }
export interface Article { slug: string; title: string; blurb: string; intro?: string; read: number; steps: Step[] }
export interface Category {
  slug: string; title: string; icon: string; color: string; tint: string; strong: string;
  short: string; desc: string; articles: Article[]; isSingle?: boolean;
}

export const INTRO =
  "[Introducción del artículo — un párrafo breve que explica qué va a lograr la " +
  "persona al seguir esta guía, en qué momento le sirve y qué necesita tener a mano antes de empezar.]";

// Categorias
export const CATEGORIES: Category[] = [
  {
    slug: "primeros-pasos",
    title: "Primeros pasos",
    icon: "rocket",
    color: "var(--cat-orange)",
    tint: "#FFE8CC",
    strong: "#F5923E",
    short: "Poné en marcha tu cuenta de Inmercio y dejá todo listo para gestionar tu stock.",
    desc:
      "Todo lo que necesitás para arrancar: crear tu cuenta, cargar tus primeros productos y dejar conectado el bot de WhatsApp.",
    articles: [
      {
        slug: "como-empezar", title: "Cómo empezar con Inmercio", blurb: "Creá tu cuenta y configurá tu negocio en pocos minutos.",
        intro: "Esta guía te muestra cómo poner Inmercio en marcha en menos de 15 minutos. Al terminar vas a tener tu cuenta activa, tu WhatsApp conectado al bot y tu catálogo cargado, listo para empezar a registrar ventas y procesar facturas. Antes de empezar, tené a mano el número de WhatsApp que usás en el negocio y, si lo tenés, un Excel o lista con tus productos actuales.",
        read: 3, steps: [
          { title: "Creá tu cuenta y activá la prueba gratuita", body: "Entrá a inmercio.com y registrate con tu cuenta de Google. Completá los datos básicos del negocio (nombre, rubro, etc.) y arrancás automáticamente con 14 días gratis, sin tarjeta de crédito." },
          { title: "Conectá tu WhatsApp", body: "Vinculá el número de WhatsApp que usás en el local con el bot de Inmercio. Te llega un mensaje de confirmación al chat y desde ese momento ya podés hablar con el bot como si fuera un contacto más." },
          { title: "Cargá tu catálogo y configurá los mínimos", body: "Subí tu lista de productos desde un Excel, o pasale al bot una foto de tu inventario actual. Después definí el stock mínimo de cada producto, que es el nivel en el que querés que el bot te avise para reponer. Si no sabés qué número poner, dejá que Inmercio te sugiera un mínimo según la rotación del producto y ajustalo más adelante si hace falta." },
          { title: "Hacé tu primera interacción con el bot", body: "Probá el flujo con un caso real: sacale foto a una factura del proveedor, o mandale un audio diciendo \"vendí 3 paquetes de pañales talle G\". El bot te muestra el resumen, lo confirmás con un \"sí\" y el stock queda actualizado." },
        ],
      },
      {
        slug: "cargar-productos-iniciales", title: "Cargar tus productos iniciales", blurb: "Sumá tu catálogo de productos al inventario por primera vez.",
        intro: "Esta guía te muestra cómo cargar todo tu catálogo en Inmercio para arrancar con el stock real de tu negocio. La idea es que lo hagas una sola vez y de la forma más rápida posible: en lugar de tipear cada producto a mano, le pasás un Excel, fotos de tus anotaciones por WhatsApp, y el bot se encarga del resto. Antes de empezar, decidí qué método te conviene según lo que ya tengas a mano.",
        read: 5, steps: [
          { title: "Elegí el método de carga", body: "Para este paso podés subir un archivo Excel, enviar fotos de tu inventario, o pasarle una lista escrita al bot por WhatsApp. Si ya tenés todo en una planilla, lo más rápido es el Excel. Si nunca llevaste un registro digital, las fotos son la opción más cómoda." },
          { title: "Prepará la información", body: "Si vas con Excel, asegurate de tener al menos tres columnas: nombre del producto, stock actual (en peso o cantidad) y precio. Si vas con fotos, sacá imágenes de lo que llevas anotado en tu libreta, cualquier cosa el bot te va a pedir que lo confirmes, cosa que puedas editarlo si es necesario. Si vas con lista, escribila como le hablarías al bot (\"tengo 12 paquetes de pañales Pampers G, 8 talle XG, 5 toallitas Huggies...\")." },
          { title: "Enviá o subí el catálogo", body: "Si elegiste Excel, arrastrá el archivo al panel web y esperá a que termine la importación. Si elegiste fotos o lista, mandalas de una en una directo por WhatsApp al bot. Inmercio te avisa cuando termina de procesar todo." },
          { title: "Revisá y confirmá los productos detectados", body: "Inmercio te muestra el listado de todo lo que detectó: nombre, cantidad y precio de cada producto. Revisalo con calma, corregí los nombres que estén mal escritos, juntá duplicados si aparecen, y eliminá lo que no corresponda. Recién cuando confirmás, el catálogo queda guardado." },
          { title: "Configurá el stock mínimo de cada producto", body: "Por último, definí en qué nivel querés que el bot te avise para reponer. Podés cargarlo manualmente producto por producto, o dejar que Inmercio te sugiera un mínimo orientativo según el rubro y lo vas ajustando a medida que el bot aprende cómo se mueve tu negocio." },
        ],
      },
      {
        slug: "conectar-whatsapp", title: "Conectar tu número de WhatsApp", blurb: "Vinculá tu línea para empezar a operar desde el chat.",
        intro: "Esta guía te muestra cómo verificar el número de WhatsApp del local con Inmercio durante el registro. Es el paso que habilita todo lo que sigue: el chat donde recibís el código de verificación es el mismo donde vas a hablarle al bot todos los días para procesar facturas, registrar ventas y consultar stock. Solo necesitás el celular con WhatsApp abierto y el número que usás en el negocio.",
        read: 4, steps: [
          { title: "Ingresá tu número al crear la cuenta", body: "Durante el registro, después de completar los datos básicos del negocio, Inmercio te pide el número de WhatsApp que vas a usar. Usá el número desde el cual querés operar todos los días, ya sea el del local o el personal." },
          { title: "Recibí el código por WhatsApp", body: "En unos segundos te llega un mensaje de Inmercio con un código de 6 dígitos. Ese chat que se acaba de abrir es donde vas a hablarle al bot de ahora en más." },
          { title: "Ingresá el código en el panel", body: "Volvé a la pantalla de registro y escribí los 6 dígitos que recibiste. Inmercio confirma que el número quedó verificado y te lleva al siguiente paso. Listo: tu WhatsApp ya está conectado." },
        ],
      },
    ],
  },
  {
    slug: "bot-whatsapp",
    title: "Bot de WhatsApp",
    icon: "whatsapp",
    color: "var(--cat-sage)",
    tint: "#E5F4EC",
    strong: "#2E8B57",
    short: "Operá tu inventario por chat: facturas, stock, ventas y pedidos al proveedor.",
    desc:
      "Aprendé a usar el asistente de WhatsApp para cargar facturas, consultar stock, registrar ventas y generar pedidos sin entrar al panel.",
    articles: [
      {
        slug: "cargar-factura", title: "Cómo cargar una factura", blurb: "Enviá una foto de la factura y dejá que el bot cargue el stock.",
        intro: "Esta guía te muestra cómo actualizar el stock con una foto de la factura del proveedor, sin tipear nada a mano. Es la funcionalidad central de Inmercio y la vas a usar cada vez que recibas mercadería. Solo necesitás la factura (impresa o escrita a mano) y tu celular con WhatsApp abierto en el chat del bot.",
        read: 4, steps: [
          { title: "Sacale foto a la factura", body: "Apoyá la factura en una superficie plana, con buena luz y sin sombras encima. Asegurate de que se vean los nombres de los productos y las cantidades con claridad. Si la factura tiene varias hojas, sacá una foto por hoja, pero las vas a mandar de a una (no todas juntas). Para facturas escritas a mano, prestale atención a que la letra se lea bien en la imagen, sobre todo en las cantidades." },
          { title: "Enviá la foto al bot por WhatsApp", body: "Abrí el chat de Inmercio y mandá la foto como cualquier imagen que compartirías con un contacto. Importante: mandá una foto por vez. Si la factura tiene varias hojas, enviá la primera, esperá a que el bot la procese, y después mandá la siguiente; el bot va sumando los productos de cada hoja a la misma factura sin que tengas que repetir nada." },
          { title: "Esperá el procesamiento", body: "El bot te responde con un mensaje del tipo \"Procesando factura, dame unos segundos\". En general tarda entre 5 y 20 segundos según la cantidad de productos. No hace falta que hagas nada durante este rato." },
          { title: "Revisá el resumen y resolvé los productos nuevos", body: "Inmercio te devuelve la lista de productos detectados con sus cantidades. Leelo con atención: si algún nombre quedó raro o una cantidad no coincide, escribile al bot el cambio (por ejemplo, \"el segundo son 12, no 2\"). Si el bot detecta un producto que no estaba en tu catálogo, te pregunta si querés darlo de alta como nuevo o si es el mismo producto con otro nombre (por ejemplo, lo que un proveedor llama \"Pañales P&G G x40\" puede ser el mismo que ya tenés cargado como \"Pampers G\")." },
          { title: "Confirmá para actualizar el stock", body: "Cuando esté todo bien, respondele \"sí\" o \"confirmo\" al bot. En el momento se actualiza el stock de cada producto sumando las cantidades de la factura, y queda registrado en el historial del panel con la fecha y el detalle de los productos sumados." },
        ],
      },
      {
        slug: "consultar-stock", title: "Consultar stock por WhatsApp", blurb: "Preguntá por un producto y conocé su disponibilidad al instante.",
        intro: "Esta guía te muestra cómo saber cuánto te queda de cualquier producto sin moverte del mostrador ni ir a revisar la estantería. Es útil cuando un cliente te pregunta si tenés algo en particular, antes de armar un pedido al proveedor, o simplemente para chequear cómo está tu inventario en el día a día. Solo necesitás tu celular con el chat de Inmercio abierto.",
        read: 2, steps: [
          { title: "Abrí el chat de Inmercio", body: "Desde WhatsApp, abrí la conversación con el bot de Inmercio (la misma donde verificaste tu número al principio). Podés hacerlo desde donde estés: atendiendo en el local, en la trastienda, o incluso fuera del negocio." },
          { title: "Escribí tu consulta en lenguaje natural", body: "Preguntale al bot como le preguntarías a alguien del equipo. Por ejemplo: \"¿cuánto me queda de pañales Pampers G?\" o \"stock de coca 1.5\". No hace falta un formato especial ni escribir el nombre exacto del producto. Si querés consultar varios a la vez, los podés meter en el mismo mensaje: \"fijate cuánto tengo de yerba Rosamonte, harina 000 y aceite Cocinero\"." },
          { title: "Recibí la respuesta con el stock disponible", body: "En menos de 5 segundos el bot te responde con el stock actual de cada producto que pediste y te marca si alguno está por debajo del mínimo configurado. Si alguno está en stock bajo, el bot te ofrece armar el pedido al proveedor en el momento, así no tenés que volver a buscarlo después." },
        ],
      },
      {
        slug: "registrar-ventas", title: "Registrar una venta desde el chat", blurb: "Descontá productos del inventario a medida que vendés.",
        intro: "Esta guía te muestra cómo descontar productos del stock cuando hacés una venta, sin tipear nada formal ni abrir una pantalla aparte. Podés hacerlo en el momento (apenas el cliente se va) o juntar las ventas y cargarlas todas juntas al cierre del día, lo que te resulte más cómodo. Solo necesitás el chat de Inmercio abierto y saber qué vendiste.",
        read: 3, steps: [
          { title: "Abrí el chat de Inmercio", body: "Entrá a la conversación con el bot desde WhatsApp. Lo podés hacer entre cliente y cliente, en un momento libre, o al final del día cuando cerrás el local." },
          { title: "Decile al bot lo que vendiste", body: "Escribí o mandá un audio contando la venta como se lo contarías a un compañero del local. Por ejemplo: \"vendí 3 pañales Pampers G y 2 toallitas Huggies\" o \"se fueron 6 cocas de litro y medio\". Si juntaste varias ventas del día, podés mandar todo de una: \"hoy salieron 12 paquetes de pañales talle G, 8 talle XG, 4 latas de leche en polvo y 2 mamaderas Avent\"." },
          { title: "Revisá el resumen", body: "El bot te devuelve la lista de productos y cantidades que entendió. Leelo con calma para asegurarte de que esté todo bien. Si algo quedó mal interpretado (por ejemplo, el bot entendió \"Pampers G\" cuando vos dijiste \"XG\"), avisale el cambio en el mismo chat y te actualiza el resumen." },
          { title: "Confirmá y el stock se descuenta", body: "Cuando esté todo correcto, respondele \"sí\" o \"confirmo\". En el momento se descuentan las cantidades del stock de cada producto y queda registrado en el historial de actividad del panel. Si alguno de los productos vendidos quedó por debajo del mínimo, el bot te avisa al toque para que lo tengas en cuenta para el próximo pedido." },
        ],
      },
      {
        slug: "pedidos-al-proveedor", title: "Generar un pedido al proveedor", blurb: "Armá un pedido de reposición a partir de tu stock bajo.",
        intro: "Esta guía te muestra cómo dejar listo el texto del pedido al proveedor en segundos, sin armarlo a mano ni revisar producto por producto qué te falta. Es útil cuando uno o varios productos llegaron al stock mínimo, antes de hablar con un proveedor para reponer, o cuando querés adelantarte y tener todo organizado para la próxima compra. Solo necesitás el chat de Inmercio abierto y saber a qué proveedor le vas a pedir.",
        read: 4, steps: [
          { title: "Pedile al bot que arme el pedido", body: "Cuando quieras que Inmercio te arme el pedido, escribile al bot directamente: \"armame los pedidos pendientes\" para que te prepare uno con productos en mínimo." },
          { title: "Revisá el borrador que arma el bot", body: "Inmercio te devuelve el texto del pedido con el detalle: producto y cantidad sugerida. La cantidad sugerida se calcula según el stock actual, el mínimo y la rotación reciente, pero es solo una recomendación." },
          { title: "Ajustá lo que haga falta", body: "Si querés cambiar alguna cantidad, sumar un producto que el bot no incluyó, o sacar algo del pedido, decíselo al bot en el mismo chat (por ejemplo, \"subí los pañales G a 20 unidades\" o \"sacá el aceite del pedido\"). El bot te actualiza el borrador con los cambios." },
          { title: "Copiá el texto y enviáselo al proveedor", body: "Cuando el pedido esté como lo querés, el bot te deja el texto listo en un mensaje aparte para que lo copies con un solo toque. Pegalo en el chat de WhatsApp del proveedor y mandalo. Inmercio no se lo envía directamente porque la conversación con el proveedor la seguís manejando vos." },
        ],
      },
    ],
  },
  {
    slug: "dashboard",
    title: "Panel web",
    icon: "layout-dashboard",
    color: "var(--cat-water)",
    tint: "#EAF1FA",
    strong: "#4A77C2",
    short: "Visualizá y administrá todo tu negocio desde el panel de control.",
    desc:
      "Conocé las vistas del panel web: cómo leer la vista general, administrar el inventario y configurar las alertas de tu cuenta.",
    articles: [
      {
        slug: "vista-general", title: "Vista general", blurb: "Conocé el inicio del panel y entendé qué te muestra cada bloque.",
        intro: "Esta guía te muestra cómo ver de un vistazo cómo está tu negocio sin tener que revisar producto por producto. Es útil para chequear rápido al empezar el día, al cierre, o una vez por semana cuando querés tener un panorama de cómo viene la cosa. Solo necesitás el panel web abierto y la sesión iniciada.",
        read: 3, steps: [
          { title: "Entrá a la sección Principal", body: "Es la pantalla que vas a ver apenas inicies sesión, y también podés volver a ella en cualquier momento desde el menú lateral izquierdo tocando \"Principal\". Esta sección concentra todo lo importante de tu negocio en un solo lugar para que no tengas que entrar en cada apartado por separado." },
          { title: "Mirá las métricas clave", body: "Arriba de la pantalla vas a ver tres números que resumen el estado actual: la cantidad de entradas del día (la cantidad de productos que entraron en el día), la cantidad de salidas del día, y la cantidad de productos en estado crítico o bajo. Esa última tarjeta es la que más conviene mirar todos los días: si el número subió respecto al día anterior, hay productos nuevos que necesitan reposición." },
          { title: "Revisá los gráficos y la actividad reciente", body: "Más abajo vas a encontrar dos gráficos: uno con las entradas y salidas del período (para ver cómo se mueve tu inventario en el tiempo) y otro con la distribución del stock por categorías (para identificar de un vistazo qué rubro pesa más). Por debajo vas a ver las últimas 5 operaciones de entrada o salida, así sabés qué fue lo último que se registró sin tener que entrar al historial completo." },
        ],
      },
      {
        slug: "inventario", title: "Gestionar el inventario desde el panel", blurb: "Buscá, filtrá y editá tus productos en la tabla de inventario.",
        intro: "Esta guía te muestra cómo agregar productos nuevos a mano y editar los que ya tenés cargados desde el panel web. Es útil cuando querés sumar un producto que todavía no pasó por el bot, corregir un dato (como el precio o la categoría), o ajustar el stock mínimo de algo puntual. La mayoría del tiempo Inmercio actualiza todo solo desde WhatsApp, pero esta sección está para los casos en los que querés tocar algo a mano. Solo necesitás el panel abierto y los datos del producto a mano (nombre, categoría, precio, stock).",
        read: 5, steps: [
          { title: "Abrí la sección Inventario", body: "En el menú lateral izquierdo del panel, tocá \"Inventario\". Vas a ver la lista completa de tus productos con stock actual, stock mínimo y estado (Disponible, Bajo o Agotado). Desde acá podés agregar productos nuevos o editar los que ya tenés." },
          { title: "Agregá un producto nuevo", body: "En la parte superior derecha de la lista, tocá el botón \"Agregar\". Se te abre el formulario para cargar un producto nuevo." },
          { title: "Completá los datos y creá el producto", body: "Cargá los datos del producto: nombre, categoría, precio, si se maneja por peso o por cantidad, stock actual y stock mínimo. Cuando esté todo, tocá \"Crear producto\" y el producto queda agregado al inventario al momento." },
          { title: "Buscá y abrí el producto que querés modificar", body: "Si lo que querés es cambiar algo de un producto que ya existe (la cantidad, el precio, el mínimo, etc.), usá el buscador que está arriba de la lista y escribí el nombre. Cuando lo encuentres, tocá el botón de editar (el ícono del lápiz) al lado del producto." },
          { title: "Realizá los cambios y guardá", body: "Se te abre la ficha del producto con todos los datos editables. Modificá lo que necesites (por ejemplo, ajustar el stock actual a la cantidad real que tenés en la estantería) y tocá \"Aceptar cambios\". El producto queda actualizado y los cambios aparecen en el historial de actividad." },
        ],
      },
    ],
  },
  {
    slug: "configuracion",
    title: "Configuración",
    icon: "settings",
    color: "var(--cat-salmon)",
    tint: "#FCEBEC",
    strong: "#E0697A",
    short: "Ajustá tu cuenta: perfil, notificaciones, seguridad y facturación.",
    desc:
      "Personalizá tu cuenta de Inmercio: actualizá los datos de tu perfil, elegí qué avisos recibís, revisá la seguridad de tu acceso y gestioná los datos de facturación.",
    articles: [
      {
        slug: "perfil", title: "Editar los datos de tu perfil", blurb: "Actualizá tu nombre, el de tu negocio y los datos de contacto.",
        intro: "Esta guía te muestra cómo actualizar los datos de tu perfil y de tu negocio desde el panel web: tu nombre, el CUIT, el rubro y el teléfono de contacto. Es útil cuando cambió algún dato del negocio o cuando querés corregir algo que cargaste al crear la cuenta. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 2, steps: [
          { title: "Abrí la sección Perfil de Configuración", body: "En el menú lateral izquierdo del panel, tocá \"Configuración\". La primera pestaña que se abre es \"Perfil\", donde vas a ver tu foto y todos los datos de tu cuenta y de tu negocio." },
          { title: "Editá los datos que necesites", body: "Podés cambiar tu nombre y apellido, el CUIT (con el formato 30-71234567-8), el nombre del negocio, el rubro (se elige de una lista desplegable) y el teléfono de contacto. También podés cambiar la foto de perfil con una imagen JPG, GIF o PNG de hasta 800×800 píxeles. Hay dos datos que no se editan desde acá: la fecha de creación de la cuenta y el teléfono conectado a WhatsApp; para cambiar ese número, escribí a soporte." },
          { title: "Aplicá los cambios", body: "Abajo de la pantalla tenés los botones \"Cancelar\" y \"Aplicar\". El botón \"Aplicar\" se habilita cuando hay cambios y todos los campos son válidos; al tocarlo, un diálogo te pide confirmar antes de guardar. Si intentás salir de Configuración con cambios sin guardar, el panel te avisa para que no los pierdas sin querer." },
        ],
      },
      {
        slug: "notificaciones", title: "Configurar tus notificaciones", blurb: "Elegí qué avisos recibir y por dónde te llegan.",
        intro: "Esta guía te muestra cómo activar o desactivar las alertas que Inmercio te manda sobre tu inventario. Son dos: la de stock bajo y la de productos sin movimiento. Ambas arrancan desactivadas cuando creás la cuenta, así que si querés recibirlas tenés que prenderlas desde acá. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 3, steps: [
          { title: "Abrí la pestaña Notificaciones", body: "En el menú lateral izquierdo del panel, tocá \"Configuración\" y después la pestaña \"Notificaciones\". Ahí vas a ver el listado de avisos disponibles, cada uno con su interruptor." },
          { title: "Conocé las dos alertas disponibles", body: "\"Alertas de stock bajo\" te avisa cuando un producto alcanza el stock mínimo que configuraste o se agota. \"Productos sin movimiento\" te avisa cuando un producto lleva mucho tiempo sin ventas (por defecto, 30 días), para que detectes mercadería que no está rotando." },
          { title: "Prendé o apagá cada alerta", body: "Tocá el interruptor de cada alerta para activarla o desactivarla. Podés tener las dos prendidas, una sola, o ninguna: es independiente." },
          { title: "Aplicá los cambios", body: "Tocá el botón \"Aplicar\" de abajo y confirmá en el diálogo. Desde ese momento, las alertas activas aparecen en el panel de notificaciones (la campanita de arriba a la derecha) cada vez que un producto entre en esa condición." },
        ],
      },
      {
        slug: "seguridad", title: "Seguridad de tu cuenta", blurb: "Cambiá tu contraseña y revisá los accesos activos.",
        intro: "Esta guía te muestra cómo cambiar la contraseña con la que entrás a Inmercio. Es recomendable hacerlo si sospechás que alguien más la conoce, o simplemente cada tanto como buena práctica. Solo necesitás recordar tu contraseña actual; si no la recordás, al final te contamos cómo recuperarla.",
        read: 3, steps: [
          { title: "Abrí la pestaña Seguridad", body: "En el menú lateral izquierdo del panel, tocá \"Configuración\" y después la pestaña \"Seguridad\". Ahí vas a ver los tres campos para el cambio de contraseña." },
          { title: "Ingresá tu contraseña actual", body: "Escribí la contraseña con la que iniciás sesión hoy. Este paso confirma que sos vos quien está haciendo el cambio." },
          { title: "Elegí la nueva contraseña y confirmala", body: "Escribí la contraseña nueva (de hasta 64 caracteres) y repetila en el campo de confirmación para descartar errores de tipeo. Después tocá \"Aplicar\" para guardar el cambio." },
          { title: "Si no recordás tu contraseña actual", body: "Cerrá sesión y, en la pantalla de inicio de sesión, tocá \"¿Olvidaste tu contraseña?\". Ingresás tu email y te llega un enlace para crear una nueva. Tené en cuenta que si entrás con Google o Apple, la contraseña la gestionás desde esa cuenta, no desde Inmercio." },
        ],
      },
      {
        slug: "facturacion", title: "Datos de facturación", blurb: "Revisá tu plan, tu método de pago y los datos fiscales de tus comprobantes.",
        intro: "Esta guía te muestra dónde viven los datos vinculados al cobro de tu suscripción: el CUIT que aparece en tus comprobantes, el plan activo y la tarjeta con la que pagás. Es útil revisarlos cuando cambia algún dato fiscal del negocio o cuando renovás la tarjeta. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 2, steps: [
          { title: "Mantené tu CUIT actualizado", body: "El CUIT es el dato fiscal de tus comprobantes y se edita desde la pestaña \"Perfil\" de Configuración, junto con el resto de los datos del negocio. Cargalo con el formato 30-71234567-8 y aplicá los cambios." },
          { title: "Revisá tu plan activo", body: "En la pestaña \"Facturación\" de Configuración vas a ver la tarjeta \"Plan Activo\" con el nombre del plan, el precio mensual en ARS, la fecha del próximo cobro y el estado de la suscripción." },
          { title: "Revisá el método de pago y los comprobantes", body: "Más abajo en la misma pestaña está el \"Método de Pago\" (la tarjeta guardada, con sus últimos 4 dígitos y el vencimiento) con el botón \"Cambiar\" para reemplazarla, y el \"Historial de Facturación\" desde donde podés descargar cada comprobante en PDF." },
        ],
      },
    ],
  },
  {
    slug: "suscripcion",
    title: "Suscripción",
    icon: "credit-card",
    color: "var(--cat-honey)",
    tint: "#FFF6E3",
    strong: "#E0972A",
    short: "Conocé los planes, la facturación y cómo gestionar tu suscripción.",
    desc:
      "Información sobre los planes disponibles, los métodos de pago, los comprobantes y cómo actualizar o cancelar la suscripción de Inmercio.",
    articles: [
      {
        slug: "planes", title: "Conocé los planes de Inmercio", blurb: "Qué incluye cada plan y a qué tipo de negocio le sirve.",
        intro: "Esta guía te muestra qué incluye cada plan de Inmercio para que elijas el que mejor le queda a tu negocio. Hay dos planes mensuales, Inicial y Pro, y la diferencia principal está en el tamaño del catálogo y en las herramientas de análisis. Al final te contamos dónde ver cuál tenés activo.",
        read: 3, steps: [
          { title: "Plan Inicial", body: "Cuesta $15.000 ARS por mes e incluye hasta 1.000 productos en el catálogo, la gestión de stock por WhatsApp y un usuario. Es el plan pensado para arrancar: cubre todo el flujo del bot (facturas, ventas, consultas de stock y pedidos al proveedor) y el panel web completo." },
          { title: "Plan Pro", body: "Cuesta $24.500 ARS por mes e incluye hasta 10.000 productos, análisis IA avanzado y soporte prioritario, también con un usuario. Le sirve a negocios con catálogos grandes o que quieren sacarle más jugo a los datos del inventario." },
          { title: "Elegí según tu negocio", body: "La pregunta clave es cuántos productos distintos manejás: si estás cómodo por debajo de los 1.000, el Inicial te alcanza; si tu catálogo es más grande o querés análisis IA y respuesta prioritaria de soporte, andá al Pro. Podés cambiar de plan más adelante si tu negocio crece." },
          { title: "Mirá cuál tenés activo", body: "En el panel, entrá a Configuración y abrí la pestaña \"Facturación\". La tarjeta \"Plan Activo\" te muestra el nombre del plan, el precio mensual, la fecha del próximo cobro y el estado de tu suscripción." },
        ],
      },
      {
        slug: "cambiar-plan", title: "Cambiar de plan", blurb: "Cómo hacer upgrade o downgrade desde tu cuenta.",
        intro: "Esta guía te muestra cómo pasar de un plan a otro desde el panel web. Es útil cuando tu catálogo creció y necesitás el límite más alto del plan Pro, o al revés, cuando querés bajar al plan Inicial. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 3, steps: [
          { title: "Entrá a la pestaña Facturación", body: "En el menú lateral izquierdo del panel, tocá \"Configuración\" y después la pestaña \"Facturación\". Arriba de todo vas a ver la tarjeta \"Plan Activo\" con tu plan actual." },
          { title: "Tocá \"Ver todos los planes\"", body: "Debajo de los datos del plan activo está el botón \"Ver todos los planes\". Al tocarlo vas a ver los dos planes disponibles, Inicial y Pro, con lo que incluye cada uno." },
          { title: "Elegí el plan nuevo", body: "Seleccioná el plan al que querés pasar. Si vas del Inicial al Pro sumás capacidad de catálogo, análisis IA y soporte prioritario; si vas del Pro al Inicial, asegurate antes de que tu catálogo no supere los 1.000 productos del límite." },
          { title: "Verificá el cambio", body: "Al confirmar, la tarjeta \"Plan Activo\" pasa a mostrar el plan nuevo con su precio. Los próximos cobros mensuales se hacen por el importe del plan nuevo con la tarjeta que tenés guardada como método de pago." },
        ],
      },
      {
        slug: "metodos-de-pago", title: "Métodos de pago", blurb: "Tarjetas y medios de pago aceptados para tu suscripción.",
        intro: "Esta guía te muestra cómo se cobra la suscripción de Inmercio y cómo ver o cambiar la tarjeta guardada. El cobro es mensual y automático, así que lo único que tenés que mantener al día es que la tarjeta esté vigente. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 2, steps: [
          { title: "Cómo se cobra la suscripción", body: "Inmercio te cobra todos los meses de forma automática con la tarjeta que dejaste guardada, a través de Mercado Pago. La fecha exacta del próximo cobro la ves siempre en la tarjeta \"Plan Activo\" de la pestaña Facturación." },
          { title: "Mirá la tarjeta guardada", body: "En Configuración, abrí la pestaña \"Facturación\" y buscá el bloque \"Método de Pago\". Ahí ves la marca de la tarjeta, los últimos 4 dígitos y la fecha de vencimiento, por ejemplo \"Visa terminada en 4242, vence 08/27\"." },
          { title: "Cambiala cuando haga falta", body: "Tocá el botón \"Cambiar\" al lado de la tarjeta para reemplazarla por otra. Convienen hacerlo antes de que venza la actual, así el cobro mensual no se rechaza y tu suscripción no pasa a estado de pago pendiente." },
        ],
      },
      {
        slug: "comprobantes", title: "Descargar comprobantes de pago", blurb: "Accedé a tus facturas y comprobantes desde el panel.",
        intro: "Esta guía te muestra dónde encontrar los comprobantes de cada cobro de tu suscripción y cómo descargarlos en PDF. Es útil para tu contabilidad o cuando tu contador te pide los respaldos de los pagos. Solo necesitás el panel abierto con la sesión iniciada.",
        read: 2, steps: [
          { title: "Entrá al Historial de Facturación", body: "En el menú lateral izquierdo del panel, tocá \"Configuración\", abrí la pestaña \"Facturación\" y bajá hasta el bloque \"Historial de Facturación\". Ahí están listados todos los cobros de tu suscripción, del más reciente al más viejo." },
          { title: "Identificá el cobro que buscás", body: "Cada fila muestra la descripción del período (por ejemplo, \"Plan Pro – Junio 2026\"), la fecha del cobro, el monto en ARS y el estado: Pagado, Pendiente o Rechazado." },
          { title: "Descargá el PDF", body: "Tocá el botón de descarga (el ícono de la flecha hacia abajo) a la derecha del cobro y se baja el comprobante en PDF, listo para guardar o reenviar." },
        ],
      },
      {
        slug: "cancelar-suscripcion", title: "Cancelar la suscripción", blurb: "Cómo dar de baja y qué pasa con tus datos.",
        intro: "Esta guía te muestra cómo dar de baja tu suscripción de Inmercio y qué conviene hacer antes de cancelar. La baja se gestiona con el equipo de soporte, así que el proceso arranca con un mensaje. Antes de empezar, tené a mano el email con el que está registrada tu cuenta.",
        read: 3, steps: [
          { title: "Conocé los estados de la suscripción", body: "Tu suscripción puede estar en período de prueba, activa, con pago pendiente (cuando un cobro se rechazó) o cancelada. El estado actual lo ves siempre en la tarjeta \"Plan Activo\" de la pestaña Facturación, en Configuración." },
          { title: "Descargá lo que necesites antes de la baja", body: "Antes de cancelar, entrá al \"Historial de Facturación\" y descargá los comprobantes en PDF que quieras conservar para tu contabilidad." },
          { title: "Pedí la baja a soporte", body: "Escribí a soporte@inmercio.com desde el email de tu cuenta pidiendo la cancelación. El equipo de soporte procesa la baja y te confirma por el mismo medio. Si tenés dudas sobre qué pasa con los datos de tu negocio después de la baja, aprovechá ese mismo mensaje para consultarlo." },
          { title: "Verificá que la baja se aplicó", body: "Cuando la baja esté procesada, el estado en la tarjeta \"Plan Activo\" pasa a \"Cancelado\" y no se generan más cobros mensuales. Si más adelante querés volver, escribí de nuevo a soporte para reactivar tu cuenta." },
        ],
      },
    ],
  },
];

// Preguntas frecuentes por categoria
export const FAQ = [
  {
    group: "Primeros pasos",
    items: [
      { q: "¿Necesito tarjeta de crédito para empezar?", a: "[Respuesta placeholder sobre el alta de cuenta y el período de prueba.]" },
      { q: "¿Puedo importar mi catálogo desde una planilla?", a: "[Respuesta placeholder sobre la carga inicial de productos.]" },
      { q: "¿Cuánto tarda en estar listo el bot de WhatsApp?", a: "[Respuesta placeholder sobre la vinculación del número.]" },
    ],
  },
  {
    group: "Bot de WhatsApp",
    items: [
      { q: "¿El bot entiende fotos de facturas escritas a mano?", a: "[Respuesta placeholder sobre el reconocimiento de facturas.]" },
      { q: "¿Puedo usar más de un número de WhatsApp?", a: "[Respuesta placeholder sobre líneas asociadas a la cuenta.]" },
      { q: "¿Qué pasa si registro una venta por error?", a: "[Respuesta placeholder sobre cómo revertir movimientos.]" },
    ],
  },
  {
    group: "Panel web",
    items: [
      { q: "¿Cuántos usuarios pueden acceder al panel?", a: "[Respuesta placeholder sobre usuarios y permisos.]" },
      { q: "¿Las alertas llegan también por WhatsApp?", a: "[Respuesta placeholder sobre canales de notificación.]" },
    ],
  },
  {
    group: "Suscripción",
    items: [
      { q: "¿Puedo cambiar de plan en cualquier momento?", a: "Sí. Entrá a Configuración → Facturación y tocá \"Ver todos los planes\" para pasar del plan Inicial ($15.000 ARS/mes, hasta 1.000 productos) al Pro ($24.500 ARS/mes, hasta 10.000 productos con análisis IA y soporte prioritario), o al revés. El próximo cobro mensual ya se hace por el importe del plan nuevo." },
      { q: "¿Cómo descargo mis comprobantes de pago?", a: "En Configuración → Facturación, bajá hasta el \"Historial de Facturación\". Cada cobro aparece con su período, monto y estado, y con el ícono de descarga a la derecha bajás el comprobante en PDF." },
      { q: "¿Qué pasa con mis datos si cancelo?", a: "Al cancelar, la suscripción pasa a estado \"Cancelado\" y no se generan más cobros. La baja se pide escribiendo a soporte@inmercio.com; en ese mismo mensaje podés consultar por los datos de tu negocio y descargar antes los comprobantes que necesites desde el historial." },
    ],
  },
];

// Busquedas rapidas por categoria y articulo
export const CAT_BY_SLUG: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

export function findArticle(catSlug: string, artSlug: string) {
  const cat = CAT_BY_SLUG[catSlug];
  if (!cat) return null;
  const idx = cat.articles.findIndex((a) => a.slug === artSlug);
  if (idx === -1) return null;
  return { cat, article: cat.articles[idx], index: idx };
}

// Orden de los articulos para anterior y siguiente
export const FLAT_ARTICLES: { cat: Category; article: Article }[] = [];
CATEGORIES.forEach((c) => c.articles.forEach((a) => FLAT_ARTICLES.push({ cat: c, article: a })));

export function neighbors(catSlug: string, artSlug: string) {
  const i = FLAT_ARTICLES.findIndex((x) => x.cat.slug === catSlug && x.article.slug === artSlug);
  return {
    prev: i > 0 ? FLAT_ARTICLES[i - 1] : null,
    next: i < FLAT_ARTICLES.length - 1 ? FLAT_ARTICLES[i + 1] : null,
  };
}

// Buscador de articulos
export function searchArticles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[0300-036f]/g, "");
  const nq = norm(q);
  return FLAT_ARTICLES.filter(({ cat, article }) =>
    norm(article.title).includes(nq) ||
    norm(article.blurb).includes(nq) ||
    norm(cat.title).includes(nq)
  );
}
