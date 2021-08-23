<template>
  <div>
    <el-button @click="addChapterShow=true" type="text">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterVideo" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button @click="saveVideo(chapter.id)" type="text">添加课时</el-button>
                <el-button @click="editChapter(chapter.id)" style="" type="text">编辑</el-button>
                <el-button @click="deleteChapter(chapter.id)" type="text">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
              <el-button @click="updateVideo(video.id)" type="text">编辑</el-button>
              <el-button @click="removeVideo(video.id)" type="text">删除</el-button>
            </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-button @click="previous" type="primary">上一步</el-button>
    <el-button @click="next" type="primary">下一步</el-button>

    <save-or-update-chapter @dialogClose="addChapterShow=false" :dialogShow="addChapterShow" :chapter="chapter">
      <el-button type="primary" @click="saveChapter()">添 加</el-button>
    </save-or-update-chapter>

    <save-or-update-chapter @dialogClose="modifyChapterShow=false" :dialog-show="modifyChapterShow" :chapter="chapter">
      <el-button type="primary" @click="modifyChapter()">修改</el-button>
    </save-or-update-chapter>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/chapter/chapter";
import SaveOrUpdateChapter from "@/views/edu/course/slot/SaveOrUpdateChapter";
import video from "@/api/video/video";

export default {
  name: "Chapter",
  components: {SaveOrUpdateChapter},
  props: ["courseId"],
  data() {
    return {
      dialogVideoFormVisible: false,
      video:{},
      chapterVideo: [],
      addChapterShow: false,
      modifyChapterShow: false,
      chapter: {
        title: '',
        sort: 0
      }
    }
  },
  mounted() {
    this.getChapterVideo(this.courseId)
  },

  methods: {
    //前往课程信息确认页面
    next(){
      this.$emit("next")
    },
    /*============================= 下面为小结方法 ====================================*/
    //删除小结
    removeVideo(id){
      this.$confirm('此操作将永久删除该小结, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.removeVideoById(id).then(resp=>{
          this.$message.success("删除成功")
          this.getChapterVideo(this.courseId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //添加或修改小结
    saveOrUpdateVideo(){
      if (this.video.id){ //执行修改操作

        video.updateVideo(this.video).then(resp=>{
          this.dialogVideoFormVisible=false
          this.$message.success("修改小结成功")
          this.video={}
          this.getChapterVideo(this.courseId)
        })

      }else {//执行添加操作
        video.addVideo(this.video).then(resp=>{
          this.dialogVideoFormVisible=false
          this.$message.success("添加小结成功")
          this.video={}
          this.getChapterVideo(this.courseId)
        })
      }

    },
    //添加小结
    saveVideo(chapterId){
      this.video={}
      this.video.chapterId=chapterId
      this.video.courseId=this.courseId
      this.dialogVideoFormVisible=true
    },
    //修改小结
    updateVideo(videoId){
      video.getVideoById(videoId).then(resp=>{
        this.video=resp.data.video
        this.video.free=resp.data.video.isFree===0
        this.dialogVideoFormVisible=true
      })
    },
    //获取所有章节及小节
    getChapterVideo(id) {
      chapter.getChapterVideo(id).then(resp => {
        this.chapterVideo = resp.data.allChapterVideo
      })
    },
    //返回修改上一页面
    previous() {
      this.$store.state.isUpdateCourseInfo = true
      this.$emit("previous")
    },

    //==================================下面是章节方法=======================================//
    //添加章节
    saveChapter(){
      this.chapter.courseId=this.courseId
      chapter.addChapter(this.chapter).then(resp=>{
        this.addChapterShow=false
        this.$message.success("添加章节成功！")
        this.getChapterVideo(this.courseId)
        this.chapter={}
      })
    },
    //弹出修改章节数据回显
    editChapter(id){
      chapter.getChapterById(id).then(resp=>{
        this.chapter=resp.data.chapter

        this.modifyChapterShow=true
      })
    },
    //修改章节
    modifyChapter(){
      chapter.updateChapter(this.chapter).then(resp=>{
        this.modifyChapterShow=false
        this.$message.success("修改章节成功！")
        this.getChapterVideo(this.courseId)
        this.chapter={}
      })
    },

    //删除章节
    deleteChapter(chapterId){
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.removeChapterById(chapterId).then(resp=>{
          this.$message.success("删除成功")
          this.getChapterVideo(this.courseId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
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
