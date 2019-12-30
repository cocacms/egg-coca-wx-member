'use strict';
const WXMEMBER = Symbol('Context#wx_member');

module.exports = {
  get wx_member() {
    if (!this[WXMEMBER]) {
      this.throw(401, '未登录');
    }
    return this[WXMEMBER];
  },

  set wx_member(value) {
    this[WXMEMBER] = value;
  },
};
