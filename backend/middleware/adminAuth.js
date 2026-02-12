import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    if (process.env.DISABLE_ADMIN_AUTH === 'true') {
      return next();
    }

    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Admin Access Denied" });
    }

    next();

  } catch (error) {
    return res.json({ success: false, message: "Not Authorized" });
  }
};

export default adminAuth;
