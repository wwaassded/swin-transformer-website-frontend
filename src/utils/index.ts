import {Md5} from "ts-md5";


function parseCookies(cookieString: string) {
    const cookies = new Map<string, string>()
    cookieString.split(';').forEach(cookie => {
        const [k, v] = cookie.split('=').map(c => c.trim())
        cookies.set(k, v)
    })
    return cookies
}

//对用户的密码进行md5加密
function md5(raw: string) {
    return Md5.hashStr(raw)
}

export {parseCookies, md5}


