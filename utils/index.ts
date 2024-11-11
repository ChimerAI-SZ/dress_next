/**
 * storage 存储
 */
export const storage = {
    // 设置值为字符串
    set(name: string, value: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(name, value);
        }
    },
    // 设置值为对象
    setObj<T>(name: string, value: T): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
        }
    },
    // 获取字符串值
    get(name: string): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(name);
        }
        return null;
    },
    // 获取对象值
    getObj<T>(name: string): T | null {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(name);
            if (item) {
                try {
                    return JSON.parse(item) as T;
                } catch (error) {
                    console.error("Failed to parse item from localStorage:", error);
                    return null;
                }
            }
        }
        return null;
    },
    // 删除项
    remove(name: string): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
        }
    },
    // 清除所有项
    clear(): void {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    },
};




/**
 * 退出登录
 */
export const exitLogin = () => {
    localStorage.clear();
    window.location.href = '/login?type=err';
};


/**
 * async 方法错误捕获
 * @param {type: Function, desc: 异步方法（必填） } asyncFunc
 * @param  {type: } data
 * @param  {type: bool, desc: 是否是自定义信息 } flag
 */
export const errorCaptureRes = async (asyncFunc: (arg0: any) => any, data?: any, flag = true) => {
    try {
        const res = await asyncFunc(data);
        if (res.code !== 200) {
            // window.$message.error(res.message || '未获取到信息');
            return [{ message: res.message || '未获取到信息', code: res.code }, res];
        }
        return [null, res];
    } catch (e) {
        // 快速连续点击，接口取消，不要报错
        // if (flag && e.code !== 'ERR_CANCELED') {
        //     window.$message.error(e.message);
        // }
        return [e, null];
    }
};