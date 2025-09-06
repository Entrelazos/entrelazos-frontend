 
import { FC, ReactElement, useState } from 'react';
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore, SvgIconComponent } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface DrawerItemProperties {
  text: string;
  icon: SvgIconComponent;
  link?: string;
  key?: string;
  children?: Array<ReactElement>;
  drawerOpen?: boolean;
}

const DrawerItem: FC<DrawerItemProperties> = ({
  text,
  icon: Icon,
  link,
  children,
  drawerOpen,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const renderChildren = () => {
    if (!children) return null; // If no children or parent is not open, return null
    return (
      <ul>
        {children.map((child, index) => {
          return (
            <DrawerItem key={index} {...child.props} /> // Render child DrawerItem recursively
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          component={link ? Link : 'div'}
          to={link || undefined}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={handleClick}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: drawerOpen ? 1 : 0 }} />
          {children && drawerOpen && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        {renderChildren()}
      </Collapse>
    </>
  );
};
export default DrawerItem;
