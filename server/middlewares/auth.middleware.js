import jwt from 'jsonwebtoken';

export default (roles) => {
    return (req, res, next) => {
        const accessToken = req.headers['authorization'];

        if (accessToken) {
            try {
                const decode = jwt.verify(
                    accessToken,
                    process.env.JWT_SECRET_KEY
                );
                req.userId = decode.data.id;
                const isContainRole = roles.includes(decode.data.role);

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
                    message: 'Chưa được xác thực',
                });
            }
        } else {
            return res.status(403).json({
                message: 'Không có token nào được cung cấp',
            });
        }
    };
};
