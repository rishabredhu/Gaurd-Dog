let mediaRecorder;
let recordedBlobs;
var theStream;
var timeout;

var apigClient = apigClientFactory.newClient();
var firstVideo = true

const startButton = document.getElementById("start-video");
const stopButton = document.getElementById("stop-video");
const video = document.getElementById("user-video");
/*
start and stop button for starting stream
*/

function handleSuccess(stream) {
    startButton.disabled = true;
    stopButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    // const video = document.getElementById("user-video");
    // const gumVideo = document.querySelector('video#gum');
    video.srcObject = stream;
    theStream = stream;
    startRecording();
}

function handleError(error) {
    if (error.name === 'OverconstrainedError') {
        const v = constraints.video;
        alert(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'NotAllowedError') {
        alert('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    } else {
        alert(`getUserMedia error: ${error.name}`, error);
    }
}

async function init(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        handleError(e);
    }
}

function stopStream() {
    clearTimeout(timeout);
    saveFiveSecondRecording()
    theStream.getTracks().forEach(track => track.stop());
    startButton.disabled = false;
    stopButton.disabled = true;
}

startButton.addEventListener('click', async () => {
    const constraints = {
        audio: false,
        video: true
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});

stopButton.addEventListener('click', stopStream)

/* 
Media Recordings
*/

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function saveFiveSecondRecording() {
    var blob = new Blob(recordedBlobs, { type: 'video/mkv' });


    if (firstVideo === true) {
        firstVideo = false;
    } else {
        // testDownload(blob)


        var params = {
            "userid": "eashankaushik"
        };
        apigClient.uploadStreamGet(params, {}, {})
            .then(function (result) {
                console.log('presignedurl success', result)

                presigned_url = result["data"]["url"]
                var file = new File([blob], "hello.mkv", { type: 'video/mkv', lastModified: Date.now() });
                const fileInput = document.getElementById("video-file");
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                // fileInput.files[0]
                var config = {
                    method: 'put',
                    url: presigned_url,
                    headers: {
                        'Content-Type': 'video/mkv'
                    },
                    data: fileInput.files[0]
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));

                    }).catch(function (result) {
                        console.log('presignedurl error', result)
                    });


            }).catch(function (result) {
                console.log('presignedurl error', result)
            });



    }


}
function testDownload(blob) {
    // const url = window.URL.createObjectURL(blob);

    // console.log('url', url)

    // const a = document.createElement('a');
    // a.style.display = 'none';
    // a.href = url;
    // a.download = 'test.mkv';
    // document.body.appendChild(a);
    // a.click();

    // setTimeout(() => {
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    // }, 100);
}

function startRecording() {
    recordedBlobs = [];
    const options = { mimeType: "video/webm;codecs=vp9,opus" };

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        handleError(e);
        return;
    }


    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
    timeout = setTimeout(stopRecording, 12000)
}

function stopRecording() {
    saveFiveSecondRecording()
    mediaRecorder.stop();
    startRecording()
}

// https://gaurddog-streaming.s3.amazonaws.com/users/eashankaushik/1668045315.mkv?AWSAccessKeyId=ASIASKFX33IYI4MP2CHL&Signature=Zvxmoie%2Fs1edaI2G5TKGvZ2kTj8%3D&x-amz-meta-producer_start_timestamp=1668045315.81178&x-amz-security-token=FwoGZXIvYXdzEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDFhAy093IEe3ijX5eyKsAoTiXtZB8zfoSZa8f6woKmpv%2FzhwEyrMDqSafQU3BsvWTM6nQtEfIg4XgbSRXR5kXxQyOJl9j7uwGtOjIwXUfQbHLkOtJc%2BU8HUoWu4oBAs6Qs9HOWf%2F48US3XEZdbtXKGaDiW8uvwB8tp3vs%2B01lYql4bsdyaQ3JGOQvkhmS9ogNuE36dF9rm3sH9yKQ8RZ1CFZxbeSsy1AEVFn1QoET2g4D%2F%2F2QjqhqXffutmYulfh8FAVUSXSwXa7E0oNVkn%2F85a%2FTM77AdJRajBUdQWiz8D8WWxQdWIEsw5e8tAfPEkmNpeOcuSS6x9KH%2FR4MTc9LZip9dTDtne0iznNlP4WJZPDVp%2B12CAbzeJqsP%2BVcJ4Kv358deIliN51vIYu%2FBDXx81fPxd%2BLpuSnayb0yj8sbGbBjItwCCWGjyh5geZ7ugTXftCfm0dfLWhvXG7041npYpU2FUglBtRz8jj9i20Mj6Z&Expires=1668045415
// Face Search Response: 
