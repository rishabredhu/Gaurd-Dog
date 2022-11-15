import json
import dateutil.tz
import boto3
from datetime import datetime

eastern = dateutil.tz.gettz('US/Eastern')
EXPIRES_IN = 3600


def lambda_handler(event, context):

    userid = event["queryStringParameters"]["userid"]
    label = event["queryStringParameters"]["label"]

    user_upload_timestamp = datetime.now(eastern).timestamp()

    s3 = boto3.client("s3", "us-east-1")

    presigned_url = s3.generate_presigned_url('put_object', Params={"Bucket": "guarddog-known-faces", "Key": f"users/{userid}/{user_upload_timestamp}.png", "Metadata": {
                                              'label': f"{label}"}, 'ContentType': 'image/png'}, ExpiresIn=EXPIRES_IN)

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        },
        "body": json.dumps({"url": presigned_url})

    }
