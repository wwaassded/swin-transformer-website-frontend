import {defineStore} from "pinia";
import {parseCookies} from "../utils";
import type {identificationObject} from "../type";

//为什么误写成组合式的pinia代码
const useUtilStore = defineStore('util', {
    actions: {
        getFromCookieIdentification() {
            const cookieObject = parseCookies(document.cookie);
            const identificationJsonStyle = cookieObject.get('identification')?.replace(/\\054/g, ',');
            let str = typeof identificationJsonStyle === 'string' ? identificationJsonStyle : ' '
            const tmp_info: string = JSON.parse(str);
            const user_info: identificationObject = JSON.parse(tmp_info) //从cookie中解析的用户的信息 包括id 以及用户名称 可以存储在pinia中实现全局的共享
            this.id = user_info.id
            this.username = user_info.username
        },
        //注销 清空原有的用户信息
        logout() {
            this.id = -1
            this.username = ''
        }
    },
    state() {
        return {
            id: -1,
            username: '',
            original_image_url: '',
            segmented_image_url: '',
        }
    }
    ,
})

export default useUtilStore