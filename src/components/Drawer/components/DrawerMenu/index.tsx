import { SvgIconComponent } from "@mui/icons-material"
import { FC } from "react"

interface DrawerMenuProperties {
    text: String
    icon: SvgIconComponent
    link: String
}

const DrawerMenu: FC<DrawerMenuProperties> = ({ text, icon: Icon, link }) => (
"test"
);

export default DrawerMenu