import { useState } from 'react';
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
} from '@mui/material';

const AdminUserEdit = ({ open, user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    coins: user.coins,
    level: user.level,
    experience: user.experience,
    isActive: user.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
        coins: parseInt(formData.coins),
        level: parseInt(formData.level),
        experience: parseInt(formData.experience),
      };

      await axios.put(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.UPDATE_USER(user._id)}`, dataToSend, config);
      setSuccess('Usuario actualizado correctamente');
      setLoading(false);
      
      // Notify parent component
      setTimeout(() => {
        onUserUpdated();
      }, 1500);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(
        err.response?.data?.message || 'Error al actualizar usuario'
      );
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Usuario: {user.username}</DialogTitle>
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
                name="username"
                label="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="coins"
                label="Monedas"
                type="number"
                value={formData.coins}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="level"
                label="Nivel"
                type="number"
                value={formData.level}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="experience"
                label="Experiencia"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Usuario activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminUserEdit;