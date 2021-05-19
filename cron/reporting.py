import requests
import json
import datetime
import mysql.connector

url_names = "http://localhost:8019/users/getUsers"
url_query = "http://localhost:8019/data/getByNameReport/"

names = []
processed_names = []
str_names = ""
now = datetime.datetime.now()

server = "localhost"
database = "timesheets"
username = "root"
password = ""

mm_server = "10.29.103.238"

def query_db(username):

    global url_query

    global str_names

    try:
        queryReport = requests.get(url_query + username)

        if queryReport.status_code == 200:

            print(queryReport.text)

            res = json.loads(queryReport.text)

            if res["status"] == 0:

                str_names += username + ", hours: " + str(res["total"]) + "\n" 
            
            # processed_names.append(username)

        else:

            print("Unable to query timesheets for: " + username)

            writeLog("Error, query timesheets for: " + username)

    except Exception as error:

        print("Unable to query timesheets for: " + format(error))

        writeLog("Error - query_db, " + format(error))

def writeLog(str_string):

    global now

    log_file = open("./timesheets_reporting_log.txt", "a")

    log_file.write(str(now) + ": " + str_string + "\n")

    log_file.close()


def prepNotification():

    
    global server
    global database
    global username
    global password
    global str_names

    #email
    mailTo = ""
    mailSubject = ""
    mailBody = ""

    try:

        sql = "SELECT * FROM config_emails_report WHERE ID = 423423" 

        mediamanager = mysql.connector.connect(
            host=server,
            user=username,
            passwd=password,
            database=database
        )

        print("Connection successfull")

        cursor = mediamanager.cursor()
        cursor.execute(sql)
        email_config = cursor.fetchall()    

        print(email_config)

        if len(email_config) > 0:

            for row in email_config:

                mailTo = row[2]
                mailBody = row[3] + "\n" + str_names
                mailSubject = row[1]
            
            #mailBody = mailBody.replace("*NAME*","Nkosinathi")

            print(mailBody)

            send_mail(mailBody,mailSubject,mailTo)

    except mysql.connector.Error as error:

        print(format(error))

        writeLog("Error - prepNotification, " + format(error))    

def send_mail(message, subject, mailto):

    global mm_server

    url = "http://" + mm_server + "/jbpm/ws/rs/process/com.irdeto.jumpstart.workflow.SendMail/start"
    content_type = {"Content-Type": "application/json"}
    #emailSubject emailRecepients emailBody

    payload = [
        {"name":"emailBody","value":message},
        {"name":"emailSubject","value":subject},
        {"name":"emailRecepients","value":mailto}        
    ]   

    mail = requests.post(url, data = json.dumps(payload), headers=content_type)

    print(mail)

    if mail.status_code == 200:
        print("Sent!")
    else:
        print("fail")

def run_process():

    global url_names

    global names

    global str_names

    try:

        response = requests.get(url_names)

        if response.status_code == 200:

            names = json.loads(response.text)

            for todo in names:

                query_db(todo["username"])

            if str_names != "":

                prepNotification()

            writeLog(
                "Success, process complete for the following people: " + str_names)

        elif response.status_code == 404:

            print('Not Found.')

            writeLog("Error - run_process, unable to connect to: " + url_names)

    except Exception as error:

        writeLog("Error - run_process, " + format(error))


run_process()
#sendNotification()

