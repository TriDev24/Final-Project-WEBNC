import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const publicKeyContent =
    '-----BEGIN PUBLIC KEY-----\r\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEn56K1+7S3HaxdKuggrvQ64kUAH\r\nIyW1enM95U4P/znvWRq8Nhp9+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQC\r\negCLzLZZdMScUenUEDwNuDXqEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX\r\n8pi+Jb7mVjePTlgFAgMBAAE=\r\n-----END PUBLIC KEY-----';
const privateKeyContent =
    '-----BEGIN RSA PRIVATE KEY-----\r\nMIICWgIBAAKBgEn56K1+7S3HaxdKuggrvQ64kUAHIyW1enM95U4P/znvWRq8Nhp9\r\n+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQCegCLzLZZdMScUenUEDwNuDXq\r\nEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX8pi+Jb7mVjePTlgFAgMBAAEC\r\ngYAlLREwd3PsKKZ52xToXEqzZi+glLWmErCJz5Y4B7QEwnLuC53I7Hvbjdqgn20d\r\n/KVwrWD8LTYN69/aPJTl3B/uVLrfV726jhe1iusBSy9ev4DqcyEriwYmC1BewiFG Uq6c0lh/bchn9gz6Buw0ve6ez7akUiW1jq3vlMFaWovPdQJBAIt8xWAtQOo08eQ9\r\nDTJcze3UUBBIx5ZVk9uGk3U6ASmqheWe5iK6a12LeGPbzDrKUcXhDVO7xGmmVyze\r\nJb5dO5MCQQCHxJTHLnyFgeG9wfqZ6zTzzOTwiwL/YNLZXVfofdfQJEk4JJwd402J\r\nFOhXN9w1laEhNAyAlv9zdgVyTwsf380HAkALOz+1T8+DTEIR66yNWpWmScsslH+l\r\npjxil8J11PbVAQsJAzNqpnIQtTM7by5RqYrOESH+lQbqrt8kGLsXSfCLAkAgdMMo\r\nVpmYBPOlPGEfOJZBDiNQybqeuFPPeLwSLTtRW8tRK5dSocsgUSo153myKaIKYPn4\r\nJ6DLxlQI/pJnPUYzAkAkqkghECA7k7mZRD4OxIZCbktfu2/8r0TjtWQlGgqwr1Hq\r\n4JZ2S3Xp6FrZoofLaYYoO2S/BtwhybCkW3BjrZBv\r\n-----END RSA PRIVATE KEY-----';

export const generateSignature = (payload) => {
    try {
        return jwt.sign(payload, privateKeyContent, {
            algorithm: 'RS256',
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const generateHashString = (payload) => {
    try {
        const secretData = JSON.stringify(payload) + publicKeyContent;
        return crypto.createHash('sha256', secretData).digest('base64');
    } catch (error) {
        throw new Error(error);
    }
};

export const verifySignature = (signature) => {
    try {
        return jwt.verify(signature, process.env.PARTNER_PUBLIC_KEY, {
            algorithms: ['RS256'],
        });
    } catch (error) {
        throw new Error('Chữ ký không hợp lệ');
    }
};
