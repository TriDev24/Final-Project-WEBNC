import jwt from 'jsonwebtoken';
import { tokenConfig } from '../configs/index.js';

export default {
    async createToken(value) {
        this.currentToken = jwt.sign(value, tokenConfig.secretKey, {
            algorithm: tokenConfig.algorithm,
            expiresIn: tokenConfig.expiresIn,
        });

        return this.currentToken;
    },
    async getPayloadFromCurrentToken(req) {
        const token = req.headers.authorization.split(' ')[1];

        return await jwt.verify(token, tokenConfig.secretKey);
    },
    async extractDataFromToken() {
        const data = this.decode(this.currentToken);
        return data;
    },
};
