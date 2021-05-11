import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import authMiddleware from './middlewares/authMiddleware';
import authMiddlewareAdmin from './middlewares/authMiddlewareAdmin';

const router = Router()

const authController = new AuthController()
const userController = new UserController()

router.post('/auth', authController.authenticate)

// router.post('/users', authMiddlewareAdmin, userController.create)
// router.get('/users', authMiddlewareAdmin, userController.ready)
// router.get('/users/:id', authMiddlewareAdmin, userController.readyById)
// router.delete('/users/:id', authMiddlewareAdmin, userController.softDelete)
// router.put('/users/:id', authMiddlewareAdmin, userController.update)

router.post('/users', userController.create)
router.get('/users', userController.ready)
router.get('/users/:id', userController.readyById)
router.delete('/users/:id', userController.softDelete)
router.put('/users/:id', userController.update)


export { router }

