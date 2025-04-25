import { Router } from 'express';
import { ImageController } from './controller';

export class ImageRoutes {

  static get routes(): Router {

    const router = Router();

    const controller = new ImageController();

    // Definir las rutas
    router.get('/:type/:imgID',controller.getImage);
    

    return router;
  }


}

