require("dotenv").config();
import jwt from 'jsonwebtoken';


const {
    JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_RESET_SECRET,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = process.env;

export async function AccessToken(data) {
    const accessToken = await signJWT(data, JWT_ACCESS_SECRET, {
        expiresIn: "1h",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
    return accessToken;
}

export async function ResetToken(data) {
    const resetToken = await signJWT(data, JWT_RESET_SECRET, {
        expiresIn: "15m",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE
    });
    return resetToken;
}

export async function RefreshToken(data) {
    const refreshToken = await signJWT(data, JWT_REFRESH_SECRET, {
        expiresIn: "4w",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
    return refreshToken
}

export async function TokenPairs(data) {
    const accessToken = await AccessToken(data);
    const refreshToken = await RefreshToken(data);
    return { accessToken, refreshToken };    
}

const signJWT = (payload, secret, options) =>
new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
    })
})


