import { Router } from 'express';
// import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { PoliticService } from '../services/politic.service';
import { PoliticController } from './controller';

export class PoliticRoutes {

  static get routes(): Router {

    const router = Router();

    const politicService = new PoliticService()
    const controller = new PoliticController(politicService)

    // Rutas CRUD
    router.post("/", controller.createPolitic); // Crear un nuevo político
    router.get("/", controller.getPolitics); // Obtener todos los políticos
    router.get("/search", controller.searchPolitics); // Buscar políticos por cualquier campo
    router.get("/:id", controller.getPoliticById); // Obtener un político por ID
    router.put("/:id", controller.updatePolitic); // Actualizar un político por ID
    router.delete("/:id", controller.deletePolitic); // Eliminar un político por ID

    // router.post('/', [AuthMiddleware.validateJWT] ,controller.createProduct);

    return router;
  }


}

