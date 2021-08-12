<template>
<div>
  <el-button type="text">添加章节</el-button>
  <!-- 章节 -->
  <ul class="chanpterList">
    <li
      v-for="chapter in chapterVideo"
      :key="chapter.id">
      <p>
        {{ chapter.title }}

        <span class="acts">
                <el-button type="text">添加课时</el-button>
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
            </span>
      </p>

      <!-- 视频 -->
      <ul class="chanpterList videoList">
        <li
          v-for="video in chapter.children"
          :key="video.id">
          <p>{{ video.title }}
            <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text">删除</el-button>
                    </span>
          </p>
        </li>
      </ul>
    </li>
  </ul>
</div>
</template>

<script>
import chapter from "@/api/chapter/chapter";
export default {
  name: "Chapter",
  props:["courseId"],
  data(){
    return{
      chapterVideo:[]
    }
  },
  mounted() {
    this.getChapterVideo(this.courseId)
  },
  methods:{
    getChapterVideo(id) {
      chapter.getChapterVideo(12).then(resp=>{
        this.chapterVideo=resp.data.allChapterVideo
      })
    }
  }
}
</script>

<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
