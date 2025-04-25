import mongoose from "mongoose";
import { bcryptAdapter } from "../../config/bcrypt";
import { envs } from "../../config/envs";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data/mongo/models/user.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { EmailService } from "./email.service";

export class AuthService {
    
    constructor(
        private readonly emailService: EmailService
    ){}

    public async registerUser(RegisterUserDto:RegisterUserDto) {
        
        const existUser = await UserModel.findOne({email: RegisterUserDto.email});
        if (existUser) throw CustomError.badRequest('Email alredy exist')

        try {
            const user = new UserModel(RegisterUserDto);

            user.password = bcryptAdapter.hash(RegisterUserDto.password);

            await user.save();

            await this.sendEmailValidationLink(user.email)
            
            const {password,...userEntity} = UserEntity.fromObject(user)
            const token = await JwtAdapter.generateToken({id: user.id})
            if (!token) throw CustomError.internalServer('Error while creating jwt')

            return {
                user: userEntity,
                token: token
            } 

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto:LoginUserDto) {

        const existUser = await UserModel.findOne({email: loginUserDto.email});
        if (!existUser) throw CustomError.badRequest('Email does not exist')
        
        try {
            if (!bcryptAdapter.compare(loginUserDto.password,existUser.password))
                throw CustomError.badRequest('Password does not match')
            
            const {password,...userEntity} = UserEntity.fromObject(existUser)
            
            const token = await JwtAdapter.generateToken({id: existUser.id})
            if (!token) throw CustomError.internalServer('Error while creating jwt')

            return {
                user: userEntity,
                token: token
            } 
                       
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private sendEmailValidationLink = async(email:string) => {

        const token = await JwtAdapter.generateToken({email})
        
        if (!token) throw CustomError.internalServer('Error getting token')

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`
        const html = `
            <h1>Validate your email</h1>
            <p>Click the following link to validate your email</p>
            <a href= "${link}">Validate your email: ${email}</a>`

        const options = {
            to:email,
            subject: 'Validate your email',
            htmlBody: html
        }
        const isSent  = await this.emailService.sendEmail(options)
        if (!isSent) throw CustomError.internalServer('Error sending email')
        
        return true

    }

    public validateEmail = async(token:string)=>{

        const payload = await JwtAdapter.validateToken(token)

        if(!payload) throw CustomError.unAuthorized('Invalid Token')

        const {email} = payload as {email: string}
        if(!email) throw CustomError.internalServer('Email not in token')
        
        const user = await UserModel.findOne({email})
        if(!user) throw CustomError.internalServer('Email not exist')

        user.emailValidated = true;
        await user.save();
        return true
    }

    public async updateUser(id:string,UpdateUserDto:UpdateUserDto) {

        if (!mongoose.Types.ObjectId.isValid(id)) throw CustomError.badRequest('Invalid Id')

        const user = await UserModel.findById(id)
        if (!user) throw CustomError.badRequest('User Not Found')

        try {
        
            const nuevoUsuario = {
                ...UpdateUserDto
            }
            const usuarioUpdated = await UserModel.findByIdAndUpdate(id,nuevoUsuario,{ new: true})

            return{
                ok: true,
                user: usuarioUpdated
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async updatePassword(id:string,newPassword:string) {
        
        if (!mongoose.Types.ObjectId.isValid(id)) throw CustomError.badRequest('Invalid Id')

        const user = await UserModel.findById(id)
        if (!user) throw CustomError.badRequest('User Not Found')

        try {
    
            const newpass = bcryptAdapter.hash(newPassword)
            user.password = newpass
    
            await UserModel.findByIdAndUpdate(id,user,{ new: true})
    
            return {
                ok: true,
                msg: 'Password actualizado'
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}