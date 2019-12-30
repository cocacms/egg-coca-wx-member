'use strict';
module.exports = (need_login = true) => {
  return async function user(ctx, next) {
    let memberId = null;

    const Authorization = ctx.get('Authorization');
    if (Authorization) {
      try {
        ctx.service.user.verify(Authorization.replace('Basic ', ''));
      } catch (error) {
        ctx.throw(401, '验证失败/过期，请重新登录');
      }
      const payload = ctx.service.user.decode(
        Authorization.replace('Basic ', '')
      );
      memberId = payload.id;
    }

    if (!memberId && need_login) {
      ctx.throw(401, '请先登录');
    }

    if (memberId) {
      ctx.member = await ctx.app.model.Member.findOne({
        where: { id: memberId },
      });
    }

    await next();
  };
};
