// src/controllers/pokemonController.js
import * as pokemonService from '../services/pokemonService.js';

// ====================
// VIEW ROUTES
// ====================

// Home / list Pokémon
export const getHomePage = async (req, res) => {
    const types = await pokemonService.getPokemonTypes();
    const { type, page } = req.query;

    let pokemonData;
    try {
        if (type) {
            pokemonData = await pokemonService.getPokemonByType(type, page ? Number(page) : 1);
            if (!pokemonData) {
                pokemonData = { pokemon: [], totalCount: 0, currentPage: 1, totalPages: 1 };
            }
        } else {
            pokemonData = await pokemonService.getAllPokemon(page ? Number(page) : 1);
        }

        res.render('index', {
            pokemon: pokemonData.pokemon,
            types,
            searchQuery: '',
            selectedType: type || '',
            totalCount: pokemonData.totalCount,
            currentPage: pokemonData.currentPage,
            totalPages: pokemonData.totalPages
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Something went wrong', error: error.message });
    }
};

// Pokémon details page
export const getPokemonDetails = async (req, res) => {
    const { nameOrId } = req.params;
    try {
        const pokemon = await pokemonService.getPokemonDetails(nameOrId);
        if (!pokemon) return res.status(404).render('error', { message: 'Pokémon not found', error: '' });

        const types = await pokemonService.getPokemonTypes();
        res.render('pokemonDetails', { pokemon, types });
    } catch (error) {
        res.status(500).render('error', { message: 'Something went wrong', error: error.message });
    }
};

// Type filter
export const getPokemonByType = async (req, res) => {
    const { type } = req.params;
    const { page } = req.query;
    try {
        const types = await pokemonService.getPokemonTypes();
        const pokemonData = await pokemonService.getPokemonByType(type, page ? Number(page) : 1);

        if (!pokemonData || pokemonData.pokemon.length === 0) {
            // Render error page with 404
            return res.status(404).render('error', {
                message: `No Pokémon found for type "${type}"`,
                error: ''
            });
        }

        res.render('index', {
            pokemon: pokemonData.pokemon,
            types,
            searchQuery: '',
            selectedType: type,
            totalCount: pokemonData.totalCount,
            currentPage: pokemonData.currentPage,
            totalPages: pokemonData.totalPages
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Something went wrong', error: error.message });
    }
};

// Search Pokémon
export const searchPokemon = async (req, res) => {
    const { q } = req.query;
    try {
        const types = await pokemonService.getPokemonTypes();
        const results = await pokemonService.searchPokemon(q);

        res.render('index', {
            pokemon: results.pokemon,
            types,
            searchQuery: q || '',
            selectedType: '',
            totalCount: results.totalCount,
            currentPage: 1,
            totalPages: 1
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Something went wrong', error: error.message });
    }
};

// ====================
// API ROUTES
// ====================

export const apiGetAllPokemon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || undefined;
        const data = await pokemonService.getAllPokemon(page, limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Service error', error: error.message });
    }
};

export const apiSearchPokemon = async (req, res) => {
    try {
        const { q } = req.query;
        const data = await pokemonService.searchPokemon(q);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Service error', error: error.message });
    }
};

export const apiGetPokemonDetails = async (req, res) => {
    try {
        const { nameOrId } = req.params;
        const data = await pokemonService.getPokemonDetails(nameOrId);
        if (!data) return res.status(404).json({ success: false, message: 'Pokémon not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Service error', error: error.message });
    }
};

export const apiGetTypes = async (_req, res) => {
    try {
        const data = await pokemonService.getPokemonTypes();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Service error', error: error.message });
    }
};

export const apiGetPokemonByType = async (req, res) => {
    try {
        const { type } = req.params;
        const page = parseInt(req.query.page) || 1;
        const data = await pokemonService.getPokemonByType(type, page);
        if (!data) return res.status(404).json({ success: false, message: 'No Pokémon found for this type' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Service error', error: error.message });
    }
};

// At the bottom of your controller file, make sure you have:
export {
    getHomePage,
    getPokemonDetails,
    searchPokemon,
    getPokemonByType,
    comparePokemon,
    getRandomPokemon,
    apiGetAllPokemon,
    apiGetPokemonDetails,
    apiSearchPokemon,
    apiGetTypes,
    apiGetPokemonByType,
    apiGetRandomPokemon,
    apiComparePokemon
};