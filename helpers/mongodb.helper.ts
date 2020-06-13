// Mongo import
import {MongoClient} from 'mongodb';

// contenido archivo alcancable por todo el folder (variable universal)
export default class MongoDBHelper{
    public db: any;
    private cnn:any;
    private port:any;
    private dbUri: string;
    private static _instance: MongoDBHelper;

    constructor(SETTINGS:any){
        this.port = SETTINGS.PORT;
        this.dbUri = `mongodb://${SETTINGS.USER_NAME}:${SETTINGS.USER_PASSWORD}@${SETTINGS.HOST}/${SETTINGS.DEFAULT_DATABASE}`;
    }

    //Patron Singleton
    public static getInstance(settings: any){
        return this._instance || (this._instance = new this(settings));
    }

    //Await espera a que se ejecute y devuelve al hilo principal las variables instanciadas
    async connect(){
        await MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((connection:any) => {
                this.cnn = connection;
                this.db = this.cnn.db();
                console.log('Conexión a MongoDB realizada de forma correcta');
            })
            .catch((err:any)=>{
                console.log(`Ocurrio un error al intentar conectarse a la DB de MongoDB, error: `, err);
            });
    }

    setDatabase(dbName: string){
        this.db = this.cnn.db(dbName);
    }

    async close(){
        await this.cnn.close();
    }
}