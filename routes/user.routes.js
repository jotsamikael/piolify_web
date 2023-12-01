import express from 'express';

import {
    getAllUsers,
    createUser,
    getUserInfoById,
    getUserInfoByPhone
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/:id').get(getUserInfoById);
router.route('/:phone').get(getUserInfoByPhone);


export default router;


