import express from "express";

import {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/property.controller.js';

const router = express.Router();

router.route('/').get(getAllProperties);
router.route('/').post(createProperty);
router.route('/:id').get(getPropertyById);
router.route('/:id').delete(deleteProperty);
router.route('/:id').patch(updateProperty);

export default router;

