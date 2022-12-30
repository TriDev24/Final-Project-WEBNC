import jwt from 'jsonwebtoken';

export default (roles) => {
    return (req, res, next) => {
        console.log('vao mdw');

        const accessToken = req.headers['authorization'];

        if (accessToken) {
            try {
                const decode = jwt.verify(
                    accessToken,
                    process.env.JWT_SECRET_KEY
                );
                req.userId = decode.data.id;

                console.log('roles', roles);

                console.log('decode.data.role', decode.data.role);
                const isContainRole = roles.includes(decode.data.role);
                console.log('isContainRole', isContainRole);

                if (isContainRole) {
                    next();
                } else {
                    return res.status(401).json({
                        message:
                            'Bạn không được phép truy cập nguồn tài nguyên này!',
                    });
                }
            } catch (err) {
                if (err.message === 'jwt expired')
                    return res.status(401).json({
                        message: 'Token đã hết hạn!',
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
};
