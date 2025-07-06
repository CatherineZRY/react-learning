import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - NO token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const findUser = await User.findById(decoded.userId).select("-password"); // 不要返回密码
    //   // 推荐的写法
    //  const user = await User.findById(id).select("-password");

    //  // 如果需要多个字段排除
    //  const user = await User.findById(id).select("-password -sensitiveField1 -sensitiveField2");

    //  // 如果只需要特定字段
    //  const user = await User.findById(id).select("email fullName profilePic");
    if (!findUser) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = findUser; // 将用户信息添加到请求对象中，以便后续请求中可以获取
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ', error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

