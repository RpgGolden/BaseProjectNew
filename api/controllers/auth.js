import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthDto from '../dtos/auth-dto.js';
import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import User from '../models/user.js';
import TokenModel from '../models/token-model.js';
import jwtUtils from '../utils/jwt.js';

import 'dotenv/config';

export default {
    async register(req, res) {
        try {
            const { name, surname, patronymic, login, password } = req.body;

            if (!name || !surname || !patronymic || !login || !password) {
                throw new AppErrorMissing('No name, surname, login or password');
            }

            // Проверяем, существует ли пользователь с таким же логином
            const existingUser = await User.findOne({ where: { login } });
            if (existingUser) {
                throw new AppErrorAlreadyExists('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ name, surname, patronymic, login, password: hashedPassword });


            // Генерируем и сохраняем JWT-токены
            const { accessToken, refreshToken } = jwtUtils.generate({ id: user.id });
            await jwtUtils.saveToken(user.id, refreshToken);

            const authDto = new AuthDto(user);
            return res.json({ ...authDto, accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        const { login, password } = req.body;

        if (!login || !password) {
            throw new AppErrorMissing('No login or password');
        }

        // Поиск пользователя по логину в базе данных
        const user = await User.findOne({ where: { login } });
        if (!user) {
            throw new AppErrorMissing('User not found');
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppErrorMissing('Wrong password');
        }

        // Генерация access и refresh токенов
        const { accessToken, refreshToken } = jwtUtils.generate({ id: user.id });
        await jwtUtils.saveToken(user.id, refreshToken);

        // Возврат ответа с токенами и информацией о пользователе
        const authDto = new AuthDto(user);
        return res.json({ ...authDto, accessToken, refreshToken });
    },

    async logout(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppErrorMissing('No refresh token');
        }

        try {
            jwtUtils.verifyRefreshToken(refreshToken);

            await jwtUtils.removeToken(refreshToken);

            return res.json({ success: true });
        } catch (error) {
            throw new AppErrorMissing('Invalid refresh token');
        }
    },
    async refreshToken(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppErrorMissing('No refresh token');
        }

        try {
            const { id } = jwtUtils.verifyRefreshToken(refreshToken);

            const tokenData = await jwtUtils.findToken(refreshToken);
            if (!tokenData) {
                throw new AppErrorMissing('Invalid refresh token');
            }

            const { accessToken, refreshToken: newRefreshToken } = jwtUtils.generate({ id });
            await jwtUtils.saveToken(id, newRefreshToken);

            return res.json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            throw new AppErrorMissing('Invalid refresh token');
        }
    },
};
