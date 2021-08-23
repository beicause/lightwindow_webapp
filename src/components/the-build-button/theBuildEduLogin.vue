<template>
  <view class="container">
    <view class="container-school">
      <text style="padding-right: 40px;">学校</text>
      <picker @change="selectSchool" :range="schools">{{ mSchool }}
        <uni-icons type="arrowdown"></uni-icons>
      </picker>
    </view>
    <uni-forms ref="form" :modelValue="formData" :rules="rules">
      <uni-forms-item name="username" label="账号">
        <uni-easyinput v-model="formData.username"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="password" label="密码">
        <uni-easyinput v-model="formData.password">
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>
    <text v-if="!btnImp" style="font-size: 14px;color: #007AFF">已导入:{{ school }}</text>
    <view class="container-login">
      <uni-tag @click="submit" :disabled="(!btnImp)||(!btnSubExtra)" type="primary" text="导入"></uni-tag>
      <uni-tag @click="pullOff" :disabled="btnImp||(!btnOffExtra)" type="primary" text="抽除"></uni-tag>
    </view>
  </view>
</template>

<script lang="ts">
import {
  getHfutEvents,
  qcUpdateInfo,
  getHfutEventsByToken,
  dateFormat,
  getSimpleDiff, showPopMsg, getEventDiff, giveColor
} from '@/util/util'
import store from '../../store'
import Vue from 'vue'
import {Mark} from "@/util/data";

export default Vue.extend({
  name: "theBuildEduLogin",
  data() {
    return {
      schools: ['合肥工业大学'],
      mSchool: '请选择',
      btnSubExtra: true,
      btnOffExtra: true,
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: {
          rules: [{
            required: true,
            errorMessage: '请输入账号'
          }]
        },
        password: {
          rules: [{
            required: true,
            errorMessage: '请输入密码'
          }]
        }
      }
    }
  },
  computed: {
    school(): string {
      return store.state.school
    },
    btnImp(): boolean {
      return !(store.state.eduToken)
    }
  },
  methods: {
    selectSchool(e: AnyObject): void {
      this.mSchool = this.schools[e.detail.value]
    },

    submit(): void {
      (this.$refs.form as Vue & { validate: Function }).validate()
          .then((r: AnyObject) => {
            if (this.mSchool === '合肥工业大学') {
              this.btnSubExtra = false
              showPopMsg({msg: '正在导入', type: 'info'})
              getHfutEvents(r.username, r.password).then(([res, events, hfutToken]) => {
                if (store.state.token) qcUpdateInfo(store.state.token, '合肥工业大学', hfutToken, store.state.updateTime)

                const newMarks=[] as Mark[]
                events.forEach(e=>{
                  if (!store.state.marks.has(e.day))newMarks.push({date:e.day,info:'有课'})
                })
                store.commit('addMarks',newMarks)

                const newEvents = getSimpleDiff(events, store.state.events)
                giveColor(newEvents)
                newEvents.forEach(e=>{
                  e.alarm="0"
                })

                store.commit('cacheMarks')
                store.commit('setAnyString', [['eduToken', hfutToken], ['school', '合肥工业大学'], ['updateTime', dateFormat(new Date())]])
                store.commit('addEvents', newEvents)
                store.dispatch('cacheAndTryPush')

                showPopMsg({msg: '导入成功', type: 'success', duration: 800})
                this.btnSubExtra = true
              }).catch((err: AnyObject) => {
                showPopMsg({msg: '失败', type: 'error', duration: 800})
                this.btnSubExtra = true
              })
            }
          })
          .catch((err: AnyObject) => console.log('表单错误:', err))
    },
    pullOff() {
      if (this.school === '合肥工业大学') {
        this.btnOffExtra = false
        showPopMsg({msg: '正在抽除', type: 'info'})
        getHfutEventsByToken(store.state.eduToken).then(([res, events, hfutToken]) => {

          const rMarks=[]as Mark[]
          events.forEach(e=>{
            if (store.state.marks.get(e.day)==='上课')rMarks.push({date:e.day,info:'上课'})
          })
          store.commit('removeMarks',rMarks)

          const tEvents = getSimpleDiff(store.state.events, events)
          const rEvents = getSimpleDiff(store.state.events, tEvents)
          store.commit('removeEvents', rEvents)

          store.commit('cacheMarks')
          store.commit('setAnyString', [['eduToken', ''], ['school', ''], ['updateTime', dateFormat(new Date())]])
          if (store.state.token) qcUpdateInfo(store.state.token, '', '', store.state.updateTime)
          store.dispatch('cacheAndTryPush')
          showPopMsg({msg: '抽除成功', type: 'success', duration: 800})
          this.btnOffExtra = true
        }).catch((err: AnyObject) => {
          showPopMsg({msg: '失败', type: 'error', duration: 800})
          this.btnOffExtra = true
        })
      }
    },
  }
})
</script>

<style scoped>
.container {
  width: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 10px;
}

.container-school {
  display: flex;
  font-size: 14px;
  padding: 15px 0 20px 0;
}

.container-login {
  display: flex;
  padding: 15px;
  justify-content: space-between;
}
</style>
