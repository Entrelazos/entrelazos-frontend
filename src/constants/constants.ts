import {
  Home,
  LocalMall,
  Business,
  Badge,
  Facebook,
  Instagram,
  LinkedIn,
  Phone,
  WhatsApp,
  Email,
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import ProfileComponent from '../pages/Profile/components/profile.component';
import Dashboard from '../pages/Dashboard/dashboard.page';
import ProductosServicios from '../pages/ProductosServicios';
import ProductsByCategory from '../pages/ProductosServicios/ProductsByCategory';
import CompaniesPage from '../pages/Companies/companies.page';
import AddCompanies from '../pages/Companies/add/companies.add';
import ProfilePage from '../pages/Profile/profile.page';
import ProductsByCompany from '../pages/ProductosServicios/ProductsByCompany';
import AdminPage from '../pages/Admin/admin.page';
import Login from '../pages/Login/Login';
import { Signup } from '../pages/signup/Signup';
import { v4 as uuidv4 } from 'uuid';
import ProductPage from '../pages/ProductosServicios/product.page';

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
  // {
  //   id: 2,
  //   label: 'Favoritos',
  //   icon: Favorite,
  //   component: ProfileComponent,
  // },
  // {
  //   id: 3,
  //   label: 'Contactos',
  //   icon: PeopleAlt,
  //   component: ProfileComponent,
  // },
  // {
  //   id: 4,
  //   label: 'Galeria',
  //   icon: Collections,
  //   component: ProfileComponent,
  // },
];

export const ROUTES_INFO = {
  PUBLIC_ROUTES: [
    {
      id: uuidv4(),
      breadcrumbId: 'login',
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'signup',
      name: 'Signup',
      path: '/signup',
      component: Signup,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'productos-servicios',
      name: 'Productos y Servicios',
      path: '/productos-servicios',
      component: ProductosServicios,
    },
    {
      id: uuidv4(),
      breadcrumbId: ':categoryId',
      name: '',
      path: '/productos-servicios/:categoryId',
      component: ProductsByCategory,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'empresas',
      name: 'Empresas',
      path: '/empresas',
      component: CompaniesPage,
    },
    {
      id: uuidv4(),
      breadcrumbId: ':companyId',
      name: '',
      path: '/empresas/productos-servicios/:companyId',
      component: ProductsByCompany,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'perfil-compania',
      name: 'Perfil de Compañia',
      path: '/empresas/perfil-compania/:companyName',
      component: ProfilePage,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'producto',
      name: 'Producto',
      path: '/productos/:productId',
      component: ProductPage,
    },
  ],
  PRIVATE_ROUTES: [
    {
      id: uuidv4(),
      breadcrumbId: 'dashboard',
      name: 'Home',
      path: '/dashboard',
      component: Dashboard,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'inscribir-empresas',
      name: 'Inscribir Empresas',
      path: '/inscribir-empresas',
      component: AddCompanies,
    },
    {
      id: uuidv4(),
      breadcrumbId: 'perfil-usuario',
      name: 'Perfil de Usuario',
      path: '/empresas/perfil-usuario/:userId',
      component: ProfilePage,
    },
  ],
  ADMIN_ROUTES_INFO: [
    {
      id: uuidv4(),
      breadcrumbId: 'admin',
      name: 'Administracion',
      path: '/',
      component: AdminPage,
    },
  ],
};

export const SOCIAL_NETWORK_DATA = [
  {
    name: 'email',
    label: 'Email',
    icon: Email,
    fieldType: 'email',
    isRequired: true,
    basePath: '',
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    fieldType: 'text',
    basePath: 'facebook.com/',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    fieldType: 'text',
    basePath: 'instagram.com/',
  },
  {
    name: 'x',
    label: 'X',
    icon: XIcon,
    fieldType: 'text',
    basePath: 'x.com/',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedIn,
    fieldType: 'text',
    basePath: 'linkedin.com/company/',
  },
  {
    name: 'phone_number',
    label: 'Telefono',
    icon: Phone,
    fieldType: 'phone',
    isRequired: true,
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp',
    icon: WhatsApp,
    fieldType: 'text',
  },
];
