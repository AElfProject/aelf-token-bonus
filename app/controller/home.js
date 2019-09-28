/**
 * @author hzz780
 * @file home.js
 */

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html', {
    });
  }
}

module.exports = HomeController;
