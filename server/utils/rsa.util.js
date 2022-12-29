import rsa from 'node-rsa';
import * as fs from 'fs';

const publicKey = new rsa();
const privateKey = new rsa();

const publicKeyContent = fs.readFileSync(
    process.cwd() + '/keys/private.pem',
    'utf-8'
);
const privateKeyContent = fs.readFileSync(
    process.cwd() + '/keys/private.pem',
    'utf-8'
);

publicKey.importKey(publicKeyContent);
privateKey.importKey(privateKeyContent);

const saltData = 'asdasdabsdjasjdabslkdnaklsndaklnsdaklnsd';

export const generateSignature = () => {
    try {
        return privateKey.encryptPrivate(saltData, 'base64');
    } catch (error) {
        console.log('error: ', error);
    }
};

export const verifySignature = (signature) => {
    try {
        const decrypted = publicKey.decryptPublic(signature, 'utf8');

        return decrypted === saltData;
    } catch (error) {
        console.log('error: ', error);
    }
};
