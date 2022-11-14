var btnStart = document.getElementById("btn-start");
var btnStop = document.getElementById("btn-stop");
var btnCapture = document.getElementById("btn-capture");
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var snapshot = document.getElementById("snapshot");
var btnSave = document.getElementById("btn-save");
var label = document.getElementById("label");

// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
btnCapture.addEventListener("click", captureSnapshot);
btnSave.addEventListener("click", saveSnapshot);

var theBlob;
var apigClient = apigClientFactory.newClient();

// Start Streaming
function startStreaming() {
    // get();
    var mediaSupport = 'mediaDevices' in navigator;

    if (mediaSupport && null == cameraStream) {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (mediaStream) {

                btnStart.disabled = true;
                btnStop.disabled = false;
                btnCapture.disabled = false;
                btnCapture.disabled = false;

                cameraStream = mediaStream;

                stream.srcObject = mediaStream;

                stream.play();
            })
            .catch(function (err) {

                console.log("Unable to access camera: " + err);
            });
    }
    else {

        alert('Your browser does not support media devices.');

        return;
    }
}

// Stop Streaming
function stopStreaming() {

    if (null != cameraStream) {
        btnStart.disabled = false;
        btnStop.disabled = true;
        btnCapture.disabled = true;
        var track = cameraStream.getTracks()[0];

        track.stop();
        stream.load();

        cameraStream = null;
    }
}

function captureSnapshot() {

    if (null != cameraStream) {

        // create blob
        let canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 240;

        let context = canvas.getContext('2d');

        context.drawImage(stream, 0, 0, 240, 240);

        canvas.toBlob(function (blob) {
            theBlob = blob;
            // testDownload();
            btnSave.disabled = false;
            label.required = true;

        }, 'image/png');

        // put dynamic image

        var ctx = capture.getContext('2d');
        var img = new Image();

        ctx.drawImage(stream, 0, 0, 320, 240);

        img.src = capture.toDataURL("image/png");
        // img.width = 240;

        snapshot.innerHTML = '';

        snapshot.appendChild(img);

    }
}

function saveSnapshot() {

    if (label.value === '') {
        alert("Pass a label");
        return null;
    }

    console.log('blob', theBlob);

    postImage(theBlob);



    btnSave.disabled = true;

}

function testDownload() {
    // let link = document.createElement('a');
    // link.download = 'example.png';

    // link.href = URL.createObjectURL(theBlob);
    // link.click();

    // URL.revokeObjectURL(link.href);
}

function postImage(theBlob) {
    var params = {
        'userid': 'eashankaushik',
        'label': label.value
    };
    apigClient.knownfaceGet(params, {}, {})
        .then(function (result) {
            console.log('presignedurl success', result["data"]["url"]);
            var file = new File([theBlob], "", { type: 'image/png', lastModified: Date.now() });
            presigned_url = result["data"]["url"];
            const fileInput = document.getElementById("video-file");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;


            var config = {
                method: 'put',
                url: presigned_url,
                headers: {
                    'Content-Type': 'image/png'
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
            console.log('presignedurl error', result);
        });
}