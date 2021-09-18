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
    <text v-if="isImported" style="font-size: 14px;color: #007AFF">已导入:{{ school + eduUserInfo.username }}</text>
    <view class="container-login">
      <uni-tag @click="submit" :disabled="!btnSubExtra" type="primary" :text="isImported?'重新导入':'导入'"></uni-tag>
      <uni-tag @click="pullOff" :disabled="!(isImported&&btnOffExtra)" type="primary" text="抽除"></uni-tag>
    </view>
  </view>
</template>

<script lang="ts">
import {dateFormat, giveColor, showPopMsg} from '@/common/util'
import store from '../../store'
import Vue from 'vue'
import {EduUserInfo, Mark, Event} from "@/common/data";
import {getHfutEvents} from "@/common/hfut";
import UniIcons from "@/plugins/uni-ui/lib/uni-icons/uni-icons.vue";
import UniForms from "@/plugins/uni-ui/lib/uni-forms/uni-forms.vue";
import UniFormsItem from "@/plugins/uni-ui/lib/uni-forms-item/uni-forms-item.vue";
import UniEasyinput from "@/plugins/uni-ui/lib/uni-easyinput/uni-easyinput.vue";
import UniTag from "@/plugins/uni-ui/lib/uni-tag/uni-tag.vue";
import {Android} from "@/common/android";

/**
 * 教务登陆界面
 */

export default Vue.extend({
  name: "TheEduLogin",
  components: {UniTag, UniEasyinput, UniFormsItem, UniForms, UniIcons},
  data() {
    return {
      schools: ['合肥工业大学', '长沙理工大学', '赣南师范大学'],
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
      return store.state.eduUserInfo.school
    },
    isImported(): boolean {
      return !!store.state.eduUserInfo.school
    },
    eduUserInfo(): EduUserInfo {
      return store.state.eduUserInfo
    }
  },
  methods: {
    selectSchool(e: any): void {
      console.log(e)
      this.mSchool = this.schools[e.detail.value]
    },

    submit(): void {
      if (this.isImported) {
        this.mSchool = this.school
        this.formData.username = this.eduUserInfo.username
        this.formData.password = this.eduUserInfo.password
      }
      this.mSubmit()
    },
    mSubmit() {
      (this.$refs.form as any).validate()
          .then((r: any) => {
            this.btnSubExtra = false
            showPopMsg({msg: '正在导入', type: 'info'})
            this.getEduEvents(this.mSchool, r.username, r.password).then(events => {
              this.removeEdu()
              this.addSchedule(events)
              store.commit('cacheMarks')
              store.commit('setAndCache', {
                eduUserInfo: {
                  school: this.mSchool,
                  username: r.username,
                  password: r.password
                },
                updateTime: dateFormat(new Date())
              })
              store.commit('cacheEvents')
              showPopMsg({msg: '导入成功', type: 'success', duration: 800})
              this.btnSubExtra = true

            }).catch((err: any) => {
              showPopMsg({msg: '失败' + err, type: 'error', duration: 800})
              this.btnSubExtra = true
            })

          })
          .catch((err: any) => console.log('表单错误:', err))
    },
    getEduEvents: async function (school: string, username: string, password: string) {
      switch (school) {
        case '合肥工业大学':
          return (await getHfutEvents(username, password))[1]
        case '长沙理工大学':
          if (!Android) throw Error("android only")
          return JSON.parse(Android.requestCsustEvents(username, password)) as Event[]
        case '赣南师范大学':
          if (!Android) throw Error("android only")
          return JSON.parse(Android.requestGnnuEvents(username, password)) as Event[]
        default:
          return [] as Event[]
      }
    },
    addSchedule(newEvents: Event[]) {
      const newMarks = [] as Mark[]
      newEvents.forEach(e => {
        if (!store.state.marks.has(e.day)) newMarks.push({date: e.day, info: '有课'})
      })
      store.commit('addMarks', newMarks)
      giveColor(newEvents)
      store.commit('setAndCache', {eduEvents: newEvents})
      store.commit('addEvents', newEvents)
    },
    removeEdu(){
      const rMarks = [] as Mark[]
      const rEvents = store.state.eduEvents
      rEvents.forEach(e => {
        if (store.state.marks.get(e.day) === '有课') rMarks.push({date: e.day, info: '有课'})
      })
      store.commit('removeMarks', rMarks)
      store.commit('removeEvents', rEvents)
    },
    pullOff() {
      this.btnOffExtra = false
      showPopMsg({msg: '正在抽除', type: 'info'})
      this.removeEdu()
      store.commit('cacheMarks')
      store.commit('setAndCache', {
        eduUserInfo: {school: '', username: '', password: ''},
        updateTime: dateFormat(new Date())
      })
      store.commit('cacheEvents')
      showPopMsg({msg: '抽除成功', type: 'success', duration: 800})
      this.btnOffExtra = true
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
