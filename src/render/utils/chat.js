export class Chat {
  constructor({ socket, calledHandle, getCallReject } = {}) {
    this.socket = socket
    this.calledHandle = calledHandle
    this.getCallReject = getCallReject
    this.peer = null
    this.localMedia = null
  }
  async init() {
    // 呼叫被接受
    this.socket.on('answer', ({ answer }) => {
      this.peer && this.peer.setRemoteDescription(answer)
    })
    // 被呼叫事件
    this.socket.on('called', (callingInfo) => {
      this.called && this.called(callingInfo)
    })
    // 呼叫被拒
    this.socket.on('callRejected', () => {
      this.getCallReject && this.getCallReject()
    })

    this.socket.on('icecandidate', ({ icecandidate }) => {
      if(icecandidate){
        console.log('远端添加icecandidate')
        this.peer && this.peer.addIceCandidate(new RTCIceCandidate(icecandidate))
      }
    })
    return this
  }
  addEvent(name, cb) {
    if (!this.socket) return
    this.socket.on(name, (data) => {
      cb.call(this, data)
    })
  }
  sendMessage(name, data) {
    if (!this.socket) return
    this.socket.emit(name, data)
  }
  // 获取本地媒体流
  async getLocalMedia() {
    let localMedia = await navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: true })
      .catch((e) => {
        console.log(e)
      })
    this.localMedia = localMedia
    return this
  }
  // 设置媒体流到video
  setMediaTo(eleId, media) {
    document.getElementById(eleId).srcObject = media
  }
  // 被叫响应
  called(callingInfo) {
    this.calledHandle && this.calledHandle(callingInfo)
  }
  // 创建RTC
  createLoacalPeer() {
    console.error('create peer')
    // const servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}], sdpSemantics:'plan-b'};
    this.peer = new RTCPeerConnection()
    return this
  }
  // 将媒体流加入通信
  addTrack() {
    if (!this.peer || !this.localMedia) return
    //this.localMedia.getTracks().forEach(track => this.peer.addTrack(track, this.localMedia));
    this.peer.addStream(this.localMedia)
    console.error('addStream')
    return this
  }
  // 创建 SDP offer
  async createOffer(cb) {
    if (!this.peer) return
    let offer = await this.peer.createOffer({
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    })
    this.peer.setLocalDescription(offer)
    cb && cb(offer)
    return this
  }
  async createAnswer(offer, cb) {
    if (!this.peer) return
    console.error('set remote desc offer')
    console.error(offer)
    this.peer.setRemoteDescription(offer)
    let answer = await this.peer.createAnswer({
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    })
    this.peer.setLocalDescription(answer)
    cb && cb(answer)
    return this
  }
  listenerAddStream(cb) {
    this.peer.addEventListener('addstream', (event) => {
      console.log('addstream事件触发', event.stream)
      cb && cb(event.stream)
    })
    return this
  }
  // 监听候选加入
  listenerCandidateAdd(cb) {
    this.peer.addEventListener('icecandidate', (event) => {
      let iceCandidate = event.candidate
      if (iceCandidate) {
        console.log('发送candidate给远端', iceCandidate)
        cb && cb(iceCandidate)
      }
    })
    return this
  }
  // 检测ice协商过程
  listenerGatheringstatechange() {
    this.peer.addEventListener('icegatheringstatechange', (e) => {
      console.log('ice协商中: ', e.target.iceGatheringState)
    })
    return this
  }
  // 关闭RTC
  closeRTC() {
    // ....
  }
}
