import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

/**
 * Middleware para verificar autenticación y rol (si se especifica)
 * @param {string|null} requiredRole - El rol requerido (ej: 'admin'), o null si solo se requiere sesión válida.
 */
export const checkAuth = (requiredRole: string | null = null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionCookie = req.cookies?.session || '';
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

    //   req.user = decodedClaims; // Agregar el objeto decodedClaims a la solicitud para su uso posterior

      // Verificar rol si se especifica uno
      if (requiredRole && decodedClaims.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      }

      next();
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }
  };
};