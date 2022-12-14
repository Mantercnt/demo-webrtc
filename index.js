let peerConnection;
let remoteStream; 
let localStream;

let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}

const init = async () =>{

 localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
 document.getElementById("video-1").srcObject = localStream;

}

const createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById("video-2").srcObject = remoteStream;
    

    localStream.getTracks().forEach((track)=>{
peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate){
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById('offer-sdp').value = JSON.stringify(offer);
}


const createAnswer = async () => {

 peerConnection = new RTCPeerConnection(servers);

 remoteStream = new MediaStream();
 document.getElementById('video-2').srcObject = remoteStream; 

    localStream.getTracks().forEach((track)=>{
    peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async (event) => {

        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })

    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate){
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    let offer = document.getElementById('offer-sdp').value; 
    await peerConnection.setRemoteDescription(JSON.parse(offer))

    let answer = peerConnection.createAnswer(servers);
    await peerConnection.setLocalDescription(answer);

    document.getElementById('answer-sdp').value = JSON.stringify(answer);

}

const addAnswer = async () => {
    let ans = document.getElementById('answer-sdp').value;
    
    await peerConnection.setRemoteDescription(JSON.parse(ans));
}

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);


init()


