<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="active" align-center style="margin-bottom: 40px" process-status="wait">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>
    <AddCourseInfo @next="next" v-show="active===1"/>
    <Chapter @next="next(courseId)" @previous="previous" :courseId="courseId" v-if="active===2"/>
    <PublishCourseInfo @previous="previous" :courseId="courseId" v-if="active===3"/>
<!--    <el-button type="primary" style="margin-top: 12px;margin-left: 120px" @click="next">保存并下一步</el-button>-->
  </div>
</template>

<script>
import AddCourseInfo from "@/views/edu/course/AddCourseInfo";
import Chapter from "@/views/edu/course/Chapter";
import PublishCourseInfo from "@/views/edu/course/PublishCourseInfo";
export default {
  name: "AddCourse",
  components: {PublishCourseInfo, Chapter, AddCourseInfo},
  data() {
    return {
      active: 1,
      courseId: ''
    };
  },

  methods: {
    next(id) {
      this.courseId=id
      if (this.active++ > 2) this.active = 1;
    },
    previous(){
      this.active--
    }
  }
}
</script>

<style scoped>

</style>
