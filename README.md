# mkoa

学习 koa 源码，简单实现

## 使用

```
npm i

npx nodemon index.js

// 打开 localhost:3000
```

## koa 简单分析

源码分析上可以查看这一篇文章[Koa2 源码解读](https://zhuanlan.zhihu.com/p/34797505)

koa 的源码很精简，除了上下文 context，请求对象(request)与响应对象(response)，其他都需要自己定制化，koa 使用了最新 js 特性，async/await

Koa 致力于核心中间件功能

然后使用`app.use`增加中间件，而使用了洋葱模式`koa-compose`

每个注册的中间件都会接受到上下文`ctx`与`next`，next 的执行是为了进入下一个中间件

compose 实现

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

## 静态资源中间件

静态资源中间件的实现很简单，就是规定好静态资源文件夹，然后访问到匹配的目录，就使用 fs 访问里面的资源

[简单实现如例子](./lib/static.js)

## 路由中间件

[koa-router 入门](https://www.cnblogs.com/cckui/p/10401563.html)

路由中间件只要是路由的收集，就是一般我们使用的 get\post 方法时收集它的名称\路径\请求方法\回调

然后在`app.use(router.routers())`的 routers 里拿到上下文后匹配中对应的路由，把信息传递给回调，如上下文\next

[源码实现](./lib/router.js)
