<template>
<v-container>
  <v-simple-table dense>
    <thead>
    <tr>
      <th>符号</th>
      <th>作用</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <th>数字（0-7）</th>
      <th>休止符和七音</th>
    </tr>
    <tr>
      <th>斜杠（/）</th>
      <th>分隔小节</th>
    </tr>
    <tr>
      <th>前置井号（#）</th>
      <th>升记号，升高半音</th>
    </tr>
    <tr>
      <th>前置小字母u</th>
      <th>高音点，音高八度</th>
    </tr>
    <tr>
      <th>前置小字母d</th>
      <th>低音点，音低八度</th>
    </tr>
    <tr>
      <th>前置下划线（_）</th>
      <th>减时线，时值减半</th>
    </tr>
    <tr>
      <th>后置加号（+）</th>
      <th>增时线，延长一拍</th>
    </tr>
    </tbody>
  </v-simple-table>
  <div style="font-size: 14px">注：<br/>默认钢琴，每小节四拍<br/>速度每分钟120个四分音符</div>
</v-container>
</template>

<script>
export default {
  name: "MusicGuide"
}
</script>

<style scoped>

</style>
