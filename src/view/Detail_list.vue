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
              block size="x-large"
              style=" height: 100%"
              color="#EF5350"
              elevation="10"
          >
            下载
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
              block size="x-large"
              style=" height: 100%"
              color="#1976D2"
              elevation="10"
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
let currentLen = ref(5)
let original_images_list = ref([])
let segmented_images_list = ref([])

const fullUserName = computed(() => {
  return utilStore.username + '#' + utilStore.id
})

// 监视page页数的变化
watch(currentPage, (page) => {
  if (page >= currentLen.value) {
    currentLen.value = page + 1
  }
  handleGetImagesByPage(page)
})

onMounted(() => {
  currentPage.value = utilStore.page_number
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
        original_images_list.value = response_data.original_images_list
        segmented_images_list.value = response_data.segmented_images_list
      } else {
        //TODO 没有获取到数据 应该给予用户一定的提示
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