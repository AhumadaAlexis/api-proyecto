// Express import 
import express from 'express';
import {Request, Response} from 'express';
//JSON WEB TOKEN import
import jwt from 'jsonwebtoken';
// Cors import
import cors from 'cors';
//Bcryptjs import
import bcrypt from 'bcryptjs';
// Middleware import
import AuthToken from './middlewares/token.middleware';
//Environments import
import ENV from './environments/env.production';
//MongoDBHelper
import MongoDBHelper from './helpers/mongodb.helper';

// Constants declarations
const app = express();
const token = AuthToken();
const mongoDB = MongoDBHelper.getInstance(ENV.MONGODB);

// Middleware for API
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Middleware for cors
app.use(cors({origin: true, credentials: true}));

app.get('/api/auth/test',(req:Request, res:Response) => {
    res.status(200).json({
        ok: true,
        msg: 'Llamada a API-auth de manera correcta'
    });
});

app.post('/api/auth/login', async(req:Request, res:Response) => {
    const {username, password} = req.body;
    const user = await mongoDB.db.collection('users').findOne({email: username});
    
    if(user){
        if(!bcrypt.compareSync(password, user.password)){
            return res.status(403).json({
                ok: false,
                msg: 'Usuario y/o contraseña incorrecta. Favor de verificar'
            });
        }
        
        const userValid ={
            uid: user._id,
            email: user.email,
            fullName: user.fullName,
            urlPhoto: user.urlPhoto,
            rol: user.rol
        }
    
        jwt.sign(userValid, 'secretkeyword',{expiresIn: '200s'},(err:any, token) =>{
    
            if(err){
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
    }else{
        res.status(404).json({
            ok: false,
            msg: 'Usuario y/o contraseña incorrecta. Favor de verificar'
        });
    }
});

app.post('/api/auth/createUser', async(req:Request, res:Response)=>{
    const {email, password, fullName, urlPhoto, rol}= req.body;
    const newUser = {email, password:bcrypt.hashSync(password,10), fullName, urlPhoto, rol}
    const insert = await mongoDB.db.collection('users').insertOne(newUser);
    res.status(200).json({
        ok: true,
        msg: 'Usuario creado de manera correcta',
        uid: insert.insertedId
    });
});

app.get('/api/auth/getCustomers',token.verify,(req:Request, res:Response)=>{
    const { authUser } = req.body;
    const mockCustomer =[
        {
            clave:'ALFKI',
            nombre: 'American Axel'
        },
        {
            clave:'GKN',
            nombre: 'Grupo Pirelli'
        },
        {
            clave:'GM',
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

app.get('/api/auth/authorization',token.verify,(req:Request, res:Response)=>{
    var hola = token.verify;
    res.status(200).json({
        ok: true
    });
});

app.listen(ENV.API.PORT, async()=> {
    console.log(`Servidor de APIs funcionando correctamente en el puerto ${ENV.API.PORT}`);
    //Conectar con MongoDB
    await mongoDB.connect();
});

//Handle errors
process.on('unhandledRejection', async(err:any)=>{
    //Close MongoDB conection
    mongoDB.close();
    process.exit();
});