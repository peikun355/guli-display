<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogChapterFormVisible=false">取 消</el-button>
<!--      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>-->
      <slot/>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SaveOrUpdateChapter",
  props: ["chapter","dialogShow"],
  data(){
    return{
      dialogChapterFormVisible: false
    }
  },
  methods:{

  },
  watch:{
    dialogShow(val){
      this.dialogChapterFormVisible=val
    },
    dialogChapterFormVisible(val){
      if (!val){
        this.$emit("dialogClose",false)
      }
    }
  }
}
</script>

<style scoped>

</style>
