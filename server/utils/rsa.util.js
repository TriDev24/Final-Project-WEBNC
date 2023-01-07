import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// const publicKeyContent =
//     '-----BEGIN PUBLIC KEY-----\r\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEn56K1+7S3HaxdKuggrvQ64kUAH\r\nIyW1enM95U4P/znvWRq8Nhp9+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQC\r\negCLzLZZdMScUenUEDwNuDXqEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX\r\n8pi+Jb7mVjePTlgFAgMBAAE=\r\n-----END PUBLIC KEY-----';
// const privateKeyContent =
//     '-----BEGIN RSA PRIVATE KEY-----\r\nMIICWgIBAAKBgEn56K1+7S3HaxdKuggrvQ64kUAHIyW1enM95U4P/znvWRq8Nhp9\r\n+TTwWsaFGdMiEGk8VpofT5xlzriEIeCu52QZYcQCegCLzLZZdMScUenUEDwNuDXq\r\nEbmxix1feZ8RRhCIVRvWy3S4fnEpcCMcmfiwM5wX8pi+Jb7mVjePTlgFAgMBAAEC\r\ngYAlLREwd3PsKKZ52xToXEqzZi+glLWmErCJz5Y4B7QEwnLuC53I7Hvbjdqgn20d\r\n/KVwrWD8LTYN69/aPJTl3B/uVLrfV726jhe1iusBSy9ev4DqcyEriwYmC1BewiFG Uq6c0lh/bchn9gz6Buw0ve6ez7akUiW1jq3vlMFaWovPdQJBAIt8xWAtQOo08eQ9\r\nDTJcze3UUBBIx5ZVk9uGk3U6ASmqheWe5iK6a12LeGPbzDrKUcXhDVO7xGmmVyze\r\nJb5dO5MCQQCHxJTHLnyFgeG9wfqZ6zTzzOTwiwL/YNLZXVfofdfQJEk4JJwd402J\r\nFOhXN9w1laEhNAyAlv9zdgVyTwsf380HAkALOz+1T8+DTEIR66yNWpWmScsslH+l\r\npjxil8J11PbVAQsJAzNqpnIQtTM7by5RqYrOESH+lQbqrt8kGLsXSfCLAkAgdMMo\r\nVpmYBPOlPGEfOJZBDiNQybqeuFPPeLwSLTtRW8tRK5dSocsgUSo153myKaIKYPn4\r\nJ6DLxlQI/pJnPUYzAkAkqkghECA7k7mZRD4OxIZCbktfu2/8r0TjtWQlGgqwr1Hq\r\n4JZ2S3Xp6FrZoofLaYYoO2S/BtwhybCkW3BjrZBv\r\n-----END RSA PRIVATE KEY-----';

// PARTNER
const publicKey =
    '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAxpIlphyAdHY/HAPe9vACF2MLZVeZRf9cSObxXpYvkFdM0KA8sk/5\nJepuf2IjOTkWyMsTa5PpEA0Yc8W4Kai8za7fDdk4gAC5/tctRctBtgl9CsjMMm47\nBy8vKHh4aeIstwXMaavdAwz3IIpBpCwYnc1CK1+5y9UQ5gzle5WZtWwvlpEtTKjI\nvtip3957ue8VaDmF4N6Y841JSn9kMHbUrtgq0qPvv6+XaEWcLfMypaiV6xpboZou\nqTVvTuHm3locxQjOKTkx3DYTnOhpX0rlJMVxX+vMRrN4QyuTM/VoHFWHKIM5YT3h\nvYSR4bkX8pzJtp8CXAHN5OxavNmKSpxvHwIDAQAB\n-----END RSA PUBLIC KEY-----\n';

const privateKey =
    '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAxpIlphyAdHY/HAPe9vACF2MLZVeZRf9cSObxXpYvkFdM0KA8\nsk/5Jepuf2IjOTkWyMsTa5PpEA0Yc8W4Kai8za7fDdk4gAC5/tctRctBtgl9CsjM\nMm47By8vKHh4aeIstwXMaavdAwz3IIpBpCwYnc1CK1+5y9UQ5gzle5WZtWwvlpEt\nTKjIvtip3957ue8VaDmF4N6Y841JSn9kMHbUrtgq0qPvv6+XaEWcLfMypaiV6xpb\noZouqTVvTuHm3locxQjOKTkx3DYTnOhpX0rlJMVxX+vMRrN4QyuTM/VoHFWHKIM5\nYT3hvYSR4bkX8pzJtp8CXAHN5OxavNmKSpxvHwIDAQABAoIBACxF4YcLy8grpR6F\n7mx4Tr8QIjZSNaZZrSXD+ATyz2ALVuEdGOtY0WAWyNQ1+UyE4gOa45WUwN4HTXBi\noREIwi/J0Ymw6NwBTXb4Wuu4ycngi7Sf2IdV9GtBpe4MDiztdLLJ5C2bWAeaGG90\n4/XKryJf5WTuTuqXctEYBwJq9H5yX2tMp/3YXkX7NsFQ1iPWZp1jXoKgxDmWaXoB\nWs8zAotE/eJYGF4UVbwGaZmHmKRRPglF0B5DurmI+iKBFzSU0zGASZAhKOsjUvz/\nJxstvJ+3kUyfuFQiPNxxqSQhLM2hBebi12oU6B7ztLWz2Gh9LJ5G4mVDSEJ4o+6j\nOdT/XaECgYEA/G3tW74H7Fo+1Dt9Xi+foQknprcNZhde7VgVOP5vsEY7yzNfJFTW\naxC3/i03fHZzOeAuYKQYTaoTq4gkFSdkbhnwKH/36+z2nZEbgdFsmIcImayClDI1\nc1YJcrdw3Nu6e8zK6PBcxRGWRutEVrFK04sku4SatLSywZTrSrjcf4UCgYEAyWEx\nUj/IYjQUdeeFxsUq5nbcrunq3im2eEBu/WyDJvYt6H+yxZAMVZzJ/0YpNSt2Elhc\ntrtI9QRkoFNDpBBPdTuJ+1xmd4upLHUFqsEm1bxt2GX0lxw54nhoLbM1jFMTGTxP\ntylAqWS7s5EKniO4DEEkETplP+lb5SJ6rd7Q61MCgYEAui8STQKCsY92m+8s7tVN\ndedcuZh2Z4CBYaoALUNteaSz4ZKIcDGq3Nk9/Fm5fTGYl22Eh39A9bemPnRxuLCP\nYK389sI8SGVFGL64fS3MXUvryfz1av0Fc4ZX/abTtfLTPxCz8M+ofSoVn0VT6GVn\n/VO5yh1qRjKpTiLa0Qg8ikkCgYA6weMULowXKz71D/KWhpz31aKaXqIq5FzbRWGd\nC/ZQfe/zMJ9Gybrvl+nQU/ZeDypKPAIBRzAIXZnGtcS8sA2fFRozf0hehR99Wz+m\nDOl535rlUwpEtPWmwJ8VBn8PTIX8DP7tYFn/kua5hA5nCeD/oloVtMYqGbq4ZpEI\n/kRTBQKBgQDFshMfZHiA4abjh/DLQTrohdGaxW6f8TmEALjeY6RmigRhLr+gvLHS\ndnptCwQ04GJWptwpaSJJWpD8StjwVPGWt8Y91Er7ndWL6TDcqWQ0n+dUiTeycmvv\nnZO5DlL3icVZ2CDYXd0rXKgFj/Qop08bXNrGglmBsrA8OH2Nvr3aWw==\n-----END RSA PRIVATE KEY-----';

export const generateSignature = (payload) => {
    try {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const generateHashString = (payload) => {
    try {
        console.log('payload', payload);
        const secretData = JSON.stringify(payload) + publicKey;
        console.log('secretData', secretData);

        return crypto.createHash('sha256').update(secretData).digest('base64');
    } catch (error) {
        throw new Error(error);
    }
};

export const verifySignature = (signature) => {
    try {
        return jwt.verify(signature, publicKey, {
            algorithms: ['RS256'],
        });
    } catch (error) {
        throw new Error('Chữ ký không hợp lệ');
    }
};
