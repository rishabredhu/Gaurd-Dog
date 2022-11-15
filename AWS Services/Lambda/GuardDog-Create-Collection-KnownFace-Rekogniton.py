import json
import boto3


def lambda_handler(event, context):

    rekognition = boto3.client("rekognition", "us-east-1")
    s3 = boto3.client("s3", "us-east-1")

    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        userid = key.split("/")[1]
        object_metadata = s3.head_object(
            Bucket=bucket, Key=key)

        label = object_metadata["ResponseMetadata"]["HTTPHeaders"]["x-amz-meta-label"]

        print(f"x-amz-meta-label: {label}")

        collections = rekognition.list_collections()

        if userid not in collections['CollectionIds']:
            create_user_collection(userid, rekognition)
        else:
            print(f"collection already exists with collectionID: {userid}")

        image = {
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        }
        response = rekognition.index_faces(
            CollectionId=userid, Image=image, MaxFaces=2, ExternalImageId=label)

        print(f"Add face response: {response}")

    return {
        'statusCode': 200,
        'body': json.dumps('Image added to collection')
    }


def create_user_collection(userid, rekognition):
    response = rekognition.create_collection(
        CollectionId=userid,
        Tags={
            "face": "0"
        }
    )

    print(f"Create Collection Response: {response}")
