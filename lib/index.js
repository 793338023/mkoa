const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class MKoa {
  constructor() {
    this.middlewares = [];
  }

  // 启动服务
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res);

      const fn = this.compose(this.middlewares);
      await fn(ctx);

      res.end(ctx.body);
    });

    server.listen(...args, () => {
      console.log(args, "开启了服务");
    });
  }

  // 创建上下文
  createContext(req, res) {
    // 上下文对象
    const ctx = Object.create(context);
    // 请求对象
    ctx.request = Object.create(request);
    // 响应对象
    ctx.response = Object.create(response);
    ctx.request.req = ctx.req = req;
    ctx.response.res = ctx.res = res;

    return ctx;
  }

  // 注册中间件
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // 根据 use 注册的形成洋葱模式
  compose(middlewares) {
    return function (ctx) {
      function dispatch(idx) {
        const fn = middlewares[idx];

        if (typeof fn !== "function") {
          return Promise.resolve();
        }

        return Promise.resolve(
          fn(ctx, () => {
            return dispatch(idx + 1);
          })
        );
      }

      return dispatch(0);
    };
  }
}

module.exports = MKoa;
