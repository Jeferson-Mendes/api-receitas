const Router = require('express').Router;

const UserRouter = Router();

const upload = require('../config/multer');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

UserRouter.get('/all', authMiddleware, UserController.index );
UserRouter.get('/:id', authMiddleware, UserController.detail);
UserRouter.post('/create', upload.single('image'), UserController.create);
UserRouter.post('/authenticate', UserController.authenticate);
UserRouter.patch('/update-photo', authMiddleware, upload.single('image'), UserController.updateResourse);
UserRouter.patch('/update-password', authMiddleware, UserController.updatePassword);
UserRouter.put('/:userId', authMiddleware, UserController.update);

module.exports = UserRouter;
