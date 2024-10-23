import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileDropZone = ({ onDrop, existingFiles, onRemoveImage }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      onDrop(acceptedFiles);
    },
  });

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const handleRemoveImage = (file: File) => {
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
        '&:hover': {
          backgroundColor: 'gray',
        },
      }}
    >
      <input {...getInputProps()} />
      {files.length === 0 ? (
        <Box>
          <CloudUploadIcon fontSize='large' color='primary' />
          <Typography variant='h6' color='textSecondary'>
            Arrastra y suelta imagenes aquí, o haz clic para seleccionarlas.
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
