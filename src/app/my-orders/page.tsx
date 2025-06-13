'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Card, CardContent, Button, Collapse } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getMyOrders, Order } from '../../services/orderService';
import moment from 'moment';

interface OrderDetailProps {
    order: Order;
}

const OrderDetailCard: React.FC<OrderDetailProps> = ({ order }) => {
    const [open, setOpen] = useState(false);


    console.log("Order data in OrderDetailCard:", order);
    const handleToggleOpen = () => {
        setOpen(!open);
    };

    return (
        <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Orden ID: {order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fecha: {moment(order.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Estado: <strong style={{ textTransform: 'capitalize' }}>{order.status === 'pending' ? 'Pendiente': 'Pending'}</strong>
                </Typography>
                <Typography variant="body1">
                    Pago: <strong style={{ textTransform: 'capitalize' }}>{order.paymentStatus === 'unpaid' ? 'No pagado' : 'Unpaid'}</strong>
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                    Total: ${order.totalAmount.toFixed(2)}
                </Typography>
                <Button onClick={handleToggleOpen} sx={{ mt: 2 }}>
                    {open ? 'Ocultar Detalles' : 'Ver Detalles'}
                </Button>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, p: 2, borderTop: '1px solid #eee' }}>
                        <Typography variant="h6" gutterBottom>
                            Productos:
                        </Typography>

                        {order.items.length > 0 ? (
                            order.items.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.productName} style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10, borderRadius: 4 }} />
                                    )}
                                    <Box>
                                        <Typography variant="body1">
                                            {item.productName} ({item.sku}) - ${item.priceAtOrder.toFixed(2)} x {item.quantity}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Subtotal: ${(item.priceAtOrder * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No hay productos en esta orden.
                            </Typography>
                        )}

                        <Typography variant="h6" sx={{ mt: 3 }}>
                            Dirección de Envío:
                        </Typography>
                        <Typography>
                            {order.shippingAddress.street}
                        </Typography>
                        <Typography>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </Typography>
                        <Typography>
                            {order.shippingAddress.country}
                        </Typography>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};

const MyOrdersPage: React.FC = () => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'buyer') {
            router.replace('/'); 
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await getMyOrders();
                setOrders(fetchedOrders || []);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'No se pudieron cargar tus ordenes.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, router]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando Ordenes...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/')}>Volver al inicio</Button>
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Aun no tienes Ordenes.</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>¡Es hora de explorar nuestros productos!</Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/products')}>
                    Ver Productos
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Mis Órdenes
            </Typography>
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid size={{xs:12}}  key={order.id}> 
                        <OrderDetailCard order={order} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MyOrdersPage;