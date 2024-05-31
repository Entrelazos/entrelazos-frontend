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
import Dashboard from '../pages/Dashboard';
import ProductosServicios from '../pages/ProductosServicios';
import ProductsByCategory from '../pages/ProductosServicios/ProductsByCategory';
import CompaniesPage from '../pages/Companies';
import AddCompanies from '../pages/Companies/add/companies.add';
import ProfilePage from '../pages/Profile/profile.page';
import ProductsByCompany from '../pages/ProductosServicios/ProductsByCompany';

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

export const ROUTES_INFO = [
  {
    id: 1,
    breadcrumbId: 'dashboard',
    name: 'Home',
    path: '/dashboard',
    component: Dashboard,
  },
  {
    id: 2,
    breadcrumbId: 'productos-servicios',
    name: 'Productos y Servicios',
    path: '/productos-servicios',
    component: ProductosServicios,
  },
  {
    id: 3,
    breadcrumbId: ':categoryId',
    name: '',
    path: '/productos-servicios/:categoryId',
    component: ProductsByCategory,
  },
  {
    id: 4,
    breadcrumbId: 'empresas',
    name: 'Empresas',
    path: '/empresas',
    component: CompaniesPage,
  },
  {
    id: 5,
    breadcrumbId: ':companyId',
    name: '',
    path: '/empresas/productos-servicios/:companyId',
    component: ProductsByCompany,
  },
  {
    id: 6,
    breadcrumbId: 'agregar',
    name: 'Agregar',
    path: '/empresas/agregar',
    component: AddCompanies,
  },
  {
    id: 7,
    breadcrumbId: 'company-profile',
    name: 'Perfil de Compañia',
    path: '/company-profile/:companyName',
    component: ProfilePage,
  },
];
