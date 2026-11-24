
import Billie from '../Imagenes/Billie.webp';
import Brincos from '../Imagenes/Brincos.jpg';
import Franco from '../Imagenes/Franco.jpg';
import Skrillet from '../Imagenes/Skrillet.jpg';
import Valorant from '../Imagenes/Valorant.jpg';

export const eventos = [
  {
    id: 1,
    titulo: 'Billie Eilish',
    descripcion: 'Concierto de Billie Eilish en vivo.',
    categoria: 'Música',
    fecha: '2026-12-15',
    hora: '19:00',
    lugar: 'Estadio Cuscatlán',
    estado: 'Disponible',
    imagen: Billie,
    zonas: [
      { id: 1, nombre: 'General', precio: 35, disponibles: 300 },
      { id: 2, nombre: 'VIP', precio: 75, disponibles: 100 }
    ]
  },
  {
    id: 2,
    titulo: 'Brincos Dieras',
    descripcion: 'Presentación de comedia de Brincos Dieras.',
    categoria: 'Comedia',
    fecha: '2026-12-20',
    hora: '18:00',
    lugar: 'Complejo Deportivo El Cafetalón',
    estado: 'Disponible',
    imagen: Brincos,
    zonas: [
      { id: 1, nombre: 'General', precio: 20, disponibles: 250 },
      { id: 2, nombre: 'Preferencial', precio: 40, disponibles: 100 }
    ]
  },
  {
    id: 3,
    titulo: 'Franco Escamilla',
    descripcion: 'Presentación de comedia de Franco Escamilla.',
    categoria: 'Comedia',
    fecha: '2027-01-10',
    hora: '20:00',
    lugar: 'Teatro Presidente',
    estado: 'Disponible',
    imagen: Franco,
    zonas: [
      { id: 1, nombre: 'General', precio: 25, disponibles: 200 },
      { id: 2, nombre: 'VIP', precio: 55, disponibles: 80 }
    ]
  },
  {
    id: 4,
    titulo: 'Skillet',
    descripcion: 'Espectáculo musical de Skillet en vivo.',
    categoria: 'Música',
    fecha: '2027-01-20',
    hora: '19:30',
    lugar: 'Estadio Nacional Las Delicias',
    estado: 'Disponible',
    imagen: Skrillet,
    zonas: [
      { id: 1, nombre: 'General', precio: 30, disponibles: 300 },
      { id: 2, nombre: 'VIP', precio: 65, disponibles: 100 }
    ]
  },
  {
    id: 5,
    titulo: 'VALORANT',
    descripcion: 'Torneo de videojuegos VALORANT.',
    categoria: 'Videojuegos',
    fecha: '2027-02-05',
    hora: '16:00',
    lugar: 'Centro Internacional de Ferias y Convenciones',
    estado: 'Disponible',
    imagen: Valorant,
    zonas: [
      { id: 1, nombre: 'General', precio: 15, disponibles: 200 },
      { id: 2, nombre: 'VIP', precio: 30, disponibles: 75 }
    ]
  }
];
