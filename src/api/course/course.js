import request from "@/utils/request";

export default {


  addCourse(courseInfo){
    return request({
      url:`/eduservice/edu-course/addCourse`,
      method: 'post',
      data:courseInfo
    })
  },
  updateCourse(courseInfo){
    return request({
      url:`/eduservice/edu-course/updateCourse`,
      method: 'post',
      data:courseInfo
    })
  },


}
