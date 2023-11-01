<template lang="pug">
.fullscreen.bg-blue.q-pa-md.flex-center.flex.text-center.text-white
  div
    div(style="font-size: 30vh") 404
    .text-h2(style="opacity: 0.4") Oops. Nothing here...
    q-btn.q-mt-xl(
      color="white",
      text-color="blue",
      unelevated,
      to="/",
      label="Go Home",
      no-caps
    )
</template>
