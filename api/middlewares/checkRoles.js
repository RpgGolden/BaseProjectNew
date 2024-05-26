import roles from '../config/roles.js';
import User from '../models/user.js';
// import { asyncRoute } from '../utils/errors.js';

const checkRole = allowedRoles => {
    return async (req, res, next) => {
        const user = await User.findByPk(req.user.id);

        if (user.role && (allowedRoles.some(role => user.role === role) || user.role === roles.ADMINISTRATOR)) {
            next();
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
};

export default checkRole;
