import { createRouter, createWebHistory,type RouteRecordRaw } from "vue-router";
import type { Component } from "vue";

// 类型定义
interface RouteMeta {
  folder: string | null;
  isFolderIndex: boolean;
  isNotFound?: boolean;
  [key: string]: unknown;
}

interface RouteInfo {
  filePath: string;
  parts: string[];
  folderName: string | null;
  isFolderIndexFile: boolean;
  routePath: string;
  routeName: string;
}

// 动态加载 views 目录下的所有 .vue 文件
const rawModules = {
  ...import.meta.glob("../views/*.vue", { eager: false }),
  ...import.meta.glob("../views/**/*.vue", { eager: false }),
};

// 调试：打印 rawModules 的键
console.log("rawModules keys:", Object.keys(rawModules));

// 提取 import.meta.glob 的返回类型
type ModuleMap = typeof rawModules;

// 配置项
const ROUTER_CONFIG = {
  forceLowerCase: true,
  defaultRedirect: "/home" as const,
};

// 规范化组件加载函数，确保返回 () => Promise<{ default: Component }>
async function normalizeComponent(
  loader: ModuleMap[string]
): Promise<{ default: Component }> {
  try {
    const result = await loader();
    if (typeof result === "function") {
      return await result();
    }
    return result as { default: Component };
  } catch (error) {
    console.error(`Failed to load component: ${loader}`, error);
    throw error;
  }
}

// 解析文件路径为路由信息
function parseRouteInfo(path: string): RouteInfo {
  const filePath = path.replace("../views/", "").replace(".vue", "");
  const parts = filePath.split("/");
  const folderName = parts.length > 1 ? parts[0] : null;
  const isFolderIndexFile =
    folderName && parts.length > 1
      ? parts[parts.length - 1].toLowerCase() ===
        `${folderName.toLowerCase()}index`
      : false;
  const normalizedParts = parts.map((part) => part);

  let routePath = `/${normalizedParts.join("/")}`;
  let routeName = normalizedParts.join("-");

  if (ROUTER_CONFIG.forceLowerCase) {
    routePath = routePath.toLowerCase();
    routeName = routeName.toLowerCase();
  }

  if (isFolderIndexFile) {
    routePath = routePath.replace(/\/[^\/]+index$/i, "");
  }

  return {
    filePath: path,
    parts,
    folderName,
    isFolderIndexFile,
    routePath,
    routeName,
  };
}

// 生成父路由
function createParentRoute(
  parentPath: string,
  folderName: string,
  modules: ModuleMap
): RouteRecordRaw {
  const normalizedFolderName = ROUTER_CONFIG.forceLowerCase
    ? folderName.toLowerCase()
    : folderName;
  const folderIndexKey = `../views/${folderName}/${folderName}Index.vue`;
  const folderIndexComponent = modules[folderIndexKey];
  if (!folderIndexComponent && import.meta.env.DEV) {
    console.warn(
      `Missing ${folderName}Index.vue for parent route ${parentPath}. Falling back to NotFound.vue.`
    );
  }
  return {
    path: parentPath,
    name: normalizedFolderName,
    component: folderIndexComponent
      ? () => normalizeComponent(folderIndexComponent)
      : () => import("../views/NotFound.vue"),
    children: [],
    meta: {
      folder: folderName,
      isFolderIndex: true,
      isNotFound: !folderIndexComponent,
    },
  };
}

// 生成子路由
function createChildRoute(
  routeInfo: RouteInfo,
  modules: ModuleMap
): RouteRecordRaw {
  let childPath = routeInfo.isFolderIndexFile
    ? ""
    : routeInfo.parts.slice(1).join("/").toLowerCase();
  // 确保子路由 path 不以斜杠开头，且不以斜杠结尾
  childPath = childPath.replace(/^\/+|\/+$/g, "");
  console.log(
    `Creating child route for ${routeInfo.filePath}: path=${childPath}`
  );
  return {
    path: childPath,
    name: routeInfo.routeName,
    component: () => normalizeComponent(modules[routeInfo.filePath]),
    meta: {
      folder: routeInfo.folderName,
      isFolderIndex: routeInfo.isFolderIndexFile,
      isNotFound: false,
    },
  };
}

// 查找默认重定向路径
function findDefaultRedirect(routes: RouteRecordRaw[]): string {
  const validParentRoute = routes.find((route) => !route.meta?.isNotFound);
  return validParentRoute?.path || "/not-found";
}

// 生成路由的函数
function generateRoutes(): RouteRecordRaw[] {
  const routeMap = new Map<string, RouteRecordRaw>();

  // 遍历所有模块文件
  for (const path in rawModules) {
    const routeInfo = parseRouteInfo(path);

    // 处理嵌套路由（子路由）
    if (routeInfo.parts.length > 1) {
      const parentPath = `/${
        ROUTER_CONFIG.forceLowerCase
          ? routeInfo.folderName!.toLowerCase()
          : routeInfo.folderName
      }`;
      if (!routeMap.has(parentPath)) {
        routeMap.set(
          parentPath,
          createParentRoute(parentPath, routeInfo.folderName!, rawModules)
        );
      }
      // 仅为非索引文件生成子路由
      if (!routeInfo.isFolderIndexFile) {
        const childRoute = createChildRoute(routeInfo, rawModules);
        routeMap.get(parentPath)!.children!.push(childRoute);
      }
    } else {
      // 处理顶级路由（例如 HomeView.vue）
      const route: RouteRecordRaw = {
        path: routeInfo.routePath,
        name: routeInfo.routeName,
        component: () => normalizeComponent(rawModules[path]),
        meta: {
          folder: null,
          isFolderIndex: false,
          isNotFound: false,
        },
      };
      routeMap.set(routeInfo.routePath, route);
    }
  }

  // 添加默认首页和 404 路由
  const routes = Array.from(routeMap.values());
  routes.unshift({
    path: "/",
    redirect: findDefaultRedirect(routes),
  });
  routes.push({
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
    meta: { folder: null, isFolderIndex: false, isNotFound: true },
  });

  // 调试：打印生成的路由
  console.log("Generated routes:", routes);

  return routes;
}

// 创建并导出路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes(),
});

// 调试：监听路由导航
router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.fullPath}`);
  console.log("Matched routes:", to.matched);
  // 打印子路由匹配详情
  to.matched.forEach((route, index) => {
    console.log(`Route ${index}:`, {
      path: route.path,
      name: route.name,
      children: route.children?.map((child) => ({
        path: child.path,
        name: child.name,
      })),
    });
  });
  next();
});

export default router;
