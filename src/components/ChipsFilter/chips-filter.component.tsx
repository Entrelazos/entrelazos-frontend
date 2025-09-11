import { FC, useState } from 'react';
// import './hu-card.styles.scss';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { Box, Chip, Paper, styled } from '@mui/material';
import { Check } from '@mui/icons-material';

export interface FilteredCategoryItem extends CategoryItem {
  selected: boolean;
}

interface ChipsFilterProperties {
  categories: FilteredCategoryItem[];
  onFilter?: (_categoryId: number) => void;
  onClear?: () => void;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ChipsFilter: FC<ChipsFilterProperties> = ({
  categories,
  onFilter,
  onClear,
}) => {
  // Set initial state for filtered categories
  const [filteredCategories, setFilteredCategories] = useState(
    categories.map((category) => ({ ...category, selected: false }))
  );
  const [categoriesSelected, setCategoriesSelected] = useState(
    filteredCategories.some((category) => category.selected)
  );
  const handleClick = (categoryId: number) => {
    // Create a new array with the updated category selection
    const updatedCategories = filteredCategories.map((category) =>
      category.id === categoryId
        ? { ...category, selected: !category.selected }
        : category
    );
    const selected = updatedCategories.some((category) => category.selected);
    setCategoriesSelected(selected);

    // Update the state with the new array
    setFilteredCategories(updatedCategories);

    // Trigger the onFilter callback if it exists
    if (onFilter) {
      onFilter(categoryId);
    }
  };

  const handleClearFilters = () => {
    const updatedCategories = filteredCategories.map((category) => ({
      ...category,
      selected: false,
    }));
    setFilteredCategories(updatedCategories);
    setCategoriesSelected(false);
    if (onClear) {
      onClear();
    }
  };

  return (
    <>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 1,
          my: 0,
        }}
        component='ul'
      >
        {filteredCategories.map((category) => (
          // TODO: Implement Chip selected and Chip unselected
          // TODO: Implement clear filter
          <ListItem key={category.id}>
            <Chip
              color={category.selected ? 'success' : 'default'}
              icon={category.selected ? <Check /> : undefined}
              label={category.category_name}
              variant='outlined'
              onClick={() => {
                handleClick(category.id);
              }}
            ></Chip>
          </ListItem>
        ))}
      </Paper>
      <Box
        display='flex'
        justifyContent='end'
        sx={{ width: '100%', margin: '1rem' }}
      >
        {categoriesSelected && (
          <Chip
            color='error'
            icon={<Check />}
            label='Limpiar Filtros'
            variant='outlined'
            onClick={() => {
              handleClearFilters();
            }}
          ></Chip>
        )}
      </Box>
    </>
  );
};
export default ChipsFilter;
