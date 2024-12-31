<template>
  <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Docker Cli</a>
    </div>
  </nav>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  props: {},
  mounted() {
    //console.log("App")
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Inconsolata|Oswald');

.strong {
  font-weight: 600 !important;
}

.material-icons {
  vertical-align: middle;
  line-height: 0 !important;
  position: relative;
  top: -1px;
}
</style>
