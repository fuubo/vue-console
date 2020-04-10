<template>
  <div id="app"><router-view /></div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      activeIndex: null,
      isCollapse: true
    };
  },
};
</script>

<style lang="scss" >
@import "./styles/utils.scss";

html,
body {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  min-width: 1024px;
  min-height: 800px;
  overflow: scroll;
}

#app {
  width: 100%;
  height: 100%;
}
.image-slot{
  width: 78px;
  height: 107px;
  border: 1px solid #eee;
  text-align: center;
  line-height: 107px;
  @include flex;
}
h1{
  font-size: 1.3em;
}
h2{
  font-size: 1.2em
}
h3{
  font-size: 1.1em
}
p, span, ul {
  font-size: 14px;
}
table, table span, table p{
  font-size: 13px;
}
</style>
