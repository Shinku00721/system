<template>
  <textarea class="editor" ref="textareaRef">

  </textarea>
</template>

<script setup>
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import lang from 'suneditor/src/lang'
import plugins from 'suneditor/src/plugins'
import request from '@/utils/request'
import { nextTick, onMounted, ref, watch } from 'vue'
const textareaRef = ref()
let sunEditor = ref(null)
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue:{
    type:String,
    default:''
  }
})

const init = () => {
  nextTick(() => {
    const editor = suneditor.create(textareaRef.value,{
      lang:lang.zh_cn,//设置语言
      plugins:plugins, //加载插件
      height:'130',
      buttonList : [
        ['undo', 'redo', 'font', 'fontSize', 'formatBlock','bold', 'underline','italic'],
        [ 'strike', 'subscript', 'superscript', 'removeFormat'],
 // Line break
        ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
        ['link', 'image', 'video', 'fullScreen', 'codeView', 'preview',  'save']
    ],
    })
    editor.onImageUploadBefore = (files, info, core, uploadHandler) => {
      //发送请求
      request({
        url:'/file/uploadFile',
        params:{
          file:files[0]
        }
      }).then(res => {
        uploadHandler({
          result:[
            {
              url: '/api/file/getImage/' + res,
              name:files[0].name,
              size:files[0].size
            }
          ]
        })
      })
    }
    //内容改变
    editor.onBlur = (event, core, contents) => {
      emit('update:modelValue',contents.innerHTML)
    }
    sunEditor.value = editor
  })
}



watch(() => props.modelValue,(newValue,oldValue) => {
  if(sunEditor.value){
    sunEditor.value.setContents(newValue)
  }
},{immediate:true,deep:true})

onMounted(() => {
  console.log(props.modelValue)
  init()
})
</script>

<style lang="scss" scoped>
.editor{
  width: 100%;
  height: 300px;
}
</style>