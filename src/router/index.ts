import { createRouter, createWebHistory } from "vue-router";

// 动态加载 views 目录下的所有 .vue 文件
const modules = import.meta.glob("../views/**/*.vue", { eager: false });

// 生成路由的函数（支持嵌套路由）
function generateRoutes() {
  const routeMap = new Map();

  // 遍历所有模块文件
  for (const path in modules) {
    // 提取文件路径并规范化
    const filePath = path.replace("../views/", "").replace(".vue", "");
    const parts = filePath.split("/"); // 分割目录和文件名

    // 生成路由路径和名称
    let routePath = `/${parts.map((part) => part.toLowerCase()).join("/")}`;
    const routeName = parts.map((part) => part.toLowerCase()).join("-");

    // 如果是 Index.vue，去掉路径中的 /index
    if (routePath.endsWith("/index")) {
      routePath = routePath.replace("/index", "");
    }

    const route = {
      path: routePath,
      name: routeName,
      component: modules[path],
    };

    // 处理嵌套路由
    if (parts.length > 1) {
      // 父路由路径（根目录）
      const parentPath = `/${parts[0].toLowerCase()}`;
      if (!routeMap.has(parentPath)) {
        routeMap.set(parentPath, {
          path: parentPath,
          name: parts[0].toLowerCase(),
          component:
            modules[`../views/${parts[0]}/Index.vue`] ||
            (() => import("../views/NotFound.vue")),
          children: [],
        });
      }
      // 添加子路由（去掉父路径部分）
      const childPath = parts.slice(1).join("/").replace("Index", "");
      routeMap.get(parentPath).children.push({
        path: childPath || "", // 如果是 Index.vue，子路径为空
        name: routeName,
        component: modules[path],
      });
    } else {
      // 没有子目录的顶级路由
      routeMap.set(routePath, route);
    }
  }

  // 添加默认首页和 404 路由
  const routes = Array.from(routeMap.values());
  routes.unshift({
    path: "/",
    redirect: "/homeview", // 默认重定向到 /home
  });
  routes.push({
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  });

  return routes;
}

// 创建并导出路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes(),
});

export default router;
