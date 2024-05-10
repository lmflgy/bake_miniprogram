export interface UniModulePagesOption {
    dir?: string;
    uniModules?: {
        id: string;
        path: string;
    }[];
}
export default class UniModulePages {
    routerDir: string | undefined;
    routerFiles: {
        id: string;
        path: string;
    }[] | undefined;
    constructor(option: UniModulePagesOption);
    getPageJson(addDependency: (arg0: string) => void): {
        pages: any[];
        subPackages: any[];
    };
    loader(pagesJson: {
        pages: any[];
        subPackages: any[];
    }, { addDependency }: any): {
        pages: any[];
        subPackages: any[];
    };
}
