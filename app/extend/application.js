"use strict";
const weappsdk = require("mp-sdk-rojer");

const WEAPPTOKEN = Symbol("Application#weapptoken");
const WEAPPSDK = Symbol("Application#weappsdk");

module.exports = {
  get_weapp_token(key) {
    if (!this[WEAPPTOKEN]) return {};
    return this[WEAPPTOKEN][key] || {};
  },

  set_weapp_token(key, value) {
    if (!this[WEAPPTOKEN]) this[WEAPPTOKEN] = {};
    this[WEAPPTOKEN][key] = value;
  },

  weapp(key = "default") {
    if (!this[WEAPPSDK]) this[WEAPPSDK] = {};

    if (!this[WEAPPSDK][key]) {
      let appId, appSecret;
      if (this.config.weapp[key]) {
        appId = this.config.weapp[key].appId;
        appSecret = this.config.weapp[key].appSecret;
      }

      if (!appId || !appSecret) {
        appId = this.config.weapp.appId;
        appSecret = this.config.weapp.appSecret;
      }

      if (!appId || !appSecret) {
        throw new Error("appId，appSecret 不存在");
      }

      this[WEAPPSDK][key] = this.create_weapp(key, appId, appSecret);
    }

    return this[WEAPPSDK][key];
  },

  create_weapp(key, appid, appSecret) {
    return weappsdk(
      appid,
      appSecret,
      () => this.get_weapp_token(key),
      value => {
        this.set_weapp_token(key, value);
      }
    );
  }
};
