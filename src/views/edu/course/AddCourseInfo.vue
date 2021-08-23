<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select @change="updateTowSubject" v-model="courseInfo.subjectParentId" clearable placeholder="一级分类">
          <el-option :key="subject.id" v-for="subject in subjectFirstList" :value="subject.id" :label="subject.title"/>
        </el-select>

        <el-select v-model="courseInfo.subjectId" clearable placeholder="二级分类">
          <el-option :key="subject.id" v-for="subject in subjectTowList" :value="subject.id" :label="subject.title"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" clearable placeholder="请选择">
          <el-option :key="teacher.id" v-for="teacher in teachers" :value="teacher.id" :label="teacher.name"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">

      </el-form-item>
      <quill-editor ref="QuillEditor" class=".editor" v-model="courseInfo.description" :options="editorOption"/>



      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_URL+'edu_oss/file_oss/coverUpload'"
          class="avatar-uploader">
          <img style="height: 100px" :src="courseInfo.cover" alt="课程封面">
        </el-upload>

      </el-form-item>


      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程设置为0"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>

    </el-form>

    <el-upload
      style="display: none"
      :show-file-list="false"
      :on-success="imgUploadSuccess"
      :action="BASE_URL+'edu_oss/file_oss/descriptionImgUpload'"
      class="avatar-uploader">
      <button id="upload">上传</button>
    </el-upload>
  </div>
</template>

<script>
import course from "@/api/course/course";
import teacher from "@/api/teacher/teacher";
import subject from "@/api/subject/subject";
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
]
export default {

  name: "AddCourseInfo",
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      content: ``, // 富文本编辑器默认内容
      editorOption: {
        //  富文本编辑器配置
        modules: {
          //工具栏定义的
          toolbar: {
            container: toolbarOptions, //工具栏
            handlers: {
              'image': function (value){
                if (value){
                  document.getElementById('upload').click()
                }else {
                  this.quill.format('image',false)
                }
              }
            }
          }
        },
        //主题
        theme: "snow",
        placeholder: "请输入正文"
      },
      courseInfo:{
        cover:"",
        description:"",
        id:"",
        lessonNum:0,
        price:0,
        subjectParentId:"",
        subjectId:"",
        teacherId: "",
        title: ""
      },
      teachers:{},
      saveBtnDisabled:false,
      subjectFirstList:[],
      subjectTowList:[],
      BASE_URL: process.env.VUE_APP_BASE_API,
      OSS_PATH: process.env.VUE_APP_OSS_PATH, // 阿里云OSS地址
    };
  },
  methods: {
    //上传简介图片成功后
    imgUploadSuccess(resp){
      const url=resp.data.url
      let quill=this.$refs.QuillEditor.quill
      let length=quill.getSelection().index;
      //插入图片
      quill.insertEmbed(length,'image',url)
      quill.setSelection(length+1)
    },
    //上传简介图片失败后
    imgUploadError(){

    },
    next() {
      if (this.$store.state.isUpdateCourseInfo){
        course.updateCourse(this.courseInfo).then(resp=>{
          this.$emit("next",this.courseInfo.id)
          this.$store.isUpdateCourseInfo=false
        })
      }else {
        course.addCourse(this.courseInfo).then(resp=>{
          this.courseInfo.id=resp.data.id
          this.$emit("next",resp.data.id)
        })
      }



    },
    //二级联动课程分类
    updateTowSubject(id){
      this.courseInfo.subjectId=""

      this.subjectTowList=this.subjectFirstList.filter(oneSubject=>oneSubject.id===id)[0].children
    },
    //上传课程封面前
    beforeAvatarUpload(file){
      const is2M=file.size/1024<500
      const isJPG=file.type==='image/jpeg'
      if (!is2M){
        this.$message.error("课程封面不能超过500KB！")
        return false
      }
      if (!isJPG){
        this.$message.error("图片必须为image/jpeg格式！")
      }
    },

    //上传课程封面成功后
    handleAvatarSuccess(resp){
      this.courseInfo.cover=resp.data.url
    }

  },
  mounted() {
    this.courseInfo.cover=this.OSS_PATH+"cover/defultCover.jpg"

    teacher.getAllTeacher().then(resp=>{
      this.teachers=resp.data.teachers
    })

    subject.getSubjectTree().then(resp=>{
      this.subjectFirstList=resp.data.subjectList
    })
  }
}
</script>

<style lang='scss' >


.editor {
  line-height: normal !important;
  height: 500px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {

  content: "保存";

}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
