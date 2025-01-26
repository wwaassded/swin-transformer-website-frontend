<template>
  <div class="container">
    <div class="left-panel"></div>
    <div class="right-panel">
      <div class="form-container">
        <h1>Sign up for SwinTransformer</h1>
        <v-form @submit.prevent="handleLogup">
          <div class="form-group">
            <v-text-field
                label="User Name"
                hint="请输入用户名"
                v-model='userName'
                :rules="nameRules"
            ></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field
                label="Password"
                type="password"
                hint="请输入用户密码"
                v-model="password"
                :rules="passwordRules"
            ></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field
                label="Email"
                type="email"
                hint="请输入您想要使用的邮箱"
                v-model="email"
                :rules="emailRules"
            ></v-text-field>
          </div>
          <div class="form-group">
            <v-btn type="submit" size="large" block>注册</v-btn>
          </div>
          <div v-if="feedbackMessage" class="form-group" id="feedback">
            <p>{{ feedbackMessage }}</p>
          </div>
          <div class="form-group">
            <router-link :to="{name: 'login'}" replace> 已经有一个账户了吗? 点击这里就可以登录了.</router-link>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Logup">
import {onMounted, onUnmounted, ref} from 'vue';
import {md5} from "../utils";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

onMounted(() => {
  document.body.classList.add('logup_body');
});

onUnmounted(() => {
  document.body.classList.remove('logup_body');
});

let userName = ref('')
let password = ref('')
let email = ref('')
let feedbackMessage = ref('')

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
]

let emailRules = [
  (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(String(email).toLowerCase())) return '邮箱地址格式不规范'
    return true
  }
]

const handleLogup = async () => {
  try {
    const response = await axios.post('/logup/', {
      username: userName.value,
      password: md5(password.value)
    })
    if (response.status === 200) {
      if (response.data.isSuccessful) {
        feedbackMessage.value = '注册成功 马上跳转到首页...'
        setTimeout(() => {
          router.replace({name: 'login'})
        }, 2000)
      } else {
        // you can not reach here
        feedbackMessage.value = '注册失败'
        alert('注册没有成功')
      }
    } else {
      feedbackMessage.value = '注册失败'
      alert('注册失败了')
    }
  } catch (e) {
    feedbackMessage.value = '注册失败'
    console.error('Logup error: ', e)
  }
}
</script>

<style scoped>
.logup_body {
  font-family: "JetBrains Mono ExtraBold", sans-serif;
  background-color: #ffffff;
  margin: 0;
  display: flex;
  height: 100vh;
}

.container {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-panel {
  flex: 1;
  background: url('../assets/protruding-squares.png') no-repeat center center;
  background-size: cover;
  height: 1000px;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.form-container {
  width: 80%; /* 改小宽度 */
  max-width: 400px; /* 设置最大宽度 */
}

.form-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.form-group button:hover {
  background-color: #218838;
}

.form-group a {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #0366d6;
  text-decoration: none;
}

.form-group a:hover {
  text-decoration: underline;
}

.form-group p {
  text-align: center;
  color: green;
  font-weight: bold;
}

</style>