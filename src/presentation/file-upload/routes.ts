import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddlleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middlewares';

export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();
    const fileUploadService = new FileUploadService()
    const controller = new FileUploadController(fileUploadService);

    //Middlleware
    router.use(FileUploadMiddlleware.containFiles);
    router.use(TypeMiddleware.validTypes(['users','categories','products']))
    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type',  controller.uploadMultipleFiles);

    return router;
  }


}

