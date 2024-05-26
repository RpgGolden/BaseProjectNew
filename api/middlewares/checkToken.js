import jwtUtils from '../utils/jwt.js';
import { AppErrorInvalid } from '../utils/errors.js';

// Удаляем "default" перед "function"
export const authenticateToken = async (req, res, next) => {
    try {
        // Получаем токен из заголовка Authorization
        const token = req.headers.authorization;

        if (!token) {
            throw new AppErrorInvalid('No token provided');
        }

        // Проверяем валидность токена
        const decoded = await jwtUtils.verifyAccessToken(token);

        // Передаем информацию о пользователе в запрос для последующих обработчиков
        req.user = decoded;

        console.log(req.user);

        next();
    } catch (error) {
        next(error); // Передаем ошибку дальше для обработки централизованной обработки ошибок
    }
};
