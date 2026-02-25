import { Router } from 'express';
import pokemonRoutes from './pokemonRoutes.js';

const router = Router();

// Mount all Pokémon routes
router.use('/', pokemonRoutes);

export default router;