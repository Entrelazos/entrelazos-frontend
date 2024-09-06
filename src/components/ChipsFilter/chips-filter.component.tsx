/* eslint-disable react/require-default-props */
import { FC } from 'react';
// import './hu-card.styles.scss';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { Box, Chip } from '@mui/material';

interface ChipsFilterProperties {
  categories: CategoryItem[];
  onFilter?: (categoryId: number) => void;
  onSelect?: () => void;
}

const ChipsFilter: FC<ChipsFilterProperties> = ({
  categories,
  onFilter,
  onSelect,
}) => {
  return (
    <Box display='flex' gap={2} flexWrap={'wrap'}>
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.category_name}
          onClick={() => {
            if (onFilter) {
              onFilter(category.id);
            } else {
              onSelect();
            }
          }}
        ></Chip>
      ))}
    </Box>
  );
};
export default ChipsFilter;
