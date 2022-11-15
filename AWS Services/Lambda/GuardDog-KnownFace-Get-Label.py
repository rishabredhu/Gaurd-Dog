import json
import boto3

DYNAMO_TABLE_NAME = "KnownLabels"


def lambda_handler(event, context):
    db = boto3.client('dynamodb', 'us-east-1')

    userid = event["queryStringParameters"]["userid"]

    item = {
        'userid': {
            'AttributeValueList': [
                {
                    'S': userid,
                },
            ],
            'ComparisonOperator': "EQ"

        }
    }
    response = db.scan(TableName=DYNAMO_TABLE_NAME,
                       AttributesToGet=["label"], ScanFilter=item)

    labels = list()

    if response["Count"] == 0:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps(labels)
        }

    for found_items in response["Items"]:
        labels.append(found_items["label"]["S"])

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps(labels)
    }
