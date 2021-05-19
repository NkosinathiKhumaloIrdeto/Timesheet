import requests
import json
import datetime

url_names = "http://localhost:8019/users/getUsers"
url_query = "http://localhost:8019/data/getByNameReport/"

names = []
processed_names = []
str_names = ""
now = datetime.datetime.now()


def query_db(username):

    global url_query

    global str_names

    try:
        queryReport = requests.get(url_query + username)

        if queryReport.status_code == 200:

            print(queryReport.text)

            str_names += username + "; "
            # processed_names.append(username)

        else:

            print("Unable to query timesheets for: " + username)

            writeLog("Error, query timesheets for: " + username)

    except Exception as error:

        print("Unable to query timesheets for: " + format(error))

        writeLog("Error, " + format(error))


def writeLog(str_string):

    global now

    log_file = open("./timesheets_reporting_log.txt", "a")

    log_file.write(str(now) + ": " + str_string + "\n")

    log_file.close()


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

            writeLog(
                "Success, process complete for the following people: " + str_names)

        elif response.status_code == 404:

            print('Not Found.')

            writeLog("Error, unable to connect to: " + url_names)

    except Exception as error:

        writeLog("Error, " + format(error))


run_process()
