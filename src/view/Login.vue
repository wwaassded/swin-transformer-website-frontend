<template>
  <div class="login_card">
    <img src="../assets/login.svg" class="img" alt="my login svg">
    <h1>Sign in to swinTransformer</h1>

    <v-sheet class="mx-auto" width="300">
      <v-form fast-fail @submit.prevent="handleSubmit">

        <v-text-field
            label="User Name"
            hint="请输入用户名"
            v-model='userName'
            :rules="nameRules"
        ></v-text-field>

        <v-text-field
            label="Password"
            type="password"
            hint="请输入用户密码"
            v-model="password"
            :rules="passwordRules"
        ></v-text-field>

        <v-btn type="submit" size="large" block>登录</v-btn>
      </v-form>
    </v-sheet>

    <v-footer class="footer">
      <p>New to swinTransformer?
        <router-link :to="{name: 'logup'}" replace>Create an account</router-link>
        .
      </p>
    </v-footer>
  </div>
</template>

<script setup lang="ts" name="Login">
import {onMounted, onUnmounted, ref} from "vue"
import {useRouter} from "vue-router"
import axios from "axios"


import useUtilStore from "../store/util.ts"
import {md5} from "../utils";

onMounted(() => {
  document.body.classList.add('login_body')
})

onUnmounted(() => {
  document.body.classList.remove('login_body')
})

const utilStore = useUtilStore()

let userName = ref('')
let password = ref('')
let router = useRouter()


let nameRules = [
  (val: string) => {
    if (val?.length >= 4) return true
    return '用户名至少有4位'
  },
]

let passwordRules = [
  (val: string) => {
    // 测试使用密码跳过检查
    if (val === '2994899015') return true
    if (val.length <= 8) return '密码至少有8位'
    if (val.length > 64) return '密码不能超过64位'
    if (!/[A-Za-z]/.test(val)) return '密码至少包括一个字母'
    if (!/[0-9]/.test(val)) return '密码至少包括一个数字'
    if (!/[!^$.&*@:#,?%|"()<>{}]/.test(val)) return '密码至少包括一个特殊字符'
    return true
  },
];

const handleSubmit = async () => {
  try {
    const response = await axios.post('/login/', {
      username: userName.value,
      password: md5(password.value),
    })
    if (response.status === 200) {
      // 登陆成功
      //TODO 如果用户通过cookie直接跳过了登录过程 应该想办法对store进行初始化
      utilStore.getFromCookieIdentification()
      await router.replace({
        name: 'home',
      })
    }
  } catch (error) {
    alert('登陆失败了')
    console.error('Login error:', error)
  }
}

</script>

<style>
.login_body {
  margin: 0;
  padding: 0;
  font-family: "JetBrains Mono ExtraBold", sans-serif;
  background-color: #f6f8fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login_card {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  text-align: center; /* Center the content */
}

.img {
  width: 60px;
  margin-bottom: 20px;
}

.login_card h1 {
  margin-bottom: 24px;
  font-size: 24px;
  color: #333;
}

.login_card label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.login_card button {
  width: 100%;
  padding: 10px;
  background-color: #4ba42e;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
}

.login_card .footer {
  margin-top: 16px;
  text-align: center;
}

.login_card .footer a {
  color: #038cd6;
  text-decoration: none;
}

.login_card .footer a:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>