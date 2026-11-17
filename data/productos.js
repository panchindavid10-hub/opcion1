/* ==========================================================================
   Catálogo de productos — Muso Business
   --------------------------------------------------------------------------
   IMPORTANTE: los productos de esta lista son EJEMPLOS para mostrar el diseño.
   Reemplácelos por el listado real de la empresa antes de publicar.

   Cómo agregar un producto: copie un bloque { ... }, péguelo al final de la
   lista (separado por coma) y edite sus datos:
     id            -> código único (puede ser el mismo número de parte)
     nombre        -> nombre en español        | nombre_en -> nombre en inglés
     pn            -> número de parte (P/N)
     serie         -> número de serie ("" si no aplica)
     categoria     -> fuselaje | motores | avionica | consumibles | gse | senaletica
     subcategoria  -> texto libre en español   | subcategoria_en -> en inglés
     certificacion -> por ejemplo "FAA"
     disponibilidad-> "stock" (disponible) o "pedido" (bajo pedido)
   ========================================================================== */
window.MUSO_PRODUCTOS = [
  { id: "MB-AV-001", nombre: "Indicador de actitud (horizonte artificial)", nombre_en: "Attitude indicator (artificial horizon)", pn: "MB-AV-001", serie: "", categoria: "avionica", subcategoria: "Instrumentos de vuelo", subcategoria_en: "Flight instruments", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-AV-002", nombre: "Altímetro barométrico", nombre_en: "Barometric altimeter", pn: "MB-AV-002", serie: "", categoria: "avionica", subcategoria: "Instrumentos de vuelo", subcategoria_en: "Flight instruments", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-AV-003", nombre: "Indicador de velocidad aerodinámica", nombre_en: "Airspeed indicator", pn: "MB-AV-003", serie: "", categoria: "avionica", subcategoria: "Instrumentos de vuelo", subcategoria_en: "Flight instruments", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-AV-004", nombre: "Radio de comunicación VHF", nombre_en: "VHF communication radio", pn: "MB-AV-004", serie: "", categoria: "avionica", subcategoria: "Comunicación", subcategoria_en: "Communication", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-AV-005", nombre: "Panel de audio", nombre_en: "Audio panel", pn: "MB-AV-005", serie: "", categoria: "avionica", subcategoria: "Comunicación", subcategoria_en: "Communication", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-AV-006", nombre: "Receptor de navegación VOR/ILS", nombre_en: "VOR/ILS navigation receiver", pn: "MB-AV-006", serie: "", categoria: "avionica", subcategoria: "Navegación", subcategoria_en: "Navigation", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-AV-007", nombre: "Transpondedor", nombre_en: "Transponder", pn: "MB-AV-007", serie: "", categoria: "avionica", subcategoria: "Navegación", subcategoria_en: "Navigation", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-AV-008", nombre: "Indicador de temperatura de gases de escape (EGT)", nombre_en: "Exhaust gas temperature (EGT) indicator", pn: "MB-AV-008", serie: "", categoria: "avionica", subcategoria: "Instrumentos de motor", subcategoria_en: "Engine instruments", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-AV-009", nombre: "Tacómetro", nombre_en: "Tachometer", pn: "MB-AV-009", serie: "", categoria: "avionica", subcategoria: "Instrumentos de motor", subcategoria_en: "Engine instruments", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-AV-010", nombre: "Indicador de presión de aceite", nombre_en: "Oil pressure indicator", pn: "MB-AV-010", serie: "", categoria: "avionica", subcategoria: "Instrumentos de motor", subcategoria_en: "Engine instruments", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-MT-001", nombre: "Bujía / ignitor de encendido", nombre_en: "Spark plug / igniter", pn: "MB-MT-001", serie: "", categoria: "motores", subcategoria: "Encendido", subcategoria_en: "Ignition", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-MT-002", nombre: "Filtro de aceite de motor", nombre_en: "Engine oil filter", pn: "MB-MT-002", serie: "", categoria: "motores", subcategoria: "Filtros", subcategoria_en: "Filters", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-MT-003", nombre: "Filtro de combustible", nombre_en: "Fuel filter", pn: "MB-MT-003", serie: "", categoria: "motores", subcategoria: "Filtros", subcategoria_en: "Filters", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-MT-004", nombre: "Juego de empaques de motor", nombre_en: "Engine gasket kit", pn: "MB-MT-004", serie: "", categoria: "motores", subcategoria: "Sellos", subcategoria_en: "Seals", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-FS-001", nombre: "Panel de acceso de fuselaje", nombre_en: "Fuselage access panel", pn: "MB-FS-001", serie: "", categoria: "fuselaje", subcategoria: "Estructura", subcategoria_en: "Structure", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-FS-002", nombre: "Kit de remaches estructurales", nombre_en: "Structural rivet kit", pn: "MB-FS-002", serie: "", categoria: "fuselaje", subcategoria: "Estructura", subcategoria_en: "Structure", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-FS-003", nombre: "Ventanilla de cabina", nombre_en: "Cabin window", pn: "MB-FS-003", serie: "", categoria: "fuselaje", subcategoria: "Cabina", subcategoria_en: "Cabin", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-CS-001", nombre: "Aceite para motor de turbina", nombre_en: "Turbine engine oil", pn: "MB-CS-001", serie: "", categoria: "consumibles", subcategoria: "Aceites", subcategoria_en: "Oils", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-CS-002", nombre: "Aceite para motor de pistón", nombre_en: "Piston engine oil", pn: "MB-CS-002", serie: "", categoria: "consumibles", subcategoria: "Aceites", subcategoria_en: "Oils", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-CS-003", nombre: "Grasa aeronáutica multipropósito", nombre_en: "Multipurpose aviation grease", pn: "MB-CS-003", serie: "", categoria: "consumibles", subcategoria: "Lubricantes", subcategoria_en: "Lubricants", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-CS-004", nombre: "Fluido hidráulico", nombre_en: "Hydraulic fluid", pn: "MB-CS-004", serie: "", categoria: "consumibles", subcategoria: "Lubricantes", subcategoria_en: "Lubricants", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-CS-005", nombre: "Sellante aeronáutico", nombre_en: "Aviation sealant", pn: "MB-CS-005", serie: "", categoria: "consumibles", subcategoria: "Productos especiales", subcategoria_en: "Special products", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-GS-001", nombre: "Repuestos para arrancador en tierra", nombre_en: "Ground starter unit parts", pn: "MB-GS-001", serie: "", categoria: "gse", subcategoria: "Arrancadores", subcategoria_en: "Starters", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-GS-002", nombre: "Neumático de tren principal", nombre_en: "Main landing gear tire", pn: "MB-GS-002", serie: "", categoria: "gse", subcategoria: "Neumáticos", subcategoria_en: "Tires", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-GS-003", nombre: "Neumático de tren de nariz", nombre_en: "Nose landing gear tire", pn: "MB-GS-003", serie: "", categoria: "gse", subcategoria: "Neumáticos", subcategoria_en: "Tires", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-GS-004", nombre: "Escalera de mantenimiento", nombre_en: "Maintenance stairs", pn: "MB-GS-004", serie: "", categoria: "gse", subcategoria: "Escaleras", subcategoria_en: "Stairs", certificacion: "FAA", disponibilidad: "pedido" },
  { id: "MB-SN-001", nombre: "Banderolas «Remove Before Flight»", nombre_en: "“Remove Before Flight” streamers", pn: "MB-SN-001", serie: "", categoria: "senaletica", subcategoria: "Seguridad", subcategoria_en: "Safety", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-SN-002", nombre: "Conos de seguridad para plataforma", nombre_en: "Ramp safety cones", pn: "MB-SN-002", serie: "", categoria: "senaletica", subcategoria: "Plataforma", subcategoria_en: "Ramp", certificacion: "FAA", disponibilidad: "stock" },
  { id: "MB-SN-003", nombre: "Placas y calcomanías de señalización", nombre_en: "Placards and decals", pn: "MB-SN-003", serie: "", categoria: "senaletica", subcategoria: "Aeronave", subcategoria_en: "Aircraft", certificacion: "FAA", disponibilidad: "pedido" }
];
