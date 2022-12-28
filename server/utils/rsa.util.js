import crypto from 'crypto';

export const generateSignature = () => {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
    });
    console.log('private key ne: ', privateKey);

    return crypto.sign('sha256', Buffer.from(''), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
};

export const verifySignature = (signature) => {
    const result = crypto.verify(
        'sha256',
        Buffer.from(''),
        {
            key: process.env.PUBLIC_KEY,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        },
        signature
    );
    console.log('decoded', result);

    return result;
};
