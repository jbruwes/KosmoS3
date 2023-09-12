<template lang="pug">
q-page.column.justify-start
  .col.column.q-ma-md
    q-img.col.rounded-borders(src="~assets/bg.jpg")
      q-card.absolute-center
        q-form
          .row.q-col-gutter-md
            .col-12.col-md
              .text-overline WEBSITE
              q-input(dark=true filled label="Your name *" hint="Name and surname")
              q-input(dark=true filled type="number" label="Your age *")
            .col-12.col-md
              .text-overline CLOUD
              q-input(dark=true filled label="Your name *" hint="Name and surname")
              q-input(dark=true filled type="number" label="Your age *")
          q-toggle(label="I accept the license and terms")
          div
            q-btn(label="Submit" type="submit" color="primary")
            q-btn(label="Reset" type="reset" color="primary" flat class="q-ml-sm")
</template>
