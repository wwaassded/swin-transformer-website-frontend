<template>
  <div class="navbar">
    <div class="left">
      <img src="../assets/login.svg" alt="Logo">
      <a href="#">SwinTransformer</a>
      <router-link :to="{name: 'detail'}">最近一次结果</router-link>
      <router-link :to="{name: 'detail'}">历史结果</router-link>
    </div>
    <div class="right">
      <div class="user-info">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text">
              {{ fullUserName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :value="index"
                @click="handleLogout(item.title)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>

  <div class="main">
    <div class="upload-container">
      <h1>分割肺部医疗影像</h1>
      <p>简单、快速、高效的在线分割工具</p>
      <div
          class="file-input-wrapper"
          @dragover.prevent
          @drop.prevent="handleDrop"
      >
        <v-file-input
            v-model="selectedFile"
            label="选择文件或拖拽文件到这里"
            @change="handleFileChange(selectedFile)"
            class="file-input"
        ></v-file-input>
        <v-btn @click="handleButtonClick" style="background-color: #4ba42e; color: #fff" class="upload-button">
          开始分割
        </v-btn>
        <v-overlay
            :model-value="overlay"
            class="align-center justify-center"
            persistent
        >
          <div class="overlay-content">
            <v-progress-circular
                color="primary"
                size="64"
                indeterminate
            ></v-progress-circular>
            <p>处理中，请稍候...</p>
          </div>
        </v-overlay>
      </div>
    </div>

    <div class="description">
      <div class="description-item">
        <img src="../assets/inspiring.svg" alt="Icon">
        <h3>使用简单</h3>
        <p>将肺部影像拉到推拽区或点击按钮，将图片上传至我们的平台，完成后即可供您下载</p>
      </div>
      <div class="description-item">
        <img src="../assets/thumbs-up.svg" alt="Icon">
        <h3>高效</h3>
        <p>我们的工具提供快速而高效的肺炎图像分割</p>
      </div>
      <div class="description-item">
        <img src="../assets/files.svg" alt="Icon">
        <h3>下载</h3>
        <p>我们的网站支持历史记录的保存您可以随时下载图像分割的结果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import useUtilStore from "../store/util.ts" //使用 pinia 实现全局的数据共享
import {ref, computed, onMounted, onUnmounted} from "vue"
import {useRouter} from "vue-router";
import axios from "axios";

const overlay = ref(false)
const utilStore = useUtilStore()
const router = useRouter()

onMounted(() => {
  document.body.classList.add('home_body')
})

onUnmounted(() => {
  document.body.classList.remove('home_body')
})

const fullUserName = computed(() => {
  return utilStore.username + '#' + utilStore.id
})

const items = [
  {title: "注销登录"}
]

const selectedFile = ref<File | null>(null)

utilStore.$subscribe((_mutate, state) => {
  if(state.original_image_id >= 0) {
    localStorage.setItem('original_image_id',`${state.original_image_id}`)
    localStorage.setItem('original_image_url',state.original_image_url)
    localStorage.setItem('segmented_image_url',state.segmented_image_url)
  }
})

const fileHandle = async (file: File) => {
  if (!file.type.startsWith('image')) {
    selectedFile.value = null
    alert('你必须上传一张图片')
  } else {
    const fileData = new FormData()
    fileData.append('picture', file)
    fileData.append('user_id', `${utilStore.id}`)
    try {
      const response = await axios.post('/upload/', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      let response_data = response.data
      if (response_data.isSuccessful) {
        let {source_image_id, source_image_url, segmented_image_url, message} = response_data
        overlay.value = false // 处理流程已经结束
        utilStore.original_image_id = source_image_id
        utilStore.segmented_image_url = segmented_image_url
        utilStore.original_image_url = source_image_url
        console.log(message)
        await router.push({
          name: 'detail'
        })
      } else {
        let {message} = response_data
        console.log(message)
        overlay.value = false // 处理流程已经结束
        alert('处理失败')
      }
    } catch (e) {
      overlay.value = false // 处理流程已经结束
      alert('上传失败')
      console.error('upload fail: ', e)
    }
  }
}

function handleFileChange(file: File | null) {
  if (file == null) {
    alert('file can not be null')
  }
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files.length) {
    selectedFile.value = files[0]
  }
}

const handleLogout = async (title: string) => {
  if (title !== "注销登录") return
  else {
    try {
      const response = await axios.post('/logout/')
      if (response.status === 200) {
        utilStore.logout()
        await router.push({
          name: 'login'
        })
      } else {
        alert('登出失败')
        console.error('logout error: 注销时遇到了错误')
      }
    } catch (error) {
      alert('服务器暂时无响应')
      console.error('logout error: ', error)
    }
  }
}

const handleButtonClick = async () => {
  if (selectedFile.value != null) {
    overlay.value = true
    await fileHandle(selectedFile.value)
  } else {
    alert('您还没有上传图片')
  }
}

</script>

<style>
.home_body {
  font-family: "JetBrains Mono ExtraBold", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  color: #333;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border: 0 solid black;
  border-bottom-width: 1px;
}

.navbar .left {
  display: flex;
  align-items: center;
}

.navbar .left img {
  height: 40px;
  margin-right: 10px;
}

.navbar .left a {
  margin-right: 20px;
  color: #000000;
  text-decoration: none;
}

.navbar .left a:hover {
  text-decoration: underline;
  color: #038cd6;
}

.navbar .right {
  display: flex;
  align-items: center;
}

.navbar .right .user-info {
  margin-right: 20px;
}

.main {
  padding: 100px 20px;
  text-align: center;
}

.upload-container {
  display: inline-block;
  padding: 60px;
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 600px; /* 增加宽度 */
  max-width: 550px; /* 增加最大宽度 */
  margin: 0 auto 40px;
}

.upload-container h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.upload-container p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #555;
}

.file-input-wrapper {
  border: 2px dashed #ccc;
  padding: 20px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: border-color 0.3s;
}

.file-input-wrapper:hover {
  border-color: #038cd6;
}

.file-input {
  width: 95%;
  margin-bottom: 10px;
  margin-right: 40px;
}

.upload-button {
  width: 60%;
}

.description {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  color: #555;
}

.description-item {
  flex: 1 1 200px;
  margin: 15px;
  text-align: center;
}

.description-item img {
  height: 40px;
  margin-bottom: 10px;
}

.description-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.description-item p {
  font-size: 16px;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.overlay-content p {
  font-family: "JetBrains Mono ExtraBold", sans-serif;
  font-size: 20px;
}
</style>