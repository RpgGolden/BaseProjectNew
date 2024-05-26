import { DataTypes, Model } from 'sequelize';

export default class TokenModel extends Model {
    static initialize(sequelize) {
        TokenModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                refreshToken: { type: DataTypes.STRING(1500), allowNull: false },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'TokenModel',
                tableName: 'token-model',
                paranoid: true,
            }
        );
    }
}
