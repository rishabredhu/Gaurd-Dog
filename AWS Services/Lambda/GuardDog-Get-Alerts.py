import json
import boto3


def lambda_handler(event, context):
    data = dict()
    data["knownFaces"] = list()
    data["unkownFaces"] = list()

    db = boto3.client('dynamodb', 'us-east-1')

    userid = event["queryStringParameters"]["userid"]

    scan_item = {
        'userid': {
            'AttributeValueList': [
                {
                    'S': userid,
                },
            ],
            'ComparisonOperator': "EQ"

        }
    }
    response = db.scan(TableName="KnownFaces", ScanFilter=scan_item)
    for item in response["Items"]:
        data["knownFaces"].append(
            {"label": item["label"]["S"], "detect_timestamp": item["timestamp"]["SS"][-3:]})

    response = db.scan(TableName="UnKnownFaces", ScanFilter=scan_item)
    for item in response["Items"]:
        data["unkownFaces"].append({"alarm_timestamp": item["alarmed_timestamp"]
                                   ["SS"][-3:], "detect_timestamp": item["timestamp"]["SS"][-3:]})

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps(data)
    }
