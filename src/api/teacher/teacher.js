import request from "@/utils/request";

export default {
  saveTeacherPage(current,limit,teacherQuery){
    return request({
      url:`/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}/`,
      method: 'get',
      params:teacherQuery,
      data:{name:"张三"}
    })
  },

  deleteTeacherById(id){
    return request({
      url:`/eduservice/edu-teacher/deleteTeacherById/${id}/`,
      method: 'delete',
    })
  },

  addTeacher(teacher){
    return request({
      url:`/eduservice/edu-teacher/addTeacher/`,
      data:teacher,
      method: 'post',
    })
  },

  editTeacher(teacher){
    return request({
      url:`/eduservice/edu-teacher/updateTeacher/`,
      data:teacher,
      method: 'post',
    })
  },

  getAllTeacher() {
    return request({
      url:"/eduservice/edu-teacher/findAll",
      method: 'get'
    })
  }
}
