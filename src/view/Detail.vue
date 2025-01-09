<template>
  <div>
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
          </v-menu>
        </div>
      </div>
    </div>

    <div class="have_image d-flex justify-center align-center">
      <v-sheet
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          height="500"
          max-width="850"
          width="100%"
          rounded
      >
        <div>
          <div class="d-flex align-center justify-center" style="margin-bottom: 30px">
            <div class="img_with_description mx-2">
              <div class="d-flex justify-center mb-2">
                <span class="image_detail text-orange">上传的原图片</span>
              </div>
              <div class="img_source">
                <v-img
                    :width="300"
                    aspect-ratio="16/9"
                    cover
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                ></v-img>
              </div>
            </div>
            <div class="mx-4 svg-container">
              <svg class="svg-icon" viewBox="0 0 20 20">
                <path fill="none" d="M14.989,9.491L6.071,0.537C5.78,0.246,5.308,0.244,5.017,0.535c-0.294,0.29-0.294,0.763-0.003,1.054l8.394,8.428L5.014,18.41c-0.291,0.291-0.291,0.763,0,1.054c0.146,0.146,0.335,0.218,0.527,0.218c0.19,0,0.382-0.073,0.527-0.218l8.918-8.919C15.277,10.254,15.277,9.784,14.989,9.491z"></path>
              </svg>
            </div>
            <div class="img_with_description mx-2">
              <div class="d-flex justify-center mb-2">
                <span class="image_detail text-orange">分割后的图片</span>
              </div>
              <div class="img_segmented">
                <v-img
                    :width="300"
                    aspect-ratio="16/9"
                    cover
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                ></v-img>
              </div>
            </div>
          </div>
          <v-btn color="orange" variant="outlined" style="margin-top: 10px" @click="router.back()">上传图片去😁</v-btn>
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="ts" name="Detail">

import useUtilStore from "../store/util.ts";
import {computed, onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";

const utilStore = useUtilStore()
const router = useRouter()

const fullUserName = computed(() => {
  return utilStore.username + '#' + utilStore.id
})

onMounted(() => {
  document.body.classList.add('detail_body')
})

onUnmounted(() => {
  document.body.classList.remove('detail_body')
})

</script>

<style>
.detail_body {
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border: 0 solid black;
  border-bottom-width: 1px;
  z-index: 1000; /* 确保 navbar 在所有内容之前显示 */
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

.do_not_have_image {
  padding-top: 250px;
}

.have_image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: 100px;
}

.img_source,
.img_segmented,
.img_with_description {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.image_detail {
  font-family: "JetBrains Mono ExtraBold", sans-serif;
}

.have_image {
  padding-top: 100px; /* 确保内容不会被 navbar 覆盖 */
}

.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-icon {
  width: 3em;
  height: 4em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: black;
  stroke-width: 5;
}

.svg-icon circle {
  stroke: black;
  stroke-width: 5;
}
</style>