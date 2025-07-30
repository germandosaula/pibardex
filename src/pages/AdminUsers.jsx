import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Visibility,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import AdminUserEdit from '../components/admin/AdminUserEdit';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
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
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}?page=${page + 1}&limit=${rowsPerPage}&search=${searchQuery}`,
        config
      );

      setUsers(response.data.users);
      setTotalUsers(response.data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
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
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      await axios.delete(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.DELETE_USER(selectedUser._id)}`, config);
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al desactivar usuario');
    }
  };

  const handleUserUpdated = () => {
    setOpenEditDialog(false);
    fetchUsers();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Usuarios
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o email"
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
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Nivel</TableCell>
                  <TableCell>Monedas</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Registro</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.level}</TableCell>
                      <TableCell>{user.coins}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Activo' : 'Inactivo'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          icon={
                            user.isActive ? <CheckCircle /> : <Block />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditUser(user)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalUsers}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Paper>

        {/* Edit User Dialog */}
        {selectedUser && (
          <AdminUserEdit
            open={openEditDialog}
            user={selectedUser}
            onClose={() => setOpenEditDialog(false)}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {/* Delete User Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Desactivar Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas desactivar al usuario{' '}
              <strong>{selectedUser?.username}</strong>? Esta acción no
              eliminará al usuario, solo lo desactivará.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteUser} color="error" autoFocus>
              Desactivar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };

  export default AdminUsers;