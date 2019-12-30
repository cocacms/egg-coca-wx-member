'use strict';

module.exports = app => {
  const Sequelize = app.Sequelize;
  const Model = app.model.define('wx_member', {
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
    }, 

    session_key: Sequelize.STRING(60),
  });

  Model.associate = function() {};

  return Model;
};
