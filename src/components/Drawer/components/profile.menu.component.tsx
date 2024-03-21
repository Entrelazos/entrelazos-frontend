import {
  Mail,
  Notifications,
  AccountCircle,
  More,
  MoreVert,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  PopoverVirtualElement,
} from '@mui/material';
import { FC, MouseEventHandler } from 'react';

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
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='error'>
            <Mail />
          </Badge>
        </IconButton>
        <IconButton
          size='large'
          aria-label='show 17 new notifications'
          color='inherit'
        >
          <Badge badgeContent={17} color='error'>
            <Notifications />
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
          <AccountCircle />
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
