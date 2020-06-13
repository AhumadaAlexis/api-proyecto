"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// JSON WEB TOKEN import
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = () => {
    return {
        verify: (req, res, next) => {
            // Get auth header value 
            const bearerHeader = req.headers['authorization'];
            // Validar que el bearerHeader
            if (typeof bearerHeader !== 'undefined') {
                // Split
                const bearer = bearerHeader.split(' ');
                // Obtener Token desde el resultado
                const bearerToken = bearer[1];
                // Verificar Token
                jsonwebtoken_1.default.verify(bearerToken, 'secretkeyword', (err, tokenDecoded) => {
                    if (err) {
                        res.status(401).json({
                            ok: false,
                            msg: 'Lo sentimos usted no tiene acceso. Favor de verificar'
                        });
                    }
                    req.body.authUser = tokenDecoded;
                    next();
                });
            }
            else {
                // Usuario no autorizado
                return res.status(401).json({
                    ok: false,
                    msg: 'Lo sentimos el acceso es exclusivo, requiere iniciar sesión para acceder'
                });
            }
        }
    };
};
