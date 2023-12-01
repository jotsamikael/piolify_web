import express from 'express';

import {
    getAllUsers,
    createUser,
    getUserInfoById,
    getUserInfoByPhone,
    updateUser

} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/:id').get(getUserInfoById);
router.route('/:phone').get(getUserInfoByPhone);
router.route('/:phone').get(updateUser);



export default router;


