# `@ctrlc/uni-module-pages`

> `@ctrlc/uni-module-pages`是基于`uniapp`项目处理`pages.json`模块化的路由插件，可用于将`pages.json`文件中`pages`属性和`subPackages`属性拆分出不同的文件管理。（支持对`uni_modules`插件的路由页面管理）

## 使用手册

### 安装

```bash
npm i @ctrlc/uni-module-pages -D
```

### 引用方式

**在`pages.json`文件的同级目录下新建`pages.js`文件**(必须),内容如下：

> (tips: `pages.js`是`uni-app`的钩子文件)

```js
const UniModuleRouter = require("@ctrlc/uni-module-pages");
const uniRouter = new UniModuleRouter({
  // 项目定义的路由目录
  dir: "./router",
  // uni_modules插件路由文件,
  uniModules: [
    {
      // id:插件名称,
      id: "uni-demo",
      // path:相对插件根路径的定义的路由文件路径
      path: "router.json",
    },
  ],
});

module.exports = (pagesJson, loader) => {
  return uniRouter.loader(pagesJson, loader);
};
```

`UniModuleRouter`**配置说明**

| 配置项       | 说明                               | 备注                                                                   |
| ------------ | ---------------------------------- | ---------------------------------------------------------------------- |
| `dir`        | 项目定义的路由目录                 | 可选，路由插件会读取路由目录下所有的路由文件（`.json`格式）信息。      |
| `uniModules` | `uni_modules` 插件路由文件描述单元 | 可选，路由插件会读取相应 uni_modules 插件的路由文件（`.json`格式）信息 |

## 文档

> [示例文档](https://gitee.com/ctrl-v/uni-module-pages/blob/master/docs/README.md)  
> [gitee](https://gitee.com/ctrl-v/uni-module-pages)
