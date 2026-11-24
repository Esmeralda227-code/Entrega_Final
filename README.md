
# TicketMarket

## Descripción

TicketMarket es una aplicación web desarrollada con React que permite consultar eventos, seleccionar y comprar boletos mediante un proceso de pago simulado. También cuenta con un panel de administración para gestionar eventos y consultar reportes de ventas.

## Tecnologías utilizadas

- React 19
- JavaScript
- HTML5
- CSS3
- Vite 8
- LocalStorage

## Estructura del proyecto

- **public:** contiene recursos estáticos.
- **Components:** contiene los componentes principales de la aplicación, como Login, BusquedaEventos, Carrito, Pagos, Perfil, Administración y Reportes.
- **Context:** contiene los contextos utilizados para compartir y administrar la información de los eventos y la sesión.
- **Data:** almacena los datos iniciales de usuarios y eventos.
- **App.jsx:** coordina las vistas y funcionalidades principales.
- **App.css:** contiene los estilos de la aplicación.
- **index.css:** define los estilos generales.
- **main.jsx:** inicializa React y configura los proveedores de contexto.

## Funcionalidades principales

- Inicio de sesión con usuarios de prueba.
- Consulta y búsqueda de eventos.
- Registro, edición y eliminación de eventos.
- Selección de zonas y cantidades de boletos.
- Carrito de compras con código de descuento.
- Simulación del proceso de pago.
- Generación de boletos con códigos QR.
- Perfil de usuario.
- Panel de administración.
- Reportes de ventas.

## Almacenamiento de datos

La aplicación utiliza `localStorage` para conservar la sesión, los carritos de los usuarios, los eventos y las órdenes de compra.

Los datos utilizados son simulados y se almacenan en el navegador.

## Limitaciones

- No cuenta con un backend ni una base de datos externa.
- Los pagos son simulados y no realizan transacciones reales.
- Los códigos QR se generan desde la aplicación.
- La información se conserva en el almacenamiento local del navegador.

## Autoría

Proyecto académico desarrollado como parte de la implementación del prototipo TicketMarket en React.
