class Router {
  constructor() {
    this.stack = [];
  }

  // 注册路由
  register(path, method, middleware) {
    const route = { path, method, middleware };
    this.stack.push(route);
  }
  get(path, middleware) {
    this.register(path, "get", middleware);
  }
  post(path, middleware) {
    this.register(path, "post", middleware);
  }

  // 中间件
  routers() {
    const stack = this.stack;
    return async (ctx, next) => {
      const currPath = ctx.url;
      let router;
      for (let i = 0; i < stack.length; i++) {
        const item = stack[i];
        if (item.path === currPath && ctx.method === item.method) {
          router = item.middleware;
          break;
        }
      }
      if (typeof router === "function") {
        router(ctx, next);
        return;
      }
      await next();
    };
  }
}

module.exports = Router;
