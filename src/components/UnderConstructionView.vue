<template>
  <div class="under-construction">
    <section class="section is-medium has-text-centered fill-screen-withheader">
      <h1 class="title has-text-grey is-center">
        <b-icon class="icon-space" icon="fas fa-coffee"></b-icon>
        <b-icon class="icon-space" icon="fas fa-plus" size="is-small"></b-icon>
        <b-icon class="icon-space" icon="fas fa-desktop"></b-icon>
        <b-icon class="icon-space" icon="fas fa-equals" size="is-small"></b-icon>
        <b-icon class="icon-space" icon="fas fa-file-code"></b-icon>
      </h1>
      <h1 class="subtitle has-text-grey">Working on it...</h1>
    </section>
  </div>
</template>

<script>
export default {
    name: "under-construction"
}
</script>

<style scoped>
.icon-space {
  padding: 2rem;
}
.is-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>