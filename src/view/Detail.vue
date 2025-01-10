<template>
  <!--  如果有详细信息的话就会展示-->
  <div v-if="utilStore && utilStore.original_image_url && utilStore.segmented_image_url">
    <v-layout class="rounded rounded-md">
      <v-app-bar title="SwinTransformer" class="opacity-90">
        <v-toolbar-items>
          <v-btn variant="plain" :ripple="false" @click="router.replace({ name: 'detail' })">最近一次结果</v-btn>
          <v-btn variant="plain" :ripple="false" @click="router.replace({ name: 'detail' })">历史结果</v-btn>
        </v-toolbar-items>
        <v-divider class="mx-4" vertical></v-divider>
        <v-btn :ripple="false" variant="plain">
          <img src="../assets/login.svg" alt="login" class="img">
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer style="background: #fbfbfb">
        <v-list>
          <v-list-item>
            <v-btn
                :disabled="load_loading"
                :loading="load_loading"
                class="text-none mb-4"
                color="indigo-darken-2"
                size="x-large"
                variant="outlined"
                block
                @click="handleDownloadImage"
            >
              下载分割后的图片
            </v-btn>

            <v-btn
                :disabled="load_loading"
                :loading="load_loading"
                class="text-none mb-4"
                color="teal-lighten-3"
                size="x-large"
                variant="outlined"
                block
                @click="handleDeleteImage"
            >
              删除这条记录
            </v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main
          class="d-flex align-center justify-center"
          style="min-height: 300px;background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);"
      >
        <div class="have_image d-flex justify-center align-center">
          <v-sheet
              class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
              elevation="10"
              height="500"
              max-width="850"
              width="100%"
              rounded
              style="background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);"
          >
            <div>
              <div class="d-flex align-center justify-center" style="margin-bottom: 30px">
                <div class="img_with_description mx-2">
                  <div class="d-flex justify-center mb-2">
                    <span class="image_detail">上传的原图片</span>
                  </div>
                  <div class="img_source">
                    <v-img
                        :width="300"
                        cover
                        :src="utilStore.original_image_url"
                    ></v-img>
                  </div>
                </div>
                <div class="mx-4 svg-container">
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path fill="none"
                          d="M14.989,9.491L6.071,0.537C5.78,0.246,5.308,0.244,5.017,0.535c-0.294,0.29-0.294,0.763-0.003,1.054l8.394,8.428L5.014,18.41c-0.291,0.291-0.291,0.763,0,1.054c0.146,0.146,0.335,0.218,0.527,0.218c0.19,0,0.382-0.073,0.527-0.218l8.918-8.919C15.277,10.254,15.277,9.784,14.989,9.491z"></path>
                  </svg>
                </div>
                <div class="img_with_description mx-2">
                  <div class="d-flex justify-center mb-2">
                    <span class="image_detail">分割后的图片</span>
                  </div>
                  <div class="img_segmented">
                    <v-img
                        :width="300"
                        cover
                        :src="utilStore.segmented_image_url"
                    ></v-img>
                  </div>
                </div>
              </div>
              <v-btn color="black" variant="outlined" style="margin-top: 10px" @click="router.back()">上传图片去😁
              </v-btn>
            </div>
          </v-sheet>
        </div>
      </v-main>
    </v-layout>
  </div>

  <!--  如果没有可以显示的信息就基于用户一定的提示-->
  <div v-else class="do_not_have_image">
    <v-sheet
        class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
        elevation="8"
        height="300"
        max-width="900"
        width="100%"
        rounded
    >
      <div>
        <h2 class="text-h3 font-weight-black text-orange">Sorry!😫您最近还没有上传图片呢</h2>

        <div class="text-h6 font-weight-medium mb-2" style="margin-top: 20px">
          这里只会展示近期的分割情况，如果想要显示所有的结果可以点击主页面的历史结果按钮查看
        </div>
        <v-btn color="orange" variant="outlined" style="margin-top: 20px" @click="router.back()">上传图片去😎</v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script setup lang="ts" name="Detail">

import useUtilStore from "../store/util.ts";
import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";

const utilStore = useUtilStore()
const router = useRouter()
let load_loading = ref(false)

onMounted(() => {
  document.body.classList.add('detail_body')
})

onUnmounted(() => {
  document.body.classList.remove('detail_body')
})

if (utilStore.id <= 0) {
  utilStore.getFromCookieIdentification()
}

const handleDownloadImage = async () => {
  load_loading.value = true
  setTimeout(() => {
    load_loading.value = false
  }, 2500)
}

const handleDeleteImage = async () => {
  load_loading.value = true
  setTimeout(() => {
    load_loading.value = false
  }, 3000)
  try {
    const response = await axios.post('/delete/', {
      original_image_id: utilStore.original_image_id
    })
    if(response.status === 200) {
      utilStore.clearImages()
    } else {
      console.log(response.data.message)
    }
  } catch (e) {
    console.error('Delete Error...', e)
  }
}

</script>

<style>
.detail_body {
  font-family: "JetBrains Mono ExtraBold", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  color: #333;
}

.img {
  width: 35px;
  margin-bottom: 40px;
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
  color: black;
}

.have_image {
  padding-top: 100px;
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