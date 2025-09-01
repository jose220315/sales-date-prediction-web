# 📊 Sales Date Prediction Web

Una aplicación web desarrollada en Angular para la gestión de clientes y predicción de fechas de ventas. Esta herramienta permite visualizar información de clientes, gestionar pedidos y generar gráficos de análisis de datos de ventas.

## 🚀 Características Principales

- **Gestión de Clientes**: Visualización y búsqueda de clientes con información de pedidos
- **Predicción de Ventas**: Análisis predictivo de próximas fechas de pedidos por cliente
- **Gestión de Pedidos**: Creación y visualización detallada de pedidos
- **Visualización de Datos**: Gráficos interactivos con D3.js para análisis de ventas
- **Interfaz Responsiva**: Diseño adaptable para diferentes dispositivos
- **Paginación Avanzada**: Navegación eficiente a través de grandes conjuntos de datos

## 🛠️ Tecnologías Utilizadas

- **Framework**: Angular 19.2.0
- **Lenguaje**: TypeScript 5.7.2
- **Visualización**: D3.js 7.9.0
- **Servidor**: Express.js 4.18.2
- **Estilos**: SCSS
- **Testing**: Jasmine y Karma
- **Renderizado**: Angular SSR (Server-Side Rendering)

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- Angular CLI (versión 19.2.15)
- npm o yarn

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/jose220315/sales-date-prediction-web.git
cd sales-date-prediction-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivos de configuración de ejemplo
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
```

## 🚀 Ejecución del Proyecto

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
npm run start
```

La aplicación estará disponible en `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.


## 🔧 Funcionalidades Implementadas

### Gestión de Clientes
- Listado paginado de clientes
- Búsqueda por nombre de cliente
- Ordenamiento por columnas
- Visualización de última fecha de pedido
- Predicción de próximo pedido

### Gestión de Pedidos
- Visualización detallada de pedidos por cliente
- Creación de nuevos pedidos con múltiples detalles
- Cálculo automático de totales
- Validación de formularios
- Gestión de empleados, transportistas y productos

### Visualización de Datos
- Gráficos de barras interactivos
- Entrada de datos personalizable
- Navegación intuitiva

## 🔗 API y Servicios

La aplicación se comunica con una API backend a través de los siguientes servicios:

- `CustomerService`: Gestión de datos de clientes
- `OrderService`: Operaciones CRUD de pedidos
- `EmployeeService`: Información de empleados
- `ShipperService`: Datos de transportistas
- `ProductService`: Catálogo de productos

## 🎯 Información de la Prueba

### Objetivo
Esta aplicación fue desarrollada como parte de una prueba técnica para demostrar habilidades en:
- Desarrollo frontend con Angular
- Integración con APIs REST
- Visualización de datos
- Diseño de interfaces responsivas
- Gestión de estado y formularios reactivos

### Características Evaluadas
- ✅ Arquitectura limpia y modular
- ✅ Componentización efectiva
- ✅ Gestión de estado con RxJS
- ✅ Formularios reactivos con validación
- ✅ Diseño responsivo y UX intuitiva
- ✅ Integración con librerías de visualización
- ✅ Manejo de errores y estados de carga
- ✅ Tipado fuerte con TypeScript

Este proyecto fue desarrollado como prueba técnica. Para sugerencias o mejoras, puedes contactar al desarrollador.

---

⭐ Si este proyecto te resultó interesante, ¡no dudes en darle una estrella!
