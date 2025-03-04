import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileDropZone = ({ onDrop, existingFiles = [], onRemoveImage }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles((prev) => [...prev, ...mappedFiles]);
      onDrop(acceptedFiles);
    },
  });

  // Convert image URLs to File objects (only if they are URLs, not already File objects)
  useEffect(() => {
    const convertUrlsToFiles = async () => {
      const fileObjects = await Promise.all(
        existingFiles.map(async (image, index) => {
          if (typeof image === 'string') {
            // Fetch the image and create a File object
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], `image_${index}.jpg`, {
              type: blob.type,
            });
            return Object.assign(file, { preview: image });
          }
          return image; // Keep already existing File objects
        })
      );
      setFiles(fileObjects);
    };

    // Check if existingFiles contains URLs, and only then convert
    if (existingFiles.some((file) => typeof file === 'string')) {
      convertUrlsToFiles();
    } else {
      setFiles(existingFiles); // Directly set files if they are already File objects
    }
  }, [existingFiles]);

  const handleRemoveImage = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    onRemoveImage(file);
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        '&:hover': { backgroundColor: 'gray' },
      }}
    >
      <input {...getInputProps()} />
      {files.length === 0 ? (
        <Box>
          <CloudUploadIcon fontSize='large' color='primary' />
          <Typography variant='h6' color='textSecondary'>
            Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.
          </Typography>
        </Box>
      ) : (
        <Box>
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '10px',
                backgroundColor: 'transparent',
                borderRadius: '5px',
                padding: '10px',
              }}
            >
              <img
                src={file.preview}
                alt={file.name}
                width='100px'
                height='100px'
                style={{ objectFit: 'cover', borderRadius: '5px' }}
              />
              <Typography
                variant='body2'
                sx={{ marginLeft: '10px', flexGrow: 1 }}
              >
                {file.name}
              </Typography>
              <IconButton
                onClick={() => handleRemoveImage(file)}
                color='error'
                size='small'
                sx={{ zIndex: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileDropZone;
