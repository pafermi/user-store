import { Request,Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto"
import { AuthService } from "../services/auth.service"
import { CustomError } from "../../domain/errors/custom.error"
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto"
import { UpdateUserDto } from "../../domain/dtos/auth/update-user.dto"

export class AuthController {

    //DI
    constructor(
        public readonly authService:AuthService
    ){}

    private handleError = (error: unknown, res:Response)=> {
        if (error instanceof CustomError) return res.status(error.statusCode).json({error: error.message})

        console.log(`${error}`)
        return res.status(500).json({error:'Internal Server Error'})
    }

    public registerUser = (req:Request, res:Response)=> {
        
        const [error,registerDto] = RegisterUserDto.create(req.body)
        
        if (error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!)
        .then((user)=> res.json(user))
        .catch((error)=> this.handleError(error,res))

    }

    public loginUser = (req:Request, res:Response)=> {
        
        const [error,loginDto] = LoginUserDto.create(req.body)
        
        if (error) return res.status(400).json({error})
        
        this.authService.loginUser(loginDto!)
        .then((user)=> res.json(user))
        .catch((error)=> this.handleError(error,res))
    }

    public validateEmail = (req:Request, res:Response)=> {

        const {token} = req.params
        
        this.authService.validateEmail(token)
        .then(()=>res.json('Email validated'))
        .catch((error)=> this.handleError(error,res))
       
    }

    public updateUserInfo = (req:Request, res:Response)=> {

        const usuarioId = req.params.id
        const [error,updateDto] = UpdateUserDto.create(req.body)
        
        if (error) return res.status(400).json({error})

        this.authService.updateUser(usuarioId,updateDto!)
        .then((user)=> res.json(user))
        .catch((error)=> this.handleError(error,res))

    }

    public updateUserPassword = (req:Request, res:Response)=> {
        
        const usuarioId = req.params.id
        const {password} = req.body

        this.authService.updatePassword(usuarioId,password)
        .then(()=>res.json('Password changed'))
        .catch((error)=> this.handleError(error,res))

    }
}