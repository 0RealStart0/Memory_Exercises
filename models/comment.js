const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {

            },
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            writer: {

            },
            views: {

            },

            //   img: {
            //     type: Sequelize.STRING(200),
            //     allowNull: true,
            //   },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Coment',
            tableName: 'coments',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
    }
};