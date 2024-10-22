import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/categories/categoriesThunks';
import { AppDispatch, RootState } from '../../../store/store';
import { CategoryItem } from '../../../types/categories/CategoryTypes';

// Validation schema
const validationSchema = yup.object({
  product_name: yup.string().required('Product name is required'),
  productDescription: yup.string().required('Product description is required'),
  is_service: yup.boolean().required(),
  is_public: yup.boolean().required(),
  is_approved: yup.boolean().required(),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be a positive number'),
  category_ids: yup
    .array()
    .of(yup.number().required().integer('Category ID must be an integer'))
    .min(1, 'At least one category is required'),
  company_id: yup.number().required('Company is required').integer(),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddProductModal = ({ open, handleClose, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.categories);
  useEffect(() => {
    if (!data) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);
  // Create a mapping of category IDs to category names
  const categoryMap =
    data &&
    new Map(data.map((category) => [category.id, category.category_name]));
  const [products, setProducts] = useState([]); // State for storing multiple products
  const [editIndex, setEditIndex] = useState(null); // Track the index of the product being edited
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product_name: '',
      productDescription: '',
      is_service: false, // Reset boolean to default
      is_public: false, // Reset boolean to default
      is_approved: false, // Reset boolean to default
      price: '',
      category_ids: [],
      company_id: '',
    },
  });

  const isServiceChecked = watch('is_service');
  const isPublicChecked = watch('is_public');
  const isApprovedChecked = watch('is_approved');

  // Handle form submission
  const handleAddOrEditProduct = (data) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    if (editIndex !== null) {
      // If editing a product, update it in the list
      const updatedProducts = [...products];
      updatedProducts[editIndex] = data;
      setProducts(updatedProducts);
      setEditIndex(null); // Reset edit state
    } else {
      // Add a new product to the list
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      setProducts([...products, data]);
    }

    // Reset the form including booleans
    reset({
      product_name: '',
      productDescription: '',
      is_service: false, // Reset boolean to default
      is_public: false, // Reset boolean to default
      is_approved: false, // Reset boolean to default
      price: '',
      category_ids: [],
      company_id: '',
    });
  };

  // Handle edit action (prefill form with selected product)
  const handleEditProduct = (index) => {
    const productToEdit = products[index];
    setEditIndex(index);

    // Prefill form fields with product data
    setValue('product_name', productToEdit.product_name);
    setValue('productDescription', productToEdit.productDescription);
    setValue('is_service', productToEdit.is_service);
    setValue('is_public', productToEdit.is_public);
    setValue('is_approved', productToEdit.is_approved);
    setValue('price', productToEdit.price);
    setValue('category_ids', productToEdit.category_ids);
    setValue('company_id', productToEdit.company_id);
  };

  // Submit all products at once
  const handleSubmitAllProducts = () => {
    onSubmit(products); // Send the products array to parent
    setProducts([]); // Clear the products list
    handleClose(); // Close the modal
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: '80%', // Set a max height for the modal
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: 'auto', // Enable scrolling if content overflows
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant='h6' component='h2' gutterBottom>
          {editIndex !== null ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <form onSubmit={handleSubmit(handleAddOrEditProduct)}>
          <TextField
            label='Product Name'
            {...register('product_name')}
            error={!!errors.product_name}
            helperText={
              errors.product_name ? errors.product_name.message?.toString() : ''
            }
            fullWidth
            margin='normal'
          />
          <TextField
            label='Product Description'
            {...register('productDescription')}
            error={!!errors.productDescription}
            helperText={
              errors.productDescription
                ? errors.productDescription.message?.toString()
                : ''
            }
            fullWidth
            margin='normal'
          />
          <FormControlLabel
            control={<Checkbox {...register('is_service')} />}
            label='Is Service'
            checked={isServiceChecked}
          />
          <FormControlLabel
            control={<Checkbox {...register('is_public')} />}
            label='Is Public'
            checked={isPublicChecked}
          />
          <FormControlLabel
            control={<Checkbox {...register('is_approved')} />}
            label='Is Approved'
            checked={isApprovedChecked}
          />
          <TextField
            label='Price'
            type='number'
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price ? errors.price.message?.toString() : ''}
            fullWidth
            margin='normal'
          />
          {data && (
            <Controller
              name='category_ids'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='demo-multiple-chip-label'>
                    Categorias
                  </InputLabel>
                  <Select
                    labelId='demo-multiple-chip-label'
                    id='demo-multiple-chip'
                    multiple
                    {...field}
                    value={field.value || []} // Ensure value is an array
                    input={
                      <OutlinedInput
                        id='select-multiple-chip'
                        label='Categorias'
                      />
                    }
                    renderValue={(selected: []) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => (
                          <Chip key={id} label={categoryMap.get(id)} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {data.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}
          <TextField
            label='Company ID'
            type='number'
            {...register('company_id')}
            error={!!errors.company_id}
            helperText={
              errors.company_id ? errors.company_id.message?.toString() : ''
            }
            fullWidth
            margin='normal'
          />
          <Button type='submit' variant='contained' color='primary' fullWidth>
            {editIndex !== null ? 'Update Product' : 'Add Product to List'}
          </Button>
        </form>

        {/* Button to submit all products */}
        <Button
          variant='contained'
          color='secondary'
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmitAllProducts}
          disabled={products.length === 0} // Disable if no products
        >
          Submit All Products ({products.length})
        </Button>

        {/* List of added products with full details */}
        {products.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle1'>Added Products:</Typography>
            {products.map((product, index) => (
              <Card key={index} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant='body1'>
                    <strong>Product Name:</strong> {product.product_name}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Description:</strong> {product.productDescription}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Service:</strong>{' '}
                    {product.is_service ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Public:</strong> {product.is_public ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Approved:</strong>{' '}
                    {product.is_approved ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Price:</strong> ${product.price}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Categorias: </strong>
                    {product.category_ids.map(
                      (category: number, index: number) => {
                        const categoryItem = data.find(
                          (categoryItem) => categoryItem.id === category
                        );
                        return (
                          <span key={category} style={{ display: 'inline' }}>
                            {categoryItem?.category_name}
                            {index < product.category_ids.length - 1 && ', '}
                          </span>
                        );
                      }
                    )}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Empresa:</strong> {product.company_id}
                  </Typography>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => handleEditProduct(index)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddProductModal;
