import json
import boto3


def lambda_handler(event, context):
    userid = event["queryStringParameters"]["userid"]
    db = boto3.client('dynamodb', 'us-east-1')
    if "null" in event["queryStringParameters"]["label"]:
        # delte unknown face
        item = dict()
        item["userid"] = {"S": userid}
        response = db.delete_item(
            TableName="UnKnownFaces",
            Key=item
        )

        print(f"Delete unknown face alerts: {response}")
    else:
        # delete known face
        label = event["queryStringParameters"]["label"]

        item = dict()
        item["userid"] = {"S": userid}
        item["label"] = {"S": label}
        response = db.delete_item(
            TableName="KnownFaces",
            Key=item
        )

        print(f"Delete known face alerts: {response}")

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        }
    }
