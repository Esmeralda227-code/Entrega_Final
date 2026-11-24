
function Reportes({ ordenes = [] }) {
  const totalVentas = ordenes.reduce(
    (total, orden) => total + (Number(orden.total) || 0),
    0
  );

  const cantidadBoletos = ordenes.reduce(
    (total, orden) =>
      total +
      (orden.boletos || []).reduce(
        (suma, boleto) =>
          suma + (Number(boleto.cantidad) || 0),
        0
      ),
    0
  );

  const ventasPorEvento = new Map();

  ordenes.forEach((orden) => {
    const boletos = orden.boletos || [];

    const subtotalOrden = boletos.reduce(
      (total, boleto) =>
        total +
        (Number(boleto.precio) || 0) *
        (Number(boleto.cantidad) || 0),
      0
    );

    const totalOrden = Number(orden.total) || 0;

    boletos.forEach((boleto) => {
      const nombreEvento =
        boleto.evento || boleto.nombre || "Evento sin nombre";

      const cantidad = Number(boleto.cantidad) || 0;

      const subtotalBoleto =
        (Number(boleto.precio) || 0) * cantidad;

      // Distribuir proporcionalmente el descuento de la orden.
      const factorDescuento =
        subtotalOrden > 0
          ? totalOrden / subtotalOrden
          : 0;

      const ventaNeta = subtotalBoleto * factorDescuento;

      const registro = ventasPorEvento.get(nombreEvento) || {
        nombre: nombreEvento,
        boletos: 0,
        ventas: 0
      };

      registro.boletos += cantidad;
      registro.ventas += ventaNeta;

      ventasPorEvento.set(nombreEvento, registro);
    });
  });

  const eventosOrdenados = Array.from(
    ventasPorEvento.values()
  ).sort((a, b) => b.ventas - a.ventas);

  return (
    <section className="reportes">
      <h2>Reportes de ventas</h2>

      <div className="reportes-resumen">
        <article className="reporte-tarjeta">
          <h3>Ventas totales</h3>
          <p>${totalVentas.toFixed(2)}</p>
        </article>

        <article className="reporte-tarjeta">
          <h3>Órdenes realizadas</h3>
          <p>{ordenes.length}</p>
        </article>

        <article className="reporte-tarjeta">
          <h3>Boletos vendidos</h3>
          <p>{cantidadBoletos}</p>
        </article>
      </div>

      <div className="reportes-seccion">
        <h3>Ventas por evento</h3>

        {eventosOrdenados.length === 0 ? (
          <p>
            Todavía no hay ventas registradas.
          </p>
        ) : (
          <div className="reportes-tabla-contenedor">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Boletos vendidos</th>
                  <th>Total de ventas</th>
                </tr>
              </thead>

              <tbody>
                {eventosOrdenados.map((evento) => (
                  <tr key={evento.nombre}>
                    <td>{evento.nombre}</td>
                    <td>{evento.boletos}</td>
                    <td>${evento.ventas.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="reportes-seccion">
        <h3>Historial de órdenes</h3>

        {ordenes.length === 0 ? (
          <p>No hay órdenes registradas.</p>
        ) : (
          <div className="reportes-tabla-contenedor">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Titular</th>
                  <th>Correo</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {[...ordenes].reverse().map((orden) => (
                  <tr key={orden.id}>
                    <td>{orden.id}</td>
                    <td>{orden.fechaCompra}</td>
                    <td>{orden.titular}</td>
                    <td>{orden.correo}</td>
                    <td>
                      ${(Number(orden.total) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Reportes;
