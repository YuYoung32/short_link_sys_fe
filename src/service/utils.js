/**
 * Created by YuYoung on 2023/3/25
 * Description: 所有组件工具代码
 */

/**
 * 将Date对象转换为当日开始的Unix秒级时间戳
 * @param date {Date}
 * @returns {String}
 */
function dateObjToDayBeginUnixTime(date) {
    // 获取当天0点的日期对象
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return String(Math.floor(startOfDay.getTime() / 1000));
}

/**
 * 将Date对象转换为当日结束的Unix秒级时间戳
 * @param date {Date}
 * @returns {String}
 */
function dateObjToDayEndUnixTime(date) {
    // 获取当天0点的日期对象
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return String(Math.floor(endOfDay.getTime() / 1000));
}

/**
 * 将Unix秒级时间戳转换为字符串 ${year}-${month}-${day} ${hours}:${minutes}
 * @param unixTime unix时间戳
 * @returns {String}
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

/**
 * 将字符串(YYYYMMDD)转换为Date对象
 * @param {String} dateString
 * @returns {Date}
 */
function stringToDateObj(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6) - 1; // 月份需要减1，因为 Date 对象中的月份从0开始
    const day = dateString.substring(6, 8);
    return new Date(year, month, day);
}

/**
 * 将Date对象转换为字符串(YYYYMMDD)
 * @param {Date} date
 * @returns {string}
 */
function dateObjToString(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
}

/**
 * 将两个Date对象转换为之间的字符串(MMDD) 若为同一天则返回当天1h-24h
 * 例如: 0301, 0303 -> [0301, 0302, 0303]
 * @param {Date} begin
 * @param {Date} end
 * @returns {Array}
 */
function dateBetweenToList(begin, end) {
    if (dateObjToString(begin) === dateObjToString(end)) {
        return [
            '1h',
            '2h',
            '3h',
            '4h',
            '5h',
            '6h',
            '7h',
            '8h',
            '9h',
            '10h',
            '11h',
            '12h',
            '13h',
            '14h',
            '15h',
            '16h',
            '17h',
            '18h',
            '19h',
            '20h',
            '21h',
            '22h',
            '23h',
            '24h'
        ];
    }
    const list = [];
    while (begin.getTime() <= end.getTime()) {
        list.push(dateObjToString(begin).substring(4, 8));
        begin.setDate(begin.getDate() + 1);
    }
    return list;
}

/**
 * 原地移动数组 从数组头部删除一个元素 从数组尾部添加一个元素
 * @param {Array} arr  数组
 * @param {Any}  val  要添加的元素
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
 * @returns {Number}
 */
function getTodayDayValue() {
    return new Date().getDate();
}

/**
 * 获取数组中某个元素的索引
 * @param ele 要查找的元素
 * @param arr 数组
 * @param key 数组中元素的key
 * @returns {Number}
 */
function getArrIndexByEle(ele, arr, key) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[key] === ele) {
            return i;
        }
    }
    return -1; // 如果未找到该元素，则返回 -1
}

export {
    dateObjToDayBeginUnixTime,
    dateObjToDayEndUnixTime,
    unixTimeToString,
    stringToDateObj,
    dateObjToString,
    dateBetweenToList,
    pushAndPop,
    getTodayDayValue,
    getArrIndexByEle
};
