"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express import 
const express_1 = __importDefault(require("express"));
//JSON WEB TOKEN import
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Cors import
const cors_1 = __importDefault(require("cors"));
//Bcryptjs import
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Middleware import
const token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
//Environments import
const env_production_1 = __importDefault(require("./environments/env.production"));
//MongoDBHelper
const mongodb_helper_1 = __importDefault(require("./helpers/mongodb.helper"));
// Constants declarations
const app = express_1.default();
const token = token_middleware_1.default();
const mongoDB = mongodb_helper_1.default.getInstance(env_production_1.default.MONGODB);
// Middleware for API
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Middleware for cors
app.use(cors_1.default({ origin: true, credentials: true }));
app.get('/api/auth/test', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Llamada a API-auth de manera correcta'
    });
});
app.post('/api/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield mongoDB.db.collection('users').findOne({ email: username });
    if (user) {
        if (!bcryptjs_1.default.compareSync(password, user.password)) {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario y/o contraseña incorrecta. Favor de verificar'
            });
        }
        const userValid = {
            uid: user._id,
            email: user.email,
            fullName: user.fullName,
            urlPhoto: user.urlPhoto,
            rol: user.rol
        };
        jsonwebtoken_1.default.sign(userValid, 'secretkeyword', { expiresIn: '200s' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Ocurrio un error no contemplado',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                msg: 'El usuario es correcto',
                token
            });
        });
    }
    else {
        res.status(404).json({
            ok: false,
            msg: 'Usuario y/o contraseña incorrecta. Favor de verificar'
        });
    }
}));
app.post('/api/auth/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullName, urlPhoto, rol } = req.body;
    const newUser = { email, password: bcryptjs_1.default.hashSync(password, 10), fullName, urlPhoto, rol };
    const insert = yield mongoDB.db.collection('users').insertOne(newUser);
    res.status(200).json({
        ok: true,
        msg: 'Usuario creado de manera correcta',
        uid: insert.insertedId
    });
}));
app.get('/api/auth/getCustomers', token.verify, (req, res) => {
    const { authUser } = req.body;
    const mockCustomer = [
        {
            clave: 'ALFKI',
            nombre: 'American Axel'
        },
        {
            clave: 'GKN',
            nombre: 'Grupo Pirelli'
        },
        {
            clave: 'GM',
            nombre: 'General Motors'
        }
    ];
    res.status(200).json({
        ok: true,
        msg: 'Permiso de acceso concedido',
        data: mockCustomer,
        user: authUser
    });
});
app.get('/api/auth/authorization', token.verify, (req, res) => {
    var hola = token.verify;
    res.status(200).json({
        ok: true
    });
});
app.listen(env_production_1.default.API.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Servidor de APIs funcionando correctamente en el puerto ${env_production_1.default.API.PORT}`);
    //Conectar con MongoDB
    yield mongoDB.connect();
}));
//Handle errors
process.on('unhandledRejection', (err) => __awaiter(void 0, void 0, void 0, function* () {
    //Close MongoDB conection
    mongoDB.close();
    process.exit();
}));
