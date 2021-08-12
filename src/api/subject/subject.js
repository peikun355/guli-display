import request from "@/utils/request";

export default {


  getSubjectTree(){
    return request({
      url:`/eduservice/edu-subject/getSubjectTree`,
      method: 'get',
    })
  },


}
