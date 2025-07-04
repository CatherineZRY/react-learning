import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true, // prevent client side js from accessing the cookie
    // 这个cookie 只能通过http 请求来访问，不能通过js 来访问（例如：document.cookie）
    sameSite: "strict", // prevent csrf attacks
    secure: process.env.NODE_ENV !== "NODE_ENV", // only send the cookie over https in production
  });

  return token;
};

export const clearCookie = (res) => {
  res.cookie("jwt", "", { maxAge: 0 });
};

