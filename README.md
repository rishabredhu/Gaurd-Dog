# GaurdDog

Website: http://guarddog-website.s3-website-us-east-1.amazonaws.com/

## Introduction

As a part of the course Cloud Computing and Big Data Systems (CS-GY 9223), we have implemented a home security system that is designed to be scalable, reliable and flexible as the user base increases. These have been achieved with the help of various cloud based infrastructure provided by Amazon Web Services. Using a laptop and webcam, we were able to achieve the project’s main objective, hence teaching us how to apply theoretical knowledge to a practical real- world scenario. Through this project report, we will walk you through the motivation behind implementing this solution, the architecture and concepts that have gone into the implementation, and finally the expected behavior of the solution.

With the rise of technology, cheaper computing power has enabled the automation of various activities in our lives. One area that has seen considerable development has been that of security. While advanced security systems have historically been expensive and used by larger organizations, they are becoming a common sight in our homes due to their wider availability and cheaper maintenance. To protect a premises, you can either have personnel on the ground or have automated systems that use cameras and sensors. The issue with the former is that it includes the human element that brings in a host of other responsibilities such as ensuring their safety, scheduling shift, maintaining payroll and so on. With an automated system, we not only avoid the need for human intervention but are also able to tailor the system to our needs. Our implementation shows how one can develop their own solution with the use of third party cloud infrastructure and their laptop’s webcam while at the same time reducing the costs incurred.

Our solution involves a laptop’s webcam for monitoring intrusion into a room. The webcam is always on and as soon as a person enters its frame, the system will identify whether the person is a pre-saved known face or an unknown face. If it is a known face, no further action is taken. However if it's an unknown face, an alert is sent to the homeowner via email. If the intrusion continues, alerts are sent to the homeowner at regular intervals. We have a web interface that the user can use to manage their system. The homeowner can add and delete known faces and additionally assigned labels to faces such as a person’s name. They additionally have a page that contains the logs of activity over a span of time.

## Architecture 

We have developed two microservices, one microservice provides the User Interface (UI) and the other microservice is responsible for Video Surveillance. 
<p align="center">
  <img src="https://user-images.githubusercontent.com/50113394/209057634-287fdfb7-6d26-4d23-b552-6fa631e679ca.PNG" />
</p>

### Serverless API
<p align="center">
  <img src="https://user-images.githubusercontent.com/50113394/209057638-528bab37-bb99-46a1-a092-cefb9be43c70.PNG" />
</p>

### Video Surveillance
<p align="center">
  <img src="https://user-images.githubusercontent.com/50113394/209057641-1256eb11-45b9-4550-8047-c931ba5e4f1f.PNG" />
</p>

## API

1. /alerts : GET
- Retrieves alerts from the “Known Face” database
- Takes user_id as input

2. /alerts : PUT
- Deletes alerts from the“known face” and “unknown face” database
- Takes user_id as input

3. /knownface : GET
- Get a presigned URL which is used by the user to upload images onto S3 bucket.
- Takes user_id as input

4. /knownface /label : GET
- Retrieves the list of labels in the “Known Labels” database.
- Takes user_id as input

5. /knownface/label : POST
- Create a new label for a user
- Takes user_id and label name as input

6. /knownface/label/delete : POST
- Delete a label from the “Known Labels” database.
- Takes user_id and label name as input

## Frontend
<p align="center">
  <img src="https://user-images.githubusercontent.com/50113394/210946780-524da544-db48-488c-8abe-8acc30ff4a4d.png" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/50113394/210946814-8861bc1a-7085-4c5a-8f89-8378ceae99e9.png" />
</p>

## Steps to start video surveillance

```
1. git clone https://github.com/awslabs/amazon-kinesis-video-streams-producer-sdk-cpp && cd amazon-kinesis-video-streams-producer-sdk-cpp && git checkout 75087f5a90a02a47191c9278cfec329e09535e98

2. Inside mingw32 or mingw64 shell, go to kinesis-video-native-build directory and run ./min-install-script

3. aws rekognition create-stream-processor --region us-east-1 --cli-input-json file://run_rekognition_processor.json

4. aws rekognition start-stream-processor --name streamProcessorForRekognitionVideoBlog --region us-east-1

5. aws rekognition list-stream-processors --region us-east-

6. AWS_ACCESS_KEY_ID=<YourAccessKeyId> AWS_SECRET_ACCESS_KEY=<YourSecretAccessKey> ./kinesis_video_gstreamer_sample_app <stream_name>
```
