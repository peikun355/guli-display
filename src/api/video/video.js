import request from "@/utils/request";

export default {
  //添加小结
  addVideo(video){
    return request({
      url: `/eduservice/edu-video/addEduVideo`,
      method: 'post',
      data: video
    })
  },


  //删除小结
  removeVideoById(videoId){
    return request({
      url: `/eduservice/edu-video/deleteEduVideo/${videoId}`,
      method: 'delete'
    })
  },

  //根据id查寻小结
  getVideoById(videoId){
    return request({
      url: `/eduservice/edu-video/getVideoById/${videoId}`,
      method: 'get'
    })
  },

  //修改小结
  updateVideo(video) {
    return request({
      url: `/eduservice/edu-video/updateVideo`,
      method: 'post',
      data: video
    })
  }
}
