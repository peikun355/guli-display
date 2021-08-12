<template>
  <el-dialog :close-on-click-modal=false title="讲师修改" :visible.sync="dialogFormVisible">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="4" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">更换头像</el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imageCropperShow"
          :width="300"
          :height="300"
          :key="imageCropperKey"
          :url="'/edu_oss/file_oss/avatarUpload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="primary" @click="editTeacher">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import teacher from "@/api/teacher/teacher";
import ImageCropper from "@/components/ImageCropper"
import PanThumb from "@/components/PanThumb"
export default {
  components:{ImageCropper,PanThumb},
  name: "EditTeacher",
  props:['eduTeacher','dialogShow'],
  data(){
    return {
      dialogFormVisible:false,
      imageCropperShow:false,
      imageCropperKey:0,
      BASE_API:"localhost",
    }
  },
  computed:{
    teacher(){
      return this.eduTeacher
    }
  },
  watch:{
    dialogShow(val){
      this.dialogFormVisible=val
    },
    dialogFormVisible(val){
      if (!val){
        this.$emit("dialogChange",false)
      }
    }
  },
  methods:{
    //修改讲师信息
    editTeacher(){
      teacher.editTeacher(this.teacher).then(resp=>{
        this.dialogFormVisible=false
      })
    },
    close(){
      this.imageCropperShow=false
    },
    cropSuccess(data){
      this.teacher.avatar=data.url
      this.imageCropperShow=false
    }
  }
//Invalid prop: type check failed for prop "image". Expected String with value "null", got Null
  //无效的prop:类型 检查 失败 因为 prop
  //Invalid prop: type check failed for prop "image". Expected String with value "undefined", got Undefined

}
</script>

<style scoped>

</style>
