<template>
  <v-container>
    <v-icon v-show="!drawer" class="expand-arrow" color="blue" @click="()=>{this.drawer=true}">fal fa-chevron-circle-right</v-icon>
    <v-navigation-drawer mini-variant v-model="drawer">
      <v-list dense>
        <v-list-item-group color="blue" @change="onItemClick" :value="selectItem">
          <v-list-item>
            <v-icon>fal fa-calendar-week</v-icon>
          </v-list-item>
          <v-list-item>
            <v-icon>far fa-paw</v-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <div v-show="selectItem===0">
      <p class="blue--text">日程表</p>
    </div>
    <div v-show="selectItem===1">
      <p></p>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "Guide",
  data() {
    return {
      drawer: false,
      selectItem:0
    }
  },
  methods:{
    onItemClick(e:any){
      if (e!==undefined)this.selectItem=e
      this.drawer=false
    }
  }
})
</script>

<style scoped>
.expand-arrow {
  position: fixed;
  top: 50%;
  left: 0
}
</style>
