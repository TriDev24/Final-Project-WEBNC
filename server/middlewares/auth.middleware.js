import jwt from "jsonwebtoken";

export default (role) => {
  return (req, res, next) => {
    const accessToken = req.headers["authorization"];

    if (accessToken) {
      try {
        const decode = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.userId = decode.data.id;
        if (decode.data.role === role) {
          next();
        } else {
          return res.status(401).json({
            message: "Bạn không được phép truy cập nguồn tài nguyên này!",
          });
        }
      } catch (err) {
        if (err.message === "jwt expired")
          return res.status(401).json({
            message: "Token đã hết hạn!",
          });
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      return res.status(403).json({
        message: "No token provided",
      });
    }
  };
};
