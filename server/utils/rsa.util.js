import jwt from 'jsonwebtoken';

const publicKeyContent =
    '-----BEGIN PUBLIC KEY-----\r\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEn56K1+7S3HaxdKuggrvQ64kUAH IyW1enM95U4P/znvWRq8Nhp9+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQC egCLzLZZdMScUenUEDwNuDXqEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX 8pi+Jb7mVjePTlgFAgMBAAE=\r\n-----END PUBLIC KEY-----';
const privateKeyContent =
    '-----BEGIN RSA PRIVATE KEY-----\r\nMIICWgIBAAKBgEn56K1+7S3HaxdKuggrvQ64kUAHIyW1enM95U4P/znvWRq8Nhp9 +TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQCegCLzLZZdMScUenUEDwNuDXq Ebmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX8pi+Jb7mVjePTlgFAgMBAAEC gYAlLREwd3PsKKZ52xToXEqzZi+glLWmErCJz5Y4B7QEwnLuC53I7Hvbjdqgn20d /KVwrWD8LTYN69/aPJTl3B/uVLrfV726jhe1iusBSy9ev4DqcyEriwYmC1BewiFG Uq6c0lh/bchn9gz6Buw0ve6ez7akUiW1jq3vlMFaWovPdQJBAIt8xWAtQOo08eQ9 DTJcze3UUBBIx5ZVk9uGk3U6ASmqheWe5iK6a12LeGPbzDrKUcXhDVO7xGmmVyze Jb5dO5MCQQCHxJTHLnyFgeG9wfqZ6zTzzOTwiwL/YNLZXVfofdfQJEk4JJwd402J FOhXN9w1laEhNAyAlv9zdgVyTwsf380HAkALOz+1T8+DTEIR66yNWpWmScsslH+l pjxil8J11PbVAQsJAzNqpnIQtTM7by5RqYrOESH+lQbqrt8kGLsXSfCLAkAgdMMo VpmYBPOlPGEfOJZBDiNQybqeuFPPeLwSLTtRW8tRK5dSocsgUSo153myKaIKYPn4 J6DLxlQI/pJnPUYzAkAkqkghECA7k7mZRD4OxIZCbktfu2/8r0TjtWQlGgqwr1Hq 4JZ2S3Xp6FrZoofLaYYoO2S/BtwhybCkW3BjrZBv\r\n-----END RSA PRIVATE KEY-----';

export const generateSignature = (payload) => {
    try {
        // return privateKey.encryptPrivate(saltData, 'base64');
        return jwt.sign(payload, privateKeyContent, {
            algorithm: 'RS256',
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const generateHashString = (payload) => {
    try {
        return jwt.sign(payload, publicKeyContent, {
            algorithm: 'RS256',
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const verifySignature = (signature) => {
    try {
        const decrypted = jwt.decode(signature, 'utf8');

        return decrypted === saltData;
    } catch (error) {
        throw new Error(error.message);
    }
};
