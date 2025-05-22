import { COOKIE_OPTIONS } from "../../config/cookieOptions";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { UserModel } from "../../data/mongo/models/user.model";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService { 

    constructor(){}

     async login (req:Request, res:Response) {

        const { token } = req.body;
        if (!token) {
            throw CustomError.badRequest("Token no proporcionado")
        }
        try {
          // Verifica el token con Firebase
          const decodedToken = await admin.auth().verifyIdToken(token);
          const userId = decodedToken.uid;
      
          // Busca al usuario en la base de datos
          const user = await UserModel.findOne({ firebaseUid: userId });
          if (!user) {
            throw CustomError.notFound("Usuario no encontrado")
          }
      
          const sessionToken = await admin.auth().createSessionCookie(token, {
            expiresIn: COOKIE_OPTIONS.maxAge,
          });
          
          const COOKIE_NAME = "session";
          // Configura la cookie de sesión
          res.cookie(COOKIE_NAME, sessionToken, COOKIE_OPTIONS);
      
          // Retorna datos del usuario
          return res.status(200).json({
            message: "Login exitoso",
            user: {
              id: user._id,
              idCard: user.idCard,
              firstName: user.name,
              lastName: user.lastname,
              email: user.email,
              role: user.role,
              membership: user.membership,
            },
          });
        } catch (error) {
          console.error("Error verificando el token:", error);
          throw CustomError.unAuthorized("Token inválido o expirado")
        }
      };
}