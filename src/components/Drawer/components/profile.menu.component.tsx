import {
  MailOutline,
  NotificationsOutlined,
  AccountCircleOutlined,
  MoreVert,
  SettingsOutlined,
  AdminPanelSettingsOutlined,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  PopoverVirtualElement,
  Typography,
} from '@mui/material';
import { FC, MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { hasRole } from '../../../store/auth';

interface ProfileMenuComponent {
  anchorEl:
    | Element
    | (() => Element)
    | PopoverVirtualElement
    | (() => PopoverVirtualElement);
  menuId: string;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
  handleProfileMenuOpen: MouseEventHandler<HTMLElement>;
  mobileMenuId: string;
  handleMobileMenuOpen: MouseEventHandler<HTMLElement>;
}

export const ProfileMenuComponent: FC<ProfileMenuComponent> = ({
  anchorEl,
  menuId,
  isMenuOpen,
  handleMenuClose,
  handleMobileMenuOpen,
  handleProfileMenuOpen,
  mobileMenuId,
}) => {
  const isAdmin = useSelector(hasRole('admin'));
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      style={{ zIndex: 2000 }}
    >
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <AccountCircleOutlined fontSize='small' />
          </ListItemIcon>
          <ListItemText>Mi cuenta</ListItemText>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AccountCircleOutlined fontSize='small' />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            ⌘V
          </Typography>
        </MenuItem>
        <Divider />
        {isAdmin && (
          <MenuItem component={Link} to='/admin' onClick={handleMenuClose}>
            <ListItemIcon>
              <AdminPanelSettingsOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Configuracion</ListItemText>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge color='error'>
            <MailOutline />
          </Badge>
        </IconButton>
        <IconButton
          size='large'
          aria-label='show 17 new notifications'
          color='inherit'
        >
          <Badge color='error'>
            <NotificationsOutlined />
          </Badge>
        </IconButton>
        <IconButton
          size='large'
          edge='end'
          aria-label='account of current user'
          aria-controls={menuId}
          aria-haspopup='true'
          onClick={handleProfileMenuOpen}
          color='inherit'
        >
          <SettingsOutlined />
        </IconButton>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size='large'
          aria-label='show more'
          aria-controls={mobileMenuId}
          aria-haspopup='true'
          onClick={handleMobileMenuOpen}
          color='inherit'
        >
          <MoreVert />
        </IconButton>
      </Box>
      {renderMenu}
    </>
  );
};
