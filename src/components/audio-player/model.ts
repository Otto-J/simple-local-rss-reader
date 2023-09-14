/**
 * 集中处理和 player 相关的逻辑
 * 时间处理、播放状态处理
 */
export const usePlayer = () => {
  // video 标签的 ref
  const videoRef = ref<HTMLVideoElement | null>(null)

  // 展示 video 当前的时间
  const currentTime = ref(0)

  // time format seconds
  const showTime = () => {
    if (!videoRef.value) return
    // console.log(videoRef.value.currentTime)
    currentTime.value = Math.floor(videoRef.value.currentTime)
  }

  const videoPlayStatus = ref(false)
  // 点击播放、暂停 video
  const togglePlay = () => {
    if (!videoRef.value) return
    if (videoRef.value.paused) {
      videoRef.value.play()
      videoPlayStatus.value = true
    } else {
      videoRef.value.pause()
      videoPlayStatus.value = false
    }
  }

  // video 向后跳转 5s
  const forward = (s = 5) => {
    if (!videoRef.value) return
    videoRef.value.currentTime += s
  }

  const jumpTime = (target: number) => {
    if (!videoRef.value) return

    const current = target
    videoRef.value.currentTime = current
  }

  const videoSpeedNumber = ref(1)

  // 视频 1/1.5/2 倍速切换
  const videoSpeed = () => {
    if (!videoRef.value) return

    // currentRate
    const speed = videoRef.value.playbackRate

    const setSpeed = (step: number) => {
      if (videoRef.value) {
        videoRef.value.playbackRate = step
        videoSpeedNumber.value = step
      }
    }

    if (speed === 1) {
      setSpeed(1.5)
    } else if (speed === 1.5) {
      setSpeed(2)
    } else {
      setSpeed(1)
    }
  }

  return {
    videoRef,
    videoPlayStatus,
    togglePlay,
    forward,
    jumpTime,
    videoSpeed,
    currentTime,
    showTime,
    videoSpeedNumber
  }
}

// 传递 second 转成 00:00:00
// 将秒数转换为 00:00:00 格式
export function secondsToHMS(seconds: number) {
  const pad = (num: number) => {
    return String(num).padStart(2, '0')
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
}

// 将 00:00:00 格式转换为秒数
export function HMSToSeconds(hms: string) {
  const timeArray = hms.split(':').reverse()
  let seconds = 0

  for (let i = 0; i < timeArray.length; i++) {
    const multiplier = Math.pow(60, i)
    seconds += parseInt(timeArray[i]) * multiplier
  }

  return seconds
}
