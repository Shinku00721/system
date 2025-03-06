import { ElMessage } from "element-plus";

const showMessage = (type, msg, callback) => {
  ElMessage({
    type: type,
    message: msg,
    duration: 2000,
    onClose: () => {
      if (callback) {
        callback()
      }
    }
  })
}

const message = {
  success: (msg, callback) => {
    showMessage('success', msg, callback,)
  },
  error: (msg, callback) => {
    showMessage('error', msg, callback)
  },
  warning: (msg, callback) => {
    showMessage('warning', msg, callback,)
  },
}
export default message