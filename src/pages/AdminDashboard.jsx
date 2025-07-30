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
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Collections,
  Games,
  BarChart,
  PersonAdd,
  CollectionsBookmark,
  TrendingUp,
} from '@mui/icons-material';
const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [cardStats, setCardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
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

        // Fetch user stats
        const userStatsResponse = await axios.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.USERS_STATS}`, config);
        setUserStats(userStatsResponse.data.stats);

        // Fetch card stats
        const cardStatsResponse = await axios.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.CARDS_STATS}`, config);
        setCardStats(cardStatsResponse.data.stats);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error al cargar estadísticas');
        setLoading(false);

        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          navigate('/admin/login');
        }
      }
    };

    fetchStats();
  }, [navigate]);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

        <Grid container spacing={3}>
          {/* User Stats */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Usuarios Totales"
              value={userStats?.totalUsers || 0}
              icon={<People color="primary" />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Usuarios Activos"
              value={userStats?.activeUsers || 0}
              icon={<PersonAdd color="success" />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Nuevos (7 días)"
              value={userStats?.lastWeekUsers || 0}
              icon={<TrendingUp color="info" />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Cartas Totales"
              value={cardStats?.totalCards || 0}
              icon={<Collections color="warning" />}
              color="warning"
            />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<People />}
                    onClick={() => navigate('/admin/users')}
                  >
                    Gestionar Usuarios
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Collections />}
                    onClick={() => navigate('/admin/cards')}
                  >
                    Gestionar Cartas
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CollectionsBookmark />}
                    onClick={() => navigate('/admin/cards/create')}
                  >
                    Crear Nueva Carta
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<BarChart />}
                    onClick={() => navigate('/admin/stats')}
                  >
                    Ver Estadísticas
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Most Collected Cards */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Cartas Más Coleccionadas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {cardStats?.mostCollectedCards?.slice(0, 5).map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Collections
                        color={
                          index === 0
                            ? 'warning'
                            : index === 1
                            ? 'info'
                            : 'action'
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.card.name}
                      secondary={`${item.count} coleccionadas • ${item.card.rarity}`}
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No hay datos disponibles" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Cards by Rarity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Cartas por Rareza
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {cardStats?.cardsByRarity?.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Collections
                        color={
                          item._id === 'legendary'
                            ? 'warning'
                            : item._id === 'epic'
                            ? 'secondary'
                            : item._id === 'rare'
                            ? 'info'
                            : 'action'
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item._id.charAt(0).toUpperCase() + item._id.slice(1)}`}
                      secondary={`${item.count} cartas`}
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No hay datos disponibles" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* User Level Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Distribución de Niveles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {userStats?.levelDistribution?.slice(0, 5).map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Nivel ${item._id}`}
                      secondary={`${item.count} usuarios`}
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No hay datos disponibles" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };

  export default AdminDashboard;