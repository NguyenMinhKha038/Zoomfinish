const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
const myVideo = document.createElement('video')
myVideo.muted = true

var peer = new Peer()

const myPeer = new Peer({ 
	path: '/peerjs',
	host: '/',
	port: '443',
	key: 'oz9b3ni30qtcsor', debug: 3, 
	config: {'iceServers': [
	{url:'stun.botonakis.com:3478'},
]}});

const peers = {}
let myVideoStream
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream
		addVideoStream(myVideo, stream)

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId.userId, stream)
			alert(userId.username + " đã vào lớp học", userId.userId)
			$('ul').append(`<li >
								<span class="messageHeader">
									<span>
										From
										<span class="messageSender">${userId.username}</span>
										to
										<span class="messageReceiver">Everyone:</span>
									</span>

									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>
								<span class="message">${userId.username + " đã vào lớp học"}</span> <span class="fa fa-connectdevelop" aria-hidden="true"></span>
							</li>`)
			scrollToBottom()
			$('ol').append(`<li id="${userId.userId}">
								<span class="messageHeader">
									<span>
										From
										<span class="messageSender">${userId.username}</span>
										to
										<span class="messageReceiver">Everyone:</span>
									</span>

									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>
								<span class="message">${userId.username + " đang online"}</span> <span class="fa fa-connectdevelop" aria-hidden="true"></span>
							</li>`)
			scrollToBottom()
		})

		peer.on('call', (call) => {
			call.answer(stream)
			const video = document.createElement('video')
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream)
			})
		})

		let text = $('input')

		$('html').keydown(function (e) {
			if (e.which == 13 && text.val().length !== 0) {
				socket.emit('message', text.val())
				text.val('')
			}
		})

		socket.on('createMessage', (message, userId) => {
			$('ul').append(`<li >
								<span class="messageHeader">
									<span>
										From 
										<span class="messageSender">${message.username}</span> 
										to 
										<span class="messageReceiver">Everyone:</span>
									</span>

									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>
								<span class="message">${message.text}</span>
							</li>`)
			scrollToBottom()
		})
	})

socket.on('user-disconnected', (userId) => {
	if (peers[userId.userId]) peers[userId.userId].close()
	$('ul').append(`<li >
								<span class="messageHeader">
									<span>
										From
										<span class="messageSender">${userId.username}</span>
										to
										<span class="messageReceiver">Everyone:</span>
									</span>

									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>
								<span class="message">${userId.username + " đã rời lớp học"}</span> <span class="fa fa-plug" aria-hidden="true"></span>
							</li>`)
			scrollToBottom()
	$("#"+userId.userId).remove();
})

peer.on('open', (id) => {
	socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
	})

	peers[userId] = call
}

const addVideoStream = (video, stream) => {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}

const scrollToBottom = () => {
	var d = $('.mainChatWindow')
	d.scrollTop(d.prop('scrollHeight'))
}

const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false
		setUnmuteButton()
	} else {
		setMuteButton()
		myVideoStream.getAudioTracks()[0].enabled = true
	}
}

const setMuteButton = () => {
	const html = `
	  <i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`
	document.querySelector('.mainMuteButton').innerHTML = html
}

const setUnmuteButton = () => {
	const html = `
	  <i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`
	document.querySelector('.mainMuteButton').innerHTML = html
}

const playStop = () => {
	console.log('object')
	let enabled = myVideoStream.getVideoTracks()[0].enabled
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false
		setPlayVideo()
	} else {
		setStopVideo()
		myVideoStream.getVideoTracks()[0].enabled = true
	}
}

const setStopVideo = () => {
	const html = `
	  <i class="fas fa-video"></i>
	  <span>Stop Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
}

const setPlayVideo = () => {
	const html = `
	<i class="stop fas fa-video-slash"></i>
	  <span>Play Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
};

const setEndMeeting = () => {
	location.replace("https://zoom-clone-done.herokuapp.com")
}