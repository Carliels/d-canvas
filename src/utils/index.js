/**
* 计算对象hash值
*/
export function hashObj(obj) {
    if (!obj) {
        return 0;
    }
    const str = JSON.stringify(obj);
    // console.log(str)
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
 }