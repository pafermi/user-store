import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { envs } from '../../config/envs';

export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL);

    const authService = new AuthService(emailService);
    
    const controller = new AuthController(authService);
    // Definir las rutas
    router.post('/', controller.loginUser);
    router.post('/new', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    router.put('/:id',controller.updateUserInfo);
    router.put('/changepassword/:id', controller.updateUserPassword);

    return router;
  }
}
