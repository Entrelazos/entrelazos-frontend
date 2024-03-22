import {
  Home,
  LocalMall,
  Business,
  Badge,
  Collections,
  Favorite,
  PeopleAlt,
} from '@mui/icons-material';
import ProfileComponent from '../pages/Profile/components/profile.component';

export const CATEGORIES = [
  { name: 'Otros', image: 'otros.png' },
  { name: 'Escolar', image: 'escolar.png' },
  { name: 'Postres y Alimentación', image: 'postres-alimentacion.png' },
  { name: 'Juguetería', image: 'jugueteria.png' },
  { name: 'Artesanías', image: 'artesanias.png' },
  { name: 'Regalos', image: 'regalos.png' },
  { name: 'Salud', image: 'salud.png' },
  { name: 'Libros', image: 'libros.png' },
  { name: 'Ropa', image: 'ropa.png' },
  { name: 'Formación', image: 'formacion.png' },
  { name: 'Perfumería y Cosméticos', image: 'perfumeria-cosmeticos.png' },
  { name: 'Mascotas', image: 'mascotas.png' },
  { name: 'Tecnología', image: 'tecnologia.png' },
  { name: 'Calzado', image: 'calzado.png' },
  { name: 'Música', image: 'musica.png' },
  { name: 'Bebés', image: 'bebes.png' },
].sort((a, b) => {
  if (a.name === 'Otros') return 1; // 'Otros' will be at the end
  if (b.name === 'Otros') return -1;
  return a.name.localeCompare(b.name);
});

export const DRAWER_ITEMS = [
  { name: 'Home', link: '/', icon: Home },
  {
    name: 'Productos y Servicios',
    link: '/productos-servicios',
    icon: LocalMall,
  },
  { name: 'Empresas', link: '/empresas', icon: Business },
];

export const PROFILE_TABS = [
  {
    id: 1,
    label: 'Profile',
    icon: Badge,
    component: ProfileComponent,
  },
  {
    id: 2,
    label: 'Favoritos',
    icon: Favorite,
    component: ProfileComponent,
  },
  {
    id: 3,
    label: 'Contactos',
    icon: PeopleAlt,
    component: ProfileComponent,
  },
  {
    id: 4,
    label: 'Galeria',
    icon: Collections,
    component: ProfileComponent,
  },
];
