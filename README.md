
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


## Inventario de componentes

La aplicación está organizada mediante componentes funcionales de React, cada uno encargado de una parte específica del sistema.

- **Login.jsx:** permite iniciar sesión mediante las cuentas de prueba y los usuarios registrados.
- **BusquedaEventos.jsx:** permite consultar, buscar y filtrar los eventos disponibles.
- **AdministracionEventos.jsx:** permite registrar, editar y eliminar eventos, así como modificar sus precios, imágenes y disponibilidad.
- **FechasBoletos.jsx:** permite seleccionar eventos, zonas y cantidades de boletos.
- **Carrito.jsx:** muestra los boletos seleccionados, permite modificar cantidades y aplicar códigos de descuento.
- **Pagos.jsx:** simula el proceso de pago, verifica la disponibilidad y genera los códigos QR de los boletos.
- **Perfil.jsx:** permite consultar y actualizar la información del usuario y revisar sus compras.
- **Reportes.jsx:** muestra información sobre las ventas, los ingresos y los boletos vendidos.

## Administración del estado

Para controlar la información de la aplicación se utilizan diferentes herramientas de React:

- **useState:** administra estados como los formularios, las cantidades de boletos, el carrito y las vistas.
- **useEffect:** ejecuta operaciones cuando se producen cambios en determinados estados, como guardar información en `localStorage`.
- **useReducer:** centraliza las operaciones de registro, actualización y eliminación de eventos.
- **Context API:** permite compartir información entre componentes. Se utiliza principalmente para administrar los eventos mediante `EventosContext.jsx`.

La sesión del usuario se administra desde el estado de `App.jsx` y se conserva mediante `localStorage`.

## Datos simulados y funcionamiento del sistema

El proyecto utiliza información de prueba para representar las operaciones de una plataforma de venta de boletos.
## Datos no simulados#
No se implementó la recuperación de contraseñas mediante correo electrónico.

### Usuarios de prueba

| Correo electrónico | Contraseña | Rol |
| cliente@gmail.com | 123456 | Cliente |
| admin@gmail.com | 123456 | Administrador |
| organizador@gmail.com | 123456 | Organizador |

### Información de los eventos

Los eventos iniciales están definidos en los archivos de datos del proyecto. Cada uno contiene información como nombre, descripción, categoría, fecha, hora, lugar, imagen, zonas, precios y disponibilidad de boletos.

El administrador puede modificar esta información desde el panel correspondiente.

### Proceso de compra

El proceso de compra se desarrolla de la siguiente manera:

1. El cliente consulta los eventos disponibles.
2. Selecciona un evento, una zona y la cantidad de boletos.
3. Agrega los boletos al carrito.
4. Revisa el resumen de la compra y puede aplicar un código de descuento.
5. Completa el formulario del pago simulado.
6. Si la operación es exitosa, se actualiza la disponibilidad de boletos y se registra la orden.
7. Se generan códigos QR para los boletos adquiridos.

## Decisiones de diseño y arquitectura

Durante el desarrollo de TicketMarket se tomaron decisiones para mantener una estructura organizada y facilitar el mantenimiento de la aplicación.

- **Componentes independientes:** las funcionalidades se distribuyeron en componentes para separar responsabilidades y facilitar las modificaciones.
- **Context API:** se utilizó para compartir información de los eventos entre diferentes partes de la aplicación.
- **LocalStorage:** se eligió para conservar información en el navegador sin necesidad de implementar una base de datos externa.
- **Datos locales:** los usuarios y eventos iniciales se definieron en archivos JavaScript para facilitar su administración.
- **Operaciones simuladas:** se implementaron procesos de prueba para representar las compras y los pagos sin realizar transacciones reales.
- **React y Vite:** se utilizaron para desarrollar la interfaz y facilitar el entorno de desarrollo y compilación.

