# mkoa

学习 koa2 源码，简单实现

koa2 源码：
https://github.com/koajs/koa

## 使用

```
npm i

npx nodemon index.js

// 打开 localhost:3000
```

## koa2 简单分析

koa2 完全使⽤用 Promise 并配合 async 来实现异步，并基于 nodejs 的入⻔级 http 服务

就是基于 http 启动了一个服务，然后围绕这个服务的请求响应形成上下文，实现中间件机制

特点：

- 轻量量，⽆无捆绑
- 中间件架构
- 优雅的 API 设计
- 增强的错误处理理

源码分析上可以查看这一篇文章[Koa2 源码解读](https://zhuanlan.zhihu.com/p/34797505)

Koa 致力于核心中间件功能

Koa 中间件机制：Koa 中间件机制就是函数式组合概念 Compose 的概念，将⼀一组需要顺序执⾏行行的函数复合为⼀一个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制，是源码中的精髓和难点。

使用方式就是`app.use`增加中间件，而使用了洋葱圈模型`koa-compose`

每个注册的中间件都会接受到上下文`ctx`与`next`，next 的执行是为了进入下一个中间件

compose 简单实现

```js
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
```

next 执行会使中间件下标的移动，以达到调用每个注册的中间件

常⻅见的中间件操作：

```js
const Router = require("koa-router");
const router = new Router();

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

app.use(router.routers());
```

## 中间件实现

context koa 为了了能够简化 API，引⼊入上下⽂文 context 概念，将原始请求对象 req 和响应对象 res 封装并挂载到 context 上，并且在 context 上设置 getter 和 setter，从⽽而简化操作。

封装 request、response 和 contex。

koa 中间件的规范：

- 一个 async 函数
- 接收 ctx 和 next 两个参数
- 任务结束需要执⾏ next

```js
const mid = async (ctx, next) => {
  // 来到中间件，洋葱圈左边
  // TODO coding...
  await next(); // 进⼊入其他中间件
  // 再次来到中间件，洋葱圈右边
  // TODO coding...
};
```

以下为常见中间件例子：

### 静态资源中间件

静态资源中间件的实现很简单，就是规定好静态资源文件夹，然后访问到匹配的目录，就使用 fs 访问里面的资源

[简单实现如例子](./lib/static.js)

### 路由中间件

[koa-router 入门](https://www.cnblogs.com/cckui/p/10401563.html)

路由中间件只要是路由的收集，就是一般我们使用的 get\post 方法时收集它的名称\路径\请求方法\回调

然后在`app.use(router.routers())`的 routers 里拿到上下文后匹配中对应的路由，把信息传递给回调，如上下文\next

[源码实现](./lib/router.js)
