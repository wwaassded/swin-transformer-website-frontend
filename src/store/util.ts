import {defineStore} from "pinia";
import {parseCookies} from "../utils";
import type {identificationObject} from "../type";

const useUtilStore = defineStore('util', {
    state() {
        return {
            id: -1,
            username: '',
            original_image_id: -1,
            original_image_url: '',
            segmented_image_url: '',
        }
    },
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
        },
        clearImages() {
            this.original_image_id = -1
            this.original_image_url = ''
            this.segmented_image_url = ''
        }
    },
    persist: { // 实现 session级别的pinia持久化 防止页面刷新时state中的变量恢复初始值
        enabled: true,
        strategies: [
            {
                key: 'utilStore',
                storage: sessionStorage
            }
        ]
    },
})

export default useUtilStore