<template>
  <view>
    <view class="container-band">
      <image mode="aspectFit" style="height: 20px" src="@/static/band_cpr.png"></image>
    </view>
    <uni-segmented-control class="segmented" :current="current" :values="['日','周','月']"
                           styleType="button" @clickItem="onClickItem">
    </uni-segmented-control>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import UniSegmentedControl from '@dcloudio/uni-ui/lib/uni-segmented-control/uni-segmented-control.vue'
export default Vue.extend({
  name: "theNavBar",
  components:{UniSegmentedControl},
  data(){
    return{
      current:0
    }
  },
  methods: {
    onClickItem(e:AnyObject){
      switch (e.currentIndex) {
        case 0:
          this.$emit('nav',{from:this.current,to:0})
              break
          case 1:
            this.$emit('nav',{from:this.current,to:1})
              break
        case 2:
          this.$emit('nav',{from:this.current,to:2})
              break
      }
      this.current=e.currentIndex
    }
  }
})
</script>

<style scoped>
.segmented {
  height: 25px;
}

.container-band {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>