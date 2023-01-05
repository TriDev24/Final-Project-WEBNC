import rsa from 'node-rsa';
import * as fs from 'fs';

const publicKey = new rsa();
const privateKey = new rsa();

// const publicKeyContent = fs.readFileSync(
//     process.cwd() + '/keys/private.pem',
//     'utf-8'
// );
// const privateKeyContent = fs.readFileSync(
//     process.cwd() + '/keys/private.pem',
//     'utf-8'
// );

const publicKeyContent =
    '-----BEGIN PUBLIC KEY----- MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEn56K1+7S3HaxdKuggrvQ64kUAH IyW1enM95U4P/znvWRq8Nhp9+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQC egCLzLZZdMScUenUEDwNuDXqEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX 8pi+Jb7mVjePTlgFAgMBAAE= -----END PUBLIC KEY-----';
const privateKeyContent =
    '-----BEGIN RSA PRIVATE KEY----- MIICWgIBAAKBgEn56K1+7S3HaxdKuggrvQ64kUAHIyW1enM95U4P/znvWRq8Nhp9 +TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQCegCLzLZZdMScUenUEDwNuDXq Ebmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX8pi+Jb7mVjePTlgFAgMBAAEC gYAlLREwd3PsKKZ52xToXEqzZi+glLWmErCJz5Y4B7QEwnLuC53I7Hvbjdqgn20d /KVwrWD8LTYN69/aPJTl3B/uVLrfV726jhe1iusBSy9ev4DqcyEriwYmC1BewiFG Uq6c0lh/bchn9gz6Buw0ve6ez7akUiW1jq3vlMFaWovPdQJBAIt8xWAtQOo08eQ9 DTJcze3UUBBIx5ZVk9uGk3U6ASmqheWe5iK6a12LeGPbzDrKUcXhDVO7xGmmVyze Jb5dO5MCQQCHxJTHLnyFgeG9wfqZ6zTzzOTwiwL/YNLZXVfofdfQJEk4JJwd402J FOhXN9w1laEhNAyAlv9zdgVyTwsf380HAkALOz+1T8+DTEIR66yNWpWmScsslH+l pjxil8J11PbVAQsJAzNqpnIQtTM7by5RqYrOESH+lQbqrt8kGLsXSfCLAkAgdMMo VpmYBPOlPGEfOJZBDiNQybqeuFPPeLwSLTtRW8tRK5dSocsgUSo153myKaIKYPn4 J6DLxlQI/pJnPUYzAkAkqkghECA7k7mZRD4OxIZCbktfu2/8r0TjtWQlGgqwr1Hq 4JZ2S3Xp6FrZoofLaYYoO2S/BtwhybCkW3BjrZBv -----END RSA PRIVATE KEY-----';

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
