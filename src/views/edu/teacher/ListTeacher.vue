<template>
  <div class="app-container">
    <!-- 条件查询区 -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="teacherQuery.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="teacherQuery.begin" align="right" type="date" placeholder="开始日期"/>
      </el-form-item>

      <el-form-item label="结束日期">
        <el-date-picker v-model="teacherQuery.end" align="right" type="date" placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacherQuery.level" placeholder="讲师头衔">
          <el-option label="高级讲师" :value="1"></el-option>
          <el-option label="首席讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTeacherList">查询</el-button>
        <el-button type="primary" @click="resetDate">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 讲师列表展示区 -->
    <transition enter-active-class="animate__animated animate__backInLeft"
                leave-active-class="animate__animated animate__backOutRight">
      <el-table height="600" :data="teachers" stripe border style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="80"/>

        <el-table-column label="头衔" width="100">
          <template slot-scope="scope">
            {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
          </template>
        </el-table-column>

        <el-table-column prop="career" label="讲师资历"/>

        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

        <el-table-column prop="sort" label="排序" width="50"/>

        <el-table-column prop="gmtCreate" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showDialogForm(scope.row)" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteTeacherById(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </transition>
    <!-- 底部分页查询区 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;"layout="total,prev,pager,next,jumper" @current-change="fetchDate"/>
    <edit-teacher :eduTeacher="teacher" :dialog-show="dialogShow" @dialogChange="dialogClose"></edit-teacher>

  </div>
</template>

<script>
import teacher from "@/api/teacher/teacher";
import EditTeacher from "@/views/edu/teacher/EditTeacherFromModel";

export default {
  name: "ListTeacher",
  components: {EditTeacher},
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      teachers: [],
      teacherQuery: {},
      dialogShow: false,
      teacher: {}
    }
  },
  methods: {
    //查询讲师带条件
    getTeacherList() {
      teacher.saveTeacherPage(this.page, this.limit, this.teacherQuery).then((response) => {
        this.teachers = response.data.records
        this.total = response.data.total
      }).catch((error) => {
        console.log(error);
      })
    },
    //点击分页触发查询某一页
    fetchDate(page) {
      this.page = page
      this.getTeacherList()
    },
    resetDate() {//清空条件查询所有
      this.teacherQuery = {}
      this.getTeacherList()
    },
    //根据id删除
    deleteTeacherById(id){
      this.$confirm('此操作将删除该讲师记录,是否继续','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.deleteTeacherById(id).then(response=>{
          this.getTeacherList()
        })

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
  },
    //修改数据回显
    showDialogForm(teacher){
      this.dialogShow = true
      this.teacher=teacher
    },
    dialogClose(val){
      this.dialogShow=val
      this.getTeacherList()
    }
  },
  created() {
    this.getTeacherList()
  }
}
</script>
