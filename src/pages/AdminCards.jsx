import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  DeleteForever,
  Search,
  Add,
  Add as AddIcon,
  FilterList,
  CheckCircle,
  Block,
} from '@mui/icons-material';
import AdminCardEdit from '../components/admin/AdminCardEdit';
import AdminCardAdd from '../components/admin/AdminCardAdd';

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editCard, setEditCard] = useState(null);
  const [deleteCard, setDeleteCard] = useState(null);
  const [forceDeleteCard, setForceDeleteCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [forceDeleteConfirmOpen, setForceDeleteConfirmOpen] = useState(false);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [filters, setFilters] = useState({
    rarity: '',
    category: '',
    packType: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12); // Show 12 cards per page
      if (searchQuery) params.append('search', searchQuery);
      if (filters.rarity) params.append('rarity', filters.rarity);
      if (filters.category) params.append('category', filters.category);
      if (filters.packType) params.append('packType', filters.packType);

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.CARDS}?${params.toString()}`,
        config
      );

      setCards(response.data.cards);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Error al cargar cartas');
      setLoading(false);

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    fetchCards();
  }, [page, searchQuery, filters, navigate]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      rarity: '',
      category: '',
      packType: '',
    });
    setSearchQuery('');
    setPage(1);
  };

  const handleEditCard = (card) => {
    setEditCard(card);
  };

  const handleDeleteCard = (card) => {
    setDeleteCard(card);
    setDeleteConfirmOpen(true);
  };

  const handleForceDeleteCard = (card) => {
    setForceDeleteCard(card);
    setForceDeleteConfirmOpen(true);
  };

  const confirmDeleteCard = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      await axios.delete(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.DELETE_CARD(deleteCard._id)}`, config);
      setDeleteConfirmOpen(false);
      setDeleteCard(null);
      fetchCards();
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Error al eliminar carta');
    }
  };

  const confirmForceDeleteCard = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      await axios.delete(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.FORCE_DELETE_CARD(forceDeleteCard._id)}`, config);
      setForceDeleteConfirmOpen(false);
      setForceDeleteCard(null);
      fetchCards();
    } catch (err) {
      console.error('Error force deleting card:', err);
      setError('Error al eliminar carta forzadamente');
    }
  };

  const confirmClearAllCards = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      await axios.delete(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.CLEAR_ALL_CARDS}`, config);
      setClearAllConfirmOpen(false);
      fetchCards();
    } catch (err) {
      console.error('Error clearing all cards:', err);
      setError('Error al eliminar todas las cartas');
    }
  };

  const handleCardUpdated = () => {
    setEditCard(null);
    fetchCards();
  };

  const handleCardAdded = () => {
    setShowAddCard(false);
    fetchCards();
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700'; // Gold
      case 'epic':
        return '#9370DB'; // Purple
      case 'rare':
        return '#4169E1'; // Blue
      case 'common':
      default:
        return '#808080'; // Gray
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Cartas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setClearAllConfirmOpen(true)}
              disabled={cards.length === 0}
            >
              Eliminar Todas
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowAddCard(true)}
            >
              Añadir Carta
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre o descripción"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ mr: 1 }}
                  >
                    Filtros
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleResetFilters}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {showFilters && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Rareza</InputLabel>
                    <Select
                      name="rarity"
                      value={filters.rarity}
                      onChange={handleFilterChange}
                      label="Rareza"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="common">Común</MenuItem>
                      <MenuItem value="rare">Rara</MenuItem>
                      <MenuItem value="epic">Épica</MenuItem>
                      <MenuItem value="legendary">Legendaria</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      label="Categoría"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="character">Personaje</MenuItem>
                      <MenuItem value="item">Objeto</MenuItem>
                      <MenuItem value="spell">Hechizo</MenuItem>
                      <MenuItem value="location">Ubicación</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Tipo de Paquete</InputLabel>
                    <Select
                      name="packType"
                      value={filters.packType}
                      onChange={handleFilterChange}
                      label="Tipo de Paquete"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="starter">Inicial</MenuItem>
                      <MenuItem value="booster">Refuerzo</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                      <MenuItem value="special">Especial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Box>

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
              }}
            >
              <CircularProgress />
            </Box>
          ) : cards.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
              }}
            >
              <Typography variant="h6" color="textSecondary">
                No se encontraron cartas
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={card._id}>
                  <Card
                    sx={{
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      borderTop: `4px solid ${getRarityColor(card.rarity)}`,
                    }}
                  >
                    {!card.isActive && (
                      <Chip
                        label="Inactiva"
                        color="error"
                        size="small"
                        icon={<Block />}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 1,
                        }}
                      />
                    )}
                    <CardMedia
                      component="img"
                      height="80"
                      image={card.image}
                      alt={card.name}
                      sx={{ 
                        objectFit: 'contain', 
                        p: 1,
                        maxHeight: '80px',
                        width: 'auto',
                        margin: '0 auto'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {card.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          mb: 1,
                        }}
                      >
                        {card.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                          label={card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                          size="small"
                          sx={{ 
                            backgroundColor: getRarityColor(card.rarity), 
                            color: 'white',
                            fontSize: '0.65rem',
                            height: '20px'
                          }}
                        />
                        <Chip
                          label={card.category.charAt(0).toUpperCase() + card.category.slice(1)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.65rem',
                            height: '20px'
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 1, pt: 0 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditCard(card)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCard(card)}
                        size="small"
                        title="Eliminar (desactivar si está en uso)"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleForceDeleteCard(card)}
                        size="small"
                        title="Eliminar forzado (elimina completamente)"
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteForever />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Paper>

        {/* Edit Card Dialog */}
        {editCard && (
          <AdminCardEdit
            open={Boolean(editCard)}
            card={editCard}
            onClose={() => setEditCard(null)}
            onCardUpdated={handleCardUpdated}
          />
        )}

        {/* Add Card Dialog */}
        <AdminCardAdd
          open={showAddCard}
          onClose={() => setShowAddCard(false)}
          onCardAdded={handleCardAdded}
        />

        {/* Delete Card Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Eliminar Carta</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar la carta{' '}
              <strong>{deleteCard?.name}</strong>? Si esta carta está en uso
              por usuarios, será desactivada en lugar de eliminada.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteCard} color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Force Delete Card Dialog */}
        <Dialog
          open={forceDeleteConfirmOpen}
          onClose={() => setForceDeleteConfirmOpen(false)}
        >
          <DialogTitle>Eliminar Carta Forzadamente</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar <strong>COMPLETAMENTE</strong> la carta{' '}
              <strong>{forceDeleteCard?.name}</strong>?
            </Typography>
            <Typography sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>
              ⚠️ Esta acción eliminará la carta de TODAS las colecciones de usuarios
            </Typography>
            <Typography sx={{ mt: 1, color: 'error.main' }}>
              Esta acción es IRREVERSIBLE
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForceDeleteConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={confirmForceDeleteCard} color="error" autoFocus>
              Eliminar Forzadamente
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear All Cards Dialog */}
        <Dialog
          open={clearAllConfirmOpen}
          onClose={() => setClearAllConfirmOpen(false)}
        >
          <DialogTitle>Eliminar Todas las Cartas</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar <strong>TODAS</strong> las cartas?
              Esta acción también eliminará todas las cartas de las colecciones de los usuarios.
            </Typography>
            <Typography sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>
              ⚠️ Esta acción es IRREVERSIBLE
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearAllConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={confirmClearAllCards} color="error" autoFocus>
              Eliminar Todas
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };

  export default AdminCards;