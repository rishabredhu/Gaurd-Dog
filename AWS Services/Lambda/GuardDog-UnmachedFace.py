import json
import boto3
from datetime import datetime

TIME_DIFF = 60
ALARM_DIFF = 600
EMAIL = "euphemis2437@gmail.com"
SENDER_EMAIL = 'ek3575@nyu.edu'


def lambda_handler(event, context):

    db = boto3.client('dynamodb')

    response = db.get_item(TableName="UnKnownFaces", Key={
                           "userid": {"S": event["userid"]}})

    if "Item" in response:
        db_item = response["Item"]

        db_timestamp = datetime.strptime(
            db_item["timestamp"]["SS"][-1], "%m/%d/%Y, %H:%M:%S")
        producer_timestamp = datetime.strptime(
            event["produce_timestamp"], "%m/%d/%Y, %H:%M:%S")

        diff_seconds = (producer_timestamp - db_timestamp).total_seconds()

        if TIME_DIFF < diff_seconds:
            db_item["timestamp"]["SS"].append(event["produce_timestamp"])

            print(response)
            db_alarm_timestamp = datetime.strptime(
                db_item["alarmed_timestamp"]["SS"][-1], "%m/%d/%Y, %H:%M:%S")

            diff_alarm_seconds = (producer_timestamp -
                                  db_alarm_timestamp).total_seconds()
            if ALARM_DIFF < diff_alarm_seconds:
                send_email(event["produce_timestamp"])

                db_item["alarmed_timestamp"]["SS"].append(
                    event["produce_timestamp"])

            response = db.put_item(TableName="UnKnownFaces", Item=db_item)

    else:
        item = dict()

        item["userid"] = {"S": event["userid"]}
        item["timestamp"] = {"SS": [event["produce_timestamp"]]}
        item["alarmed_timestamp"] = {"SS": [event["produce_timestamp"]]}
        response = db.put_item(TableName="UnKnownFaces", Item=item)
        send_email(event["produce_timestamp"])
        print(response)

    return {
        'statusCode': 200,
    }


def send_email(producer_timestamp):
    ses = boto3.client('ses')

    if not verify_identity(EMAIL):
        return

    charset = "UTF-8"

    subject = f"Unknown Face Detected"
    body_text = f"Unknown Face Detected at {producer_timestamp}"

    response = ses.send_email(Source=SENDER_EMAIL,
                              Destination={
                                  'ToAddresses': [
                                      EMAIL,
                                  ],
                              }, Message={
                                  'Subject': {
                                      'Data': subject,
                                      'Charset': charset
                                  },
                                  'Body': {
                                      'Text': {
                                          'Data': body_text,
                                          'Charset': charset
                                      }
                                  }
                              },
                              )

    print(f"SES response: {response}")

    return response


def verify_identity(contact):

    ses = boto3.client('ses')
    verified_emails = ses.list_verified_email_addresses()

    print(verified_emails["VerifiedEmailAddresses"])

    if contact in set(verified_emails["VerifiedEmailAddresses"]):
        return True

    response = ses.verify_email_identity(
        EmailAddress=contact)

    return False
