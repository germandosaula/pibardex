import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  CardMedia,
} from '@mui/material';

const AdminCardAdd = ({ open, onClose, onCardAdded }) => {
  const initialFormData = {
    cardNumber: '',
    name: '',
    description: '',
    image: '',
    rarity: 'common',
    category: 'character',
    packType: 'starter',
    dropRate: 5.0,
    stats: {
      attack: 0,
      defense: 0,
      health: 0,
      mana: 0,
    },
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageName, setImageName] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      stats: {
        ...formData.stats,
        [name]: parseInt(value) || 0,
      },
    });
  };

  const handleImageNameChange = (e) => {
    const fileName = e.target.value;
    setImageName(fileName);
    // Construir la ruta completa de la imagen
    setFormData({ 
      ...formData, 
      image: fileName ? `/cards/${fileName}` : '' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      // Convert numeric fields
      const dataToSend = {
        ...formData,
        dropRate: parseFloat(formData.dropRate),
        stats: {
          attack: parseInt(formData.stats.attack) || 0,
          defense: parseInt(formData.stats.defense) || 0,
          health: parseInt(formData.stats.health) || 0,
          mana: parseInt(formData.stats.mana) || 0,
        },
      };

      await axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.CREATE_CARD}`, dataToSend, config);
      setSuccess('Carta creada correctamente');
      setFormData(initialFormData); // Reset form
      setLoading(false);
      
      // Notify parent component
      setTimeout(() => {
        onCardAdded();
      }, 1500);
    } catch (err) {
      console.error('Error creating card:', err);
      setError(
        err.response?.data?.message || 'Error al crear carta'
      );
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError('');
    setSuccess('');
    setImageName('');
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Añadir Nueva Carta</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="cardNumber"
                label="Número de Carta"
                value={formData.cardNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                placeholder="001"
                helperText="Número de 3 dígitos (ej: 001, 042, 123)"
                inputProps={{ 
                  maxLength: 3,
                  pattern: "[0-9]{3}"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="imageName"
                label="Nombre de la Imagen"
                value={imageName}
                onChange={handleImageNameChange}
                fullWidth
                margin="normal"
                required
                placeholder="001.png"
                helperText="Nombre del archivo en /public/cards/ (ej: 001.png, carta_001.svg)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Vista previa:
                </Typography>
                {formData.image && (
                  <Card sx={{ maxWidth: 200, mt: 1 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={formData.image}
                      alt="Vista previa"
                      sx={{ objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = '/cards/001.png'; // Fallback image
                      }}
                    />
                  </Card>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Rareza</InputLabel>
                <Select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleChange}
                  label="Rareza"
                  required
                >
                  <MenuItem value="common">Común</MenuItem>
                  <MenuItem value="rare">Rara</MenuItem>
                  <MenuItem value="epic">Épica</MenuItem>
                  <MenuItem value="legendary">Legendaria</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Categoría"
                  required
                >
                  <MenuItem value="character">Personaje</MenuItem>
                  <MenuItem value="item">Objeto</MenuItem>
                  <MenuItem value="spell">Hechizo</MenuItem>
                  <MenuItem value="location">Ubicación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Paquete</InputLabel>
                <Select
                  name="packType"
                  value={formData.packType}
                  onChange={handleChange}
                  label="Tipo de Paquete"
                  required
                >
                  <MenuItem value="starter">Inicial</MenuItem>
                  <MenuItem value="booster">Refuerzo</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="special">Especial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="dropRate"
                label="Tasa de Aparición (%)"
                type="number"
                value={formData.dropRate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Estadísticas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="attack"
                    label="Ataque"
                    type="number"
                    value={formData.stats.attack}
                    onChange={handleStatsChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="defense"
                    label="Defensa"
                    type="number"
                    value={formData.stats.defense}
                    onChange={handleStatsChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="health"
                    label="Salud"
                    type="number"
                    value={formData.stats.health}
                    onChange={handleStatsChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="mana"
                    label="Maná"
                    type="number"
                    value={formData.stats.mana}
                    onChange={handleStatsChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Carta activa"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} disabled={loading}>
            Reiniciar
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? 'Creando...' : 'Crear Carta'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminCardAdd;