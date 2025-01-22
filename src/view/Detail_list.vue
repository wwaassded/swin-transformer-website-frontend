<template>
  <div class="navbar">
    <div class="left">
      <img src="../assets/login.svg" alt="Logo">
      <a href="#">SwinTransformer</a>
      <router-link :to="{name: 'detail'}">最近一次结果</router-link>
      <router-link :to="{name: 'detail_list'}">历史结果</router-link>
    </div>
    <div class="right">
      <div class="user-info">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="plain" :ripple="false">
              {{ fullUserName }}
            </v-btn>
          </template>
        </v-menu>
      </div>
    </div>
  </div>

  <div class="main">
    <v-container>
      <v-row
          v-for="n in original_images_list.length"
          :key="original_images_list[n-1]"
          class="mb-2"
      >
        <v-col cols="5">
          <v-card
              height="300"
              variant="flat"
              style="background-color: #f2f4f0;"
              text="分割前的图片"
          >
            <img
                :src="original_images_list[n-1]"
                alt="test"
                height="175"
            />
          </v-card>
        </v-col>

        <v-col cols="5">
          <v-card
              height="300"
              variant="flat"
              style="background-color: #f2f4f0;"
              text="分割后的图片"
          >
            <img
                :src="segmented_images_list[n-1]"
                alt="test"
                height="175"
            />
          </v-card>
        </v-col>
        <v-col cols="1">
          <v-btn
              :disabled="download_load_loading"
              :loading="download_load_loading"
              block size="x-large"
              style=" height: 100%"
              color="#EF5350"
              elevation="10"
              @click="handleDownloadImage(segmented_images_list[n-1])"
          >
            下载
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
              :disabled="delete_load_loading"
              :loading="delete_load_loading"
              block size="x-large"
              style=" height: 100%"
              color="#1976D2"
              elevation="10"
              @click="handleDeleteImage(original_id_list[n-1])"
          >
            删除
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-pagination
        :length="currentLen"
        v-model="currentPage"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        total-visible="6"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts" name="Detail_list">

import {lines_per_page} from "../utils";
import useUtilStore from "../store/util.ts";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import axios from "axios";

const utilStore = useUtilStore()
const currentPage = ref(0)
let currentLen = ref(0)
let original_id_list = ref([])
let original_images_list = ref([])
let segmented_images_list = ref([])
let download_load_loading = ref(false)
let delete_load_loading = ref(false)

const fullUserName = computed(() => {
  return utilStore.username + '#' + utilStore.id
})

// 监视page页数的变化
watch(currentPage, (page) => {
  handleGetImagesByPage(page)
})

onMounted(async () => {
  try {
    const response = await axios.post('/getPageNumber/')
    if (response.status === 200) {
      currentLen.value = response.data.page_number
    } else {
      alert('error in server')
    }
  } catch (e) {
    console.error(e)
    alert('error in server')
  }
  currentPage.value = utilStore.page_number
  await handleGetImagesByPage(currentPage.value)
  document.body.classList.add('detail_list_body')
})

onUnmounted(() => {
  utilStore.page_number = currentPage.value
  localStorage.setItem('page_number', `${utilStore.page_number}`)
  document.body.classList.remove('detail_list_body')
})

const handleGetImagesByPage = async (page: number) => {
  try {
    console.log('i started to handle get page', page)
    const response = await axios.get(`/getImage/${currentPage.value}/${lines_per_page}`)
    if (response.status === 200) {
      const response_data = response.data
      if (response_data.isSuccessful) {
        original_id_list.value = response_data.original_id_list
        original_images_list.value = response_data.original_images_list
        segmented_images_list.value = response_data.segmented_images_list
      } else {
        //TODO 没有获取到数据 应该给予用户一定的提示
        currentPage.value = currentLen.value
        alert('wrong in server')
      }
    } else {
      //TODO 没有获取到数据 应该给予用户一定的提示
      alert('error')
    }
  } catch (e) {
    console.error('can not reach server:... ', e)
  }
}

const handleDownloadImage = async (image_url: string) => {
  download_load_loading.value = true
  try {
    const image_name: string = image_url.split('/').pop() as string || ''
    const url = `http://localhost:8000/download/${image_name}/`
    console.log(url)
    const link = document.createElement('a')
    link.href = url
    link.download = image_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    console.error('下载图片出错: ', e)
    alert('下载过程中发生错误')
  } finally {
    download_load_loading.value = false
  }
}

//FIXME: 如果删除的是 最近结果展示的图片 应该将pinia中存储的数据进行清理 以避免页面之间展示的不一致性
const handleDeleteImage = async (original_image_id: number) => {
  delete_load_loading.value = true
  try {
    const response = await axios.post('/delete/', {
      original_image_id: original_image_id,
      image_page_number: currentPage.value,
    })
    if (response.status === 200) {
      if (utilStore.original_image_id === original_image_id) {
        utilStore.clearImages()
      }
      currentLen.value = response.data.page_number
      if (currentPage.value >= currentLen.value) {
        currentPage.value = currentLen.value
      }
      await handleGetImagesByPage(currentPage.value)
    } else {
      console.log(response.data.message)
    }
  } catch (e) {
    console.error('删除图片出错: ', e)
    alert('删除过程中发生错误')
  } finally {
    delete_load_loading.value = false
  }
}

</script>

<style>

.detail_list_body {
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

</style>