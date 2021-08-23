import request from "@/utils/request";

export default {
  //获取确认课程信息
  getPublishCourseInfo(courseId){
    return request({
      url: `/eduservice/edu-course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },



}
