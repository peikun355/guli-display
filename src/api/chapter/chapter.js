import request from "@/utils/request";

export default {
  getChapterVideo(id){
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${id}`,
      method: 'get'
    })
  },

  addChapter(chapter){
    return request({
      url: `/eduservice/edu-chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },

  updateChapter(chapter){
    return request({
      url: `/eduservice/edu-chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },

  getChapterById(id){
    return request({
      url: `/eduservice/edu-chapter/getChapterById/${id}`,
      method: 'get'
    })
  },
  //删除章节
  removeChapterById(chapterId){
    return request({
      url: `/eduservice/edu-chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }

}
