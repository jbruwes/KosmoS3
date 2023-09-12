<template lang="pug">
q-page.column.justify-start
  .col.column.q-ma-md
    q-img.col.rounded-borders(src="~assets/bg.jpg")
      q-card.absolute-center
        q-form
          .row.q-col-gutter-x-md
            .col-12.col-md.min-w-300
              .text-overline WEBSITE
              q-select.q-mb-md(dark=true standout label="saved credentials")
                template(#prepend)
                  q-icon(name="save")
              q-input.q-mb-md(dark=true standout label="domain" error-message="item is required" placeholder="example.com")
                template(#prepend)
                  q-icon(name="language")
              q-input.q-mb-md(dark=true standout label="access key id" error-message="item is required")
                template(#prepend)
                  q-icon(name="key")
              q-input.q-mb-md(dark=true standout label="secret access key" error-message="item is required" filled :type="visible ? 'password' : 'text'")
                template(#prepend)
                  q-icon(name="lock")
                template(#append)
                  q-icon.cursor-pointer(:name="visible ? 'visibility_off' : 'visibility'" @click="visible = !visible")
            .col-12.col-md.min-w-300
              .text-overline CLOUD
              q-select.q-mb-md(dark=true standout label="cloud provider")
                template(#prepend)
                  q-icon(name="cloud")
              q-input.q-mb-md(dark=true standout label="region" error-message="item is required")
                template(#prepend)
                  q-icon(name="flag")
              q-input.q-mb-md(dark=true standout label="endpoint url")
                template(#prepend)
                  q-icon(name="link")
              q-input.q-mb-md(dark=true standout label="website endpoint url")
                template(#prepend)
                  q-icon(name="web")
          q-toggle.q-mb-md(label="remember credentials")
          div
            q-btn.full-width(label="LogIn" type="submit" color="primary")
</template>
<script setup>
import { ref } from "vue";

const visible = ref(true);
</script>
<style>
.min-w-300 {
  min-width: 300px !important;
}
</style>
