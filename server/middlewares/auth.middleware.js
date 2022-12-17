import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const accessToken = req.headers['authorization'];

    if (accessToken) {
        try {
            const decode = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            req.userId = decode.data;
            next();
        } catch (err) {
            if (err.message === 'jwt expired')
                return res.status(401).json({
                    message: 'Token has expired',
                });
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No token provided',
        });
    }
};
