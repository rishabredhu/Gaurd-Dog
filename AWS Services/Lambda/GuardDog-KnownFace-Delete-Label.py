import json
import boto3
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

    if "Item" not in response:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps('Label doesnt Exists')
        }

    response = db.delete_item(TableName=DYNAMO_TABLE_NAME, Key=item)

    print(f"delete_item{response}")

    delete_from_collection(userid, label)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Access-Control-Allow-Credentials': 'true'
        },
        'body': json.dumps('Label Deleted')
    }


def delete_from_collection(userid, label):
    rekognition = boto3.client('rekognition')
    if userid in rekognition.list_collections()["CollectionIds"]:
        response = rekognition.list_faces(CollectionId=userid)
        faceids = list()
        for face in response["Faces"]:
            if face["ExternalImageId"] == label:
                faceids.append(face["FaceId"])

        rekognition.delete_faces(CollectionId=userid, FaceIds=faceids)

    return
