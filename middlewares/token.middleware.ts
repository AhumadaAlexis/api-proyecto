// EXPRESS IMPORT
import {Request, Response, NextFunction} from 'express';
// JSON WEB TOKEN import
import jwt from 'jsonwebtoken';

export default () =>{
    return {
        verify: (req:Request, res:Response, next:NextFunction) =>{
            // Get auth header value 
            const bearerHeader = req.headers['authorization'];
            // Validar que el bearerHeader
            if(typeof bearerHeader !== 'undefined'){
                // Split
                const bearer = bearerHeader.split(' ');
                // Obtener Token desde el resultado
                const bearerToken = bearer[1];
                // Verificar Token
                jwt.verify(bearerToken,'secretkeyword', (err:any, tokenDecoded:any)=>{
                    if(err){
                        res.status(401).json({
                            ok: false,
                            msg: 'Lo sentimos usted no tiene acceso. Favor de verificar'
                        });
                    }

                    req.body.authUser = tokenDecoded;
                    next();
                });
            } else{
                // Usuario no autorizado
                return res.status(401).json({
                    ok: false,
                    msg: 'Lo sentimos el acceso es exclusivo, requiere iniciar sesión para acceder'
                });
            }
        }
    }
}