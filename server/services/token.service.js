import jwt from 'jsonwebtoken';
import { tokenConfig } from '../configs/index.js';

export class TokenService {
    static createToken(value) {
        this.currentToken = jwt.sign(value, tokenConfig.secretKey, {
            algorithm: tokenConfig.algorithm,
            expiresIn: tokenConfig.expiresIn,
        });

        return this.currentToken;
    }

    static async getPayloadFromCurrentToken(req) {
        const token = req.headers.authorization.split(' ')[1];

        return await jwt.verify(token, tokenConfig.secretKey);
    }

    static async extractDataFromToken() {
        const data = this.decode(this.currentToken);
        return data;
    }
}
