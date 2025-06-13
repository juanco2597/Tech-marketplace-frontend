'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import userService from '../../../services/userService'; 

interface User {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface SellerRequest {
  id: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  updatedAt: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsersAndRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);

      const fetchedRequests = await userService.getSellerRequests();
      const normalizedRequests: SellerRequest[] = fetchedRequests.map((req: any) => ({
        id: req.id,
        userId: req.userId,
        userEmail: req.userEmail,
        status: req.status,
        requestDate: req.requestDate ?? req.createdAt ?? '', 
        updatedAt: req.updatedAt,
      }));
      setSellerRequests(normalizedRequests);

    } catch (err: any) {
      console.error('Error fetching users or seller requests:', err);
      setError(err.message || 'Error al cargar usuarios o solicitudes de vendedor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRequests();
  }, []);
  const handleOpenEditRoleModal = (user: User) => {
    setCurrentUserToEdit(user);
    setSelectedRole(user.role);
    setOpenEditRoleModal(true);
  };

  const handleCloseEditRoleModal = () => {
    setOpenEditRoleModal(false);
    setCurrentUserToEdit(null);
  };

  const handleChangeRole = (event: any) => { 
    setSelectedRole(event.target.value as 'buyer' | 'seller' | 'admin');
  };

  const handleSaveRole = async () => {
    if (!currentUserToEdit || !selectedRole) return;

    setLoading(true);
    setError(null);
    try {
      await userService.updateUserRole(currentUserToEdit.id, selectedRole);
      setSuccess('Rol de usuario actualizado exitosamente.'); 
      handleCloseEditRoleModal();
      fetchUsersAndRequests(); 
    } catch (err: any) {
      console.error('Error updating user role:', err);
      setError(err.message || 'Error al actualizar el rol del usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userToDelete.id);
      setSuccess('Usuario eliminado exitosamente.'); 
      handleCloseDeleteModal();
      fetchUsersAndRequests(); 
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Error al eliminar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSellerRequest = async (requestId: string, userEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.approveSellerRequest(requestId);
      setSuccess(`Solicitud de vendedor de ${userEmail} aprobada y rol actualizado.`);
      fetchUsersAndRequests(); 
    } catch (err: any) {
      console.error('Error approving seller request:', err);
      setError(err.message || 'Error al aprobar la solicitud de vendedor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSellerRequest = async (requestId: string, userEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.rejectSellerRequest(requestId);
      setSuccess(`Solicitud de vendedor de ${userEmail} rechazada.`);
      fetchUsersAndRequests(); 
    } catch (err: any) {
      console.error('Error rejecting seller request:', err);
      setError(err.message || 'Error al rechazar la solicitud de vendedor.');
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState<string | null>(null);
  const setSuccess = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000); 
  };

  console.log('sellerRequests =>', sellerRequests);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {loading && <CircularProgress sx={{ my: 2 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>} 

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Solicitudes de Vendedor Pendientes
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID de Solicitud</TableCell>
                <TableCell>Email del Usuario</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellerRequests.filter(req => req.status === 'pending').length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay solicitudes de vendedor pendientes.
                  </TableCell>
                </TableRow>
              ) : (
                sellerRequests.filter(req => req.status === 'pending').map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.userEmail}</TableCell>
                    <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Aprobar Solicitud">
                        <IconButton
                          color="success"
                          onClick={() => handleApproveSellerRequest(request.id, request.userEmail)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rechazar Solicitud">
                        <IconButton
                          color="error"
                          onClick={() => handleRejectSellerRequest(request.id, request.userEmail)}
                        >
                          <CancelOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Todos los Usuarios
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Registrado Desde</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar Rol">
                        <IconButton color="primary" onClick={() => handleOpenEditRoleModal(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Usuario">
                        <IconButton color="error" onClick={() => handleOpenDeleteModal(user)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openEditRoleModal} onClose={handleCloseEditRoleModal}>
        <DialogTitle>Editar Rol de Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estas editando el rol de: {currentUserToEdit?.email} (ID: {currentUserToEdit?.id})
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-role-label">Rol</InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              label="Rol"
              onChange={handleChangeRole}
            >
              <MenuItem value="buyer">Comprador</MenuItem>
              <MenuItem value="seller">Vendedor</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditRoleModal}>Cancelar</Button>
          <Button onClick={handleSaveRole} variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estas seguro de que quieres eliminar al usuario {userToDelete?.email}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained" disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;