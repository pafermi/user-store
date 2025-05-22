import { CustomError } from "../../domain/errors/custom.error"
import { AuthService } from "../services/auth.service"
import { Request, Response } from "express"

export class AuthController {

    //DI
    constructor(
        private readonly authService: AuthService
    ){}
    // Manejo de errores
    private handleError = (error: unknown, res:Response)=> {
        if (error instanceof CustomError) return res.status(error.statusCode).json({error: error.message})

        console.log(`${error}`)
        return res.status(500).json({error:'Internal Server Error'})
    }

    login = async (req: Request, res: Response) => {

        this.authService.login(req,res)
        .then( user => res.status(200).json({message:"Login exitoso", user}))
        .catch( error => this.handleError(error,res))
    }

  }