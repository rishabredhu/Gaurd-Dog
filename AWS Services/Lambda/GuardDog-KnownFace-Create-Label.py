import json
import boto3
from datetime import datetime

DYNAMO_TABLE_NAME = "KnownLabels"


def lambda_handler(event, context):
    db = boto3.client('dynamodb', 'us-east-1')

    userid = event["queryStringParameters"]["userid"]
    label = event["queryStringParameters"]["label"]

    item = dict()
    item["userid"] = {"S": userid}
    item["label"] = {"S": label}

    response = db.get_item(TableName=DYNAMO_TABLE_NAME, Key=item)
    print(f"get_item: {response}")
    if "Item" in response:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps('Query Exists')
        }

    item = dict()
    item["userid"] = {"S": str(userid)}
    item["insertedAtTimestamp"] = {
        "S": datetime.now().strftime("%d-%m-%Y %H:%M:%S")}
    item["label"] = {"S": label}

    response = db.put_item(TableName=DYNAMO_TABLE_NAME, Item=item)

    print(f"put_item: {response}")

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps('Query Added')
    }
