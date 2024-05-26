import { mapObjectKeys } from '../utils/map.js';

const roles = {
    DRIVER: 1,
    ADMINISTRATOR: 2,
};

export default roles;

export const map = mapObjectKeys(roles);
