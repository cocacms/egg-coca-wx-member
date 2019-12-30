'use strict';
const weappsdk = require('mp-sdk-rojer');

const WEAPPTOKEN = Symbol('Application#weapptoken');
const WEAPPSDK = Symbol('Application#weappsdk');

module.exports = {
  get weapp_token() {
    return this[WEAPPTOKEN] || {};
  },

  set weapp_token(value) {
    this[WEAPPTOKEN] = value;
  },

  get weapp() {
    if (this[WEAPPSDK]) return this[WEAPPSDK];
    this[WEAPPSDK] = weappsdk(
      this.config.wxMember.appId,
      this.config.wxMember.appSecret,
      () => this.weapp_token,
      value => (this.weapp_token = value)
    );
    return this[WEAPPSDK];
  },
};
