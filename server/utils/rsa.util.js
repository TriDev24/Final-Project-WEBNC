import crypto from 'crypto';

console.log('process.env.MONGO_DATABASE_URI', process.env.MONGO_DATABASE_URI);
console.log('process.env.PRIVATE_KEY', process.env.PRIVATE_KEY);
console.log('process.env.PUBLIC_KEY', process.env.PUBLIC_KEY);

export const generateSignature = () => {
    return crypto.sign('sha256', Buffer.from(''), {
        key: process.env.PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
};

export const verifySignature = (signature) => {
    return crypto.verify(
        'sha256',
        Buffer.from(''),
        {
            key: process.env.PUBLIC_KEY,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        },
        signature
    );
};
