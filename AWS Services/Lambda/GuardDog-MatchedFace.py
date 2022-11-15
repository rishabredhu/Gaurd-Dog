import json
import boto3
from datetime import datetime

TIME_DIFF = 60


def lambda_handler(event, context):

    db = boto3.client('dynamodb')

    response = db.get_item(TableName="KnownFaces", Key={"userid": {
                           "S": event["userid"]}, "label": {"S": event["label"]}})

    if "Item" in response:
        # update old item

        db_item = response["Item"]

        db_timestamp = datetime.strptime(
            db_item["timestamp"]["SS"][-1], "%m/%d/%Y, %H:%M:%S")
        producer_timestamp = datetime.strptime(
            event["produce_timestamp"], "%m/%d/%Y, %H:%M:%S")

        diff_seconds = (producer_timestamp - db_timestamp).total_seconds()

        if TIME_DIFF < diff_seconds:
            db_item["timestamp"]["SS"].append(event["produce_timestamp"])

            response = db.put_item(TableName="KnownFaces", Item=db_item)

            print(response)

    else:
        # add a new item
        item = dict()

        item["userid"] = {"S": event["userid"]}
        item["timestamp"] = {"SS": [event["produce_timestamp"]]}
        item["label"] = {"S": event["label"]}
        item["confidence"] = {"S": str(event["confidence"])}
        response = db.put_item(TableName="KnownFaces", Item=item)

        print(response)

    return {
        'statusCode': 200
    }
