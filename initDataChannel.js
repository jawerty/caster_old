var iceServers = {
    iceServers: [{
        url: 'stun:stun.l.google.com:19302'
    }]
};

var optionalRtpDataChannels = {
    optional: []
};

var offerer = new webkitRTCPeerConnection(iceServers, optionalRtpDataChannels),
    answerer, answererDataChannel;

var offererDataChannel = offerer.createDataChannel('RTCDataChannel', {
    reliable: true
});

setChannelEvents(offererDataChannel, 'offerer');

offerer.onicecandidate = function (event) {
    if (!event || !event.candidate) return;
    answerer && answerer.addIceCandidate(event.candidate);
};

var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true, // Hmm!!
        OfferToReceiveVideo: true // Hmm!!
    }
};

offerer.createOffer(function (sessionDescription) {
    offerer.setLocalDescription(sessionDescription);
    createAnswer(sessionDescription);
}, null, mediaConstraints);

function createAnswer(offerSDP) {
    answerer = new webkitRTCPeerConnection(iceServers, optionalRtpDataChannels);
    answererDataChannel = answerer.createDataChannel('RTCDataChannel', {
        reliable: true
    });

    setChannelEvents(answererDataChannel, 'answerer');

    answerer.onicecandidate = function (event) {
        if (!event || !event.candidate) return;
        offerer && offerer.addIceCandidate(event.candidate);
    };

    answerer.setRemoteDescription(offerSDP);
    answerer.createAnswer(function (sessionDescription) {
        answerer.setLocalDescription(sessionDescription);
        offerer.setRemoteDescription(sessionDescription);
    }, null, mediaConstraints);
}

function setChannelEvents(channel, channelNameForConsoleOutput) {
    channel.onmessage = function (event) {
        console.debug(channelNameForConsoleOutput, 'received a message:', event.data);
        var data = JSON.parse(event.data);

        chunkData = []
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
              chunkData.push(data[key]);  
            }
        }
        
        console.log(chunkData);
        onData(chunkData); 
        if (channelNameForConsoleOutput == "answerer") {
            
            arrayToStoreChunks.push(data.message); // pushing chunks in array

            if (data.last) {
                console.log("saveToDisk")
                saveToDisk(arrayToStoreChunks.join(''), data.fileName);
                arrayToStoreChunks = []; // resetting array
            }

        } else if (channelNameForConsoleOutput == "offerer") {
            
        }
    };

    channel.onopen = function () {
        channel.send('Channel opened');
    };
    channel.onclose = function (e) {
        console.error(e);
    };
    channel.onerror = function (e) {
        console.error(e);
    };
}
