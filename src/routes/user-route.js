const express = require('express');

const userController = require('../controllers/user-controller')
const authenticateMiddleware = require('../middlewares/authenticate')
const uploadMiddlewares = require('../middlewares/upload')

const router = express.Router();

router.patch(
    '/',
    authenticateMiddleware,
    uploadMiddlewares.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    userController.updateProfile
);

module.exports = router;