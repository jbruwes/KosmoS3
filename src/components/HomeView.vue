<template>
  <v-card :image="require('../assets/bg.jpg')" class="fill-height"
    ><v-row class="fill-height" align="center" justify="center"
      ><v-card class="pa-8 ma-8" :width="640" color="#ffffffee">
        <v-row
          ><v-col cols="12" md="6">
            <div class="text-subtitle-1 text-medium-emphasis mb-1">WEBSITE</div>
            <v-select
              label="select saved credential"
              prepend-inner-icon="mdi-content-save"
              variant="underlined"
            ></v-select>
            <v-text-field
              label="domain"
              placeholder="example.com"
              prepend-inner-icon="mdi-web"
              variant="underlined"
            ></v-text-field>
            <v-text-field
              label="access key id"
              prepend-inner-icon="mdi-key"
              variant="underlined"
            ></v-text-field>
            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="secret access key"
              prepend-inner-icon="mdi-lock"
              @click:append-inner="visible = !visible"
              variant="underlined"
            ></v-text-field> </v-col
          ><v-col cols="12" md="6">
            <div class="text-subtitle-1 text-medium-emphasis mb-1">CLOUD</div>
            <v-select
              label="cloud provider"
              prepend-inner-icon="mdi-cloud"
              variant="underlined"
              :items="providers"
              v-model="provider"
            ></v-select
            ><v-text-field
              label="region"
              prepend-inner-icon="mdi-flag"
              variant="underlined"
            ></v-text-field
            ><v-text-field
              label="endpoint url"
              prepend-inner-icon="mdi-database"
              variant="underlined"
            ></v-text-field
            ><v-text-field
              label="website endpoint url"
              prepend-inner-icon="mdi-server-network"
              variant="underlined"
            ></v-text-field> </v-col
        ></v-row>
        <v-row
          ><v-col cols="12" md="6"
            ><v-switch
              label="remember credentials"
              v-model="remember"
              color="info"
            ></v-switch></v-col
        ></v-row>
        <v-row
          ><v-col cols="12"
            ><v-btn block color="blue" size="large" variant="tonal">
              Log In
            </v-btn></v-col
          ></v-row
        >
      </v-card></v-row
    ></v-card
  >
</template>
<script setup>
import { ref } from "vue";
const visible = ref(false);
const remember = ref(true);
const providers = ref(["custom...", "aws", "yandex"]);
const provider = ref("");
</script>
