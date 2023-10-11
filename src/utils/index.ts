/** 下载文件 */
export const downLoadFile = (href = '', fileName = '') => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    a.click();
};
/** storage */
export const customStorage = {
    setItem(key: string, val: any) {
        window.localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    },
    getItem(key: string) {
        let val;
        try {
            val = JSON.parse(window.localStorage.getItem(key) as string);
        } catch (e) {
            val = window.localStorage.getItem(key);
        }
        return val;
    },
    remove(key: string | string[]) {
        if (typeof key === 'string') {
            window.localStorage.removeItem(key);
            return;
        }
        if (Object.prototype.toString.call(key) === '[object Array]') {
            key.forEach((item: string) => {
                window.localStorage.removeItem(item);
            });
        }

    }
};
/** 复制指定文本 */
export const copyToClipboard = (txt = '', cb = () => { }) => {
    const node: HTMLTextAreaElement = document.createElement('textarea');
    node.value = txt;
    document.body.appendChild(node);
    node.select();
    document.execCommand('Copy');
    document.body.removeChild(node);
    cb();
};

/** 转驼峰 */
export const toCamel = (str = '') => {
    const a = str.split('-');
    let result = a[0];
    for (let i = 1; i < a.length; i++) {
        result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
    }
    return result[0].toUpperCase() + result.substring(1);
};
/** 带空格转驼峰 */
export const toCamelWithSpace = (str = '') => {
    const arr = str.split('-');
    return arr.map(item => `${item.slice(0, 1).toUpperCase()}${item.slice(1)}`).join(' ');
};

/** 格式化数字 */
export const formatNum = (number = 0, unit = 'k') => {
    if (number >= 10000) {
        const a = `${(number / 1000)}`;
        const str = a.match(/\d+\.\d{2}/);
        return (str ? str[0] : a) + unit;
    } else {
        return number.toString();
    }
};