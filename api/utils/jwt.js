import jwt from 'jsonwebtoken';
import TokenModel from '../models/token-model.js';
import 'dotenv/config';


export default {
    generate(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken,
        };
    },

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { userId } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({ userId, refreshToken });
    },

    async removeToken(refreshToken) {
        return await TokenModel.destroy({ where: { refreshToken } });
    },

    verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    },

    verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    },

    async findToken(refreshToken) {
        return await TokenModel.findOne({ where: { refreshToken } });
    },
    //
    // decode(token) {
    // 	return jwt.decode(token);
    // },
};
