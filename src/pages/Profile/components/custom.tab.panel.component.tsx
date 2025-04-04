import { FC } from 'react';

interface TabPanelProperties {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanelComponent: FC<TabPanelProperties> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default CustomTabPanelComponent;
