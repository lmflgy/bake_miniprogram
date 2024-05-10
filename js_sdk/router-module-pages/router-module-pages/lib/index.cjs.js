'use strict';

var fs = require('fs');
var path = require('path');
var uniCliShared = require('@dcloudio/uni-cli-shared');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

function normalizeUniModulesPagesJson(pagesJson, pluginId) {
    if (Array.isArray(pagesJson.pages)) {
        pagesJson.pages.forEach((page) => {
            page.path = "uni_modules/" + pluginId + "/" + page.path;
        });
    }
    if (Array.isArray(pagesJson.subPackages)) {
        pagesJson.subPackages.forEach((subPackage) => {
            subPackage.root = "uni_modules/" + pluginId + "/" + subPackage.root;
        });
    }
    return pagesJson;
}
class UniModulePages {
    constructor(option) {
        let { dir, uniModules } = option;
        if (dir) {
            dir = path__namespace.resolve(process.env.UNI_INPUT_DIR, dir);
        }
        if (uniModules) {
            uniModules = uniModules.map((module) => {
                return Object.assign(Object.assign({}, module), { path: path__namespace.resolve(process.env.UNI_INPUT_DIR, `uni_modules/${module.id}/${module.path}`) });
            });
        }
        this.routerDir = dir;
        this.routerFiles = uniModules;
    }
    getPageJson(addDependency) {
        // router路由注入
        const routerDir = this.routerDir;
        const routerPagesJson = {
            pages: [],
            subPackages: [],
        };
        if (routerDir && fs__namespace.existsSync(routerDir)) {
            let files = fs__namespace.readdirSync(routerDir);
            files = files.filter((f) => {
                return f.endsWith(".json");
            });
            for (const file of files) {
                const routerPath = path__namespace.resolve(routerDir, file);
                const routerJson = uniCliShared.parseJson(fs__namespace.readFileSync(routerPath).toString(), true);
                addDependency(routerPath);
                routerPagesJson.pages.push(...(routerJson.pages || []));
                routerPagesJson.subPackages.push(...(routerJson.subPackages || []));
            }
        }
        // uni_modules路由注入
        const routerFiles = this.routerFiles;
        const uniModulesPagesJson = {
            pages: [],
            subPackages: [],
        };
        routerFiles === null || routerFiles === void 0 ? void 0 : routerFiles.forEach((routerFile) => {
            if (fs__namespace.existsSync(routerFile.path)) {
                const pagesJson = normalizeUniModulesPagesJson(uniCliShared.parseJson(fs__namespace.readFileSync(routerFile.path).toString(), true), routerFile.id);
                addDependency(routerFile.path);
                uniModulesPagesJson.pages.push(...(pagesJson.pages || []));
                uniModulesPagesJson.subPackages.push(...(pagesJson.subPackages || []));
            }
        });
        return {
            pages: [...routerPagesJson.pages, ...uniModulesPagesJson.pages],
            subPackages: [
                ...routerPagesJson.subPackages,
                ...uniModulesPagesJson.subPackages,
            ],
        };
    }
    loader(pagesJson, { addDependency }) {
        const { pages = [], subPackages = [] } = this.getPageJson(addDependency);
        pagesJson.pages = pagesJson.pages || [];
        pagesJson.subPackages = pagesJson.subPackages || [];
        pagesJson.pages.push(...pages);
        pagesJson.subPackages.push(...subPackages);
        return pagesJson;
    }
}

module.exports = UniModulePages;
