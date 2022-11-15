import json
import base64
from datetime import datetime
import boto3


def lambda_handler(event, context):

    step = boto3.client("stepfunctions")

    for record in event["Records"]:

        data = eval(base64.b64decode(record["kinesis"]["data"]))
        produce_timestamp = datetime.fromtimestamp(
            data["InputInformation"]["KinesisVideo"]["ProducerTimestamp"]).strftime("%m/%d/%Y, %H:%M:%S")
        print(produce_timestamp)

        if len(data["FaceSearchResponse"]) != 0:

            for facesearchresponse in data["FaceSearchResponse"]:

                if len(facesearchresponse["MatchedFaces"]) != 0:
                    for face in facesearchresponse["MatchedFaces"]:
                        item = dict()
                        item["detection"] = "MachedFaces"

                        item["userid"] = "eashankaushik"
                        item["label"] = face["Face"]["ExternalImageId"]
                        item["confidence"] = face["Face"]["Confidence"]
                        item["produce_timestamp"] = produce_timestamp

                        response = step.start_execution(
                            stateMachineArn='arn:aws:states:us-east-1:290851490523:stateMachine:MyStateMachine',
                            input=json.dumps(item)
                        )

                        print(f"Mached Face{response}")

                elif len(facesearchresponse["MatchedFaces"]) == 0:
                    item = dict()
                    item["detection"] = "UnMachedFaces"
                    item["produce_timestamp"] = produce_timestamp
                    item["userid"] = "eashankaushik"

                    response = step.start_execution(
                        stateMachineArn='arn:aws:states:us-east-1:290851490523:stateMachine:MyStateMachine',
                        input=json.dumps(item)
                    )
                    print(f"Un-Mached Face{response}")

    return {
        'statusCode': 200,
    }
