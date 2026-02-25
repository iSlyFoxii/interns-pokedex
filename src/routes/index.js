import { Router } from 'express';
import pokemonRoutes from './pokemonRoutes.js';

const router = Router();

// Mount all routes
router.use('/', pokemonRoutes);

// 404 handler
router.use('*', (req, res) => {
    if (req.headers.accept?.includes('application/json')) {
        res.status(404).json({ success: false, error: 'Route not found' });
    } else {
        res.status(404).render('404', { message: 'Page not found', path: req.originalUrl });
    }
});

export default router;