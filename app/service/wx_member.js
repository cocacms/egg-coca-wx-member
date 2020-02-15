"use strict";

const Service = require("egg").Service;

class _Service extends Service {
  async login() {
    const { ctx, app, service } = this;
    const code = ctx.request.query.code;

    const result = await app.weapp().auth.code2Session({ js_code: code });
    if (!result.openid) {
      ctx.logger.error(new Error(result.errmsg));
      ctx.throw("登录失败");
    }

    let member = await app.model.WxMember.findOne({
      where: { openid: result.openid }
    });
    if (!member) {
      member = await app.model.WxMember.create({
        openid: result.openid
      });
    }

    member.session_key = result.session_key;
    await member.save();
    ctx.wx_member = member;

    return {
      token: service.user.sign(member.id, true)
    };
  }

  async update() {
    const { ctx, app } = this;
    const body = ctx.request.body;
    return await app.model.WxMember.update(body, {
      fields: [
        "nick_name",
        "avatar_url",
        "gender",
        "country",
        "province",
        "city"
      ],
      where: {
        id: ctx.wx_member.id
      }
    });
  }

  /**
   * 绑定手机
   * @param {*} encryptedData 数据
   * @param {*} iv 数据
   */
  async bind_tel(encryptedData, iv) {
    const { ctx, app } = this;
    let tel;

    try {
      const result = app.weapp().crypto.decryptData({
        sessionKey: ctx.wx_member.session_key,
        encryptedData,
        iv
      });
      tel = result.purePhoneNumber;
    } catch (error) {
      ctx.throw("身份过期，请重新登录", 401);
    }

    if (!tel) {
      ctx.throw("手机号码无效");
    }

    try {
      ctx.body = await ctx.wx_member.update({
        tel
      });
    } catch (e) {
      ctx.throw("号码已被别人绑定");
    }
  }
}

module.exports = _Service;
