<template>
  <div class="api">
    <!-- Header -->
    <Header title="MaveQuest API"></Header>

    <!-- RapiDoc -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <rapi-doc
          :spec-url = "this.$apiEntryPoint + '/public/swagger.yaml'"
          allow-spec-url-load	= "false"
          allow-spec-file-load = "false"
          show-header = "false"
          show-info = "false"
          primary-color = "#209CEE"
          regular-font="BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 
          'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
          'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          ref="apidoc"
          style="min-width: 300px;"
        >
        </rapi-doc>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import "rapidoc/dist/rapidoc-min";

export default {
  name: "api",
  components: {
    Header
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit('updateNav', 'api');
  }
};
</script>