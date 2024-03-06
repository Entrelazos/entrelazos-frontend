/* eslint-disable react/require-default-props */
import { FC } from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { Link } from 'react-router-dom';


interface DrawerItemProperties {
    text: String
    icon: SvgIconComponent
    link: String
}

const DrawerItem: FC<DrawerItemProperties> = ({ text, icon: Icon, link }) => (
    <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
            component={Link} // Use Link component from React Router
            to={link} // Specify the destination of the link
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                }}
            >
                <Icon />
            </ListItemIcon>
            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
    </ListItem>
);
export default DrawerItem;
