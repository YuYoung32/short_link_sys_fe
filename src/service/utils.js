/**
 * Created by YuYoung on 2023/3/25
 * Description: 所有组件工具代码
 */

/**
 * 将Date对象转换为字符串 YYYYMMDD 格式 例如20230325
 * @param date
 * @returns {string}
 */
function dateObjToString(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * 原地移动数组 从数组头部删除一个元素 从数组尾部添加一个元素
 * @param arr 数组
 * @param val 要添加的元素
 */
function pushAndPop(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (i === arr.length - 1) {
            arr[i] = val;
        } else {
            arr[i] = arr[i + 1];
        }
    }
}

/**
 * 获取今天是几号
 * @returns {number}
 */
function getTodayDayValue() {
    return new Date().getDate();
}

/**
 * 获取数组中某个元素的索引
 * @param ele 要查找的元素
 * @param arr 数组
 * @param key 数组中元素的key
 * @returns {number}
 */
function getArrIndexByEle(ele, arr, key) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[key] === ele) {
            return i;
        }
    }
    return -1; // 如果未找到该元素，则返回 -1
}

/**
 * 将unix时间戳转换为字符串
 * @param unixTime unix时间戳
 * @returns {string}
 */
function unixTimeToString(unixTime) {
    const date = new Date(unixTime * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export { dateObjToString, pushAndPop, getTodayDayValue, getArrIndexByEle, unixTimeToString };
