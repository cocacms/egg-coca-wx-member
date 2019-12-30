'use strict';

const Service = require('egg').Service;

class _Service extends Service {
  async login() {
    const { ctx, app, service } = this;
    const code = ctx.request.query.code;

    const result = await app.weapp.auth.code2Session({ js_code: code });
    if (!result.openid) {
      ctx.logger.error(new Error(result.errmsg));
      ctx.throw('登录失败');
    }

    let member = await app.model.WxMember.findOne({ where: { openid: result.openid } });
    if (!member) {
      member = await app.model.WxMember.create({
        openid: result.openid,
      });
    }

    member.session_key = result.session_key;
    await member.save();
    ctx.wx_member = member;

    return {
      token: service.user.sign(member.id, true),
    };
  }


  async update() {
    const { ctx, app } = this;
    const body = ctx.request.body;
    return await app.model.WxMember.update(body, {
      fields: [ 'nick_name', 'avatar_url', 'gender', 'country', 'province', 'city' ],
      where: {
        id: ctx.wx_member.id,
      },
    });
  }

}

module.exports = _Service;
