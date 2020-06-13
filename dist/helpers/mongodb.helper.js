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
Object.defineProperty(exports, "__esModule", { value: true });
// Mongo import
const mongodb_1 = require("mongodb");
// contenido archivo alcancable por todo el folder (variable universal)
class MongoDBHelper {
    constructor(SETTINGS) {
        this.port = SETTINGS.PORT;
        this.dbUri = `mongodb://${SETTINGS.USER_NAME}:${SETTINGS.USER_PASSWORD}@${SETTINGS.HOST}/${SETTINGS.DEFAULT_DATABASE}`;
    }
    //Patron Singleton
    static getInstance(settings) {
        return this._instance || (this._instance = new this(settings));
    }
    //Await espera a que se ejecute y devuelve al hilo principal las variables instanciadas
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongodb_1.MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
                .then((connection) => {
                this.cnn = connection;
                this.db = this.cnn.db();
                console.log('Conexión a MongoDB realizada de forma correcta');
            })
                .catch((err) => {
                console.log(`Ocurrio un error al intentar conectarse a la DB de MongoDB, error: `, err);
            });
        });
    }
    setDatabase(dbName) {
        this.db = this.cnn.db(dbName);
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cnn.close();
        });
    }
}
exports.default = MongoDBHelper;
