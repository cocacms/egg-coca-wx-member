'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(Sequelize.Utils.pluralize('wx_member'), {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      nick_name: Sequelize.STRING, // 微信昵称
      avatar_url: Sequelize.STRING, // 头像
      gender: Sequelize.STRING(1), // 性别
      country: Sequelize.STRING(20), // 国家
      province: Sequelize.STRING(20), // 省
      city: Sequelize.STRING(20), // 城

      tel: {
        type: Sequelize.STRING(14), // 电话
        unique: true,
      },

      openid: {
        type: Sequelize.STRING(60),
        unique: true,
      },

      unionid: {
        type: Sequelize.STRING(60),
        unique: true,
      }, // 预留

      session_key: Sequelize.STRING(60),

      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(Sequelize.Utils.pluralize('wx_member'));
  },
};
