#Python 2.7

import sqlite3
import json


#Settings
with open('config.json') as config_file:
    config_data = json.load(config_file)
Globalsetting = config_data['Global'] 
  


database_filename = Globalsetting['database'] #"TherapyManager.db"

with open('config.json') as data_file:
    config = json.load(data_file)
conn=sqlite3.connect(database_filename, check_same_thread=False)
conn.execute('pragma foreign_keys=ON')



def dict_factory(cursor, row):
    """This is an function use to fonmat the json when retirve from the  myswl database"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


conn.row_factory = dict_factory

conn.execute('''CREATE TABLE if not exists accounts 
("userid"	TEXT,
"password"	TEXT,
"salt"	TEXT,
"email"	TEXT,
"name"	TEXT,
PRIMARY KEY("userid"));''')

conn.execute('''CREATE TABLE if not exists patient
(pat_id INTEGER PRIMARY KEY AUTOINCREMENT,
pat_first_name TEXT NOT NULL,
pat_last_name TEXT NOT NULL,
pat_insurance_no TEXT NOT NULL,
pat_ph_no TEXT NOT NULL,
pat_date DATE DEFAULT (datetime('now','localtime')),
pat_email TEXT NOT NULL,
"pat_dob"	DATE,
pat_address TEXT NOT NULL);''')

conn.execute('''CREATE TABLE if not exists doctor
(doc_id INTEGER PRIMARY KEY AUTOINCREMENT,
doc_first_name TEXT NOT NULL,
doc_last_name TEXT NOT NULL,
doc_ph_no TEXT NOT NULL,
doc_date DATE DEFAULT (datetime('now','localtime')),
doc_address TEXT NOT NULL);''')

conn.execute('''CREATE TABLE if not exists appointment
(app_id INTEGER PRIMARY KEY AUTOINCREMENT,
pat_id INTEGER NOT NULL,
doc_id INTEGER NOT NULL,
appointment_date DATE NOT NULL,
FOREIGN KEY(pat_id) REFERENCES patient(pat_id),
FOREIGN KEY(doc_id) REFERENCES doctor(doc_id));''')


conn.execute('''CREATE TABLE if not exists medrecords
( "rec_id"	INTEGER,
"pat_id"	INTEGER NOT NULL,
"create_date"	DATE NOT NULL,
"body"	TEXT,
FOREIGN KEY("pat_id") REFERENCES "patient"("pat_id"),
PRIMARY KEY("rec_id" AUTOINCREMENT));''')



conn.execute('''CREATE TABLE if not exists Patientfiles
("pat_id"	TEXT,
"filename"	TEXT,
"filepath"	TEXT,
"createdate" TEXT,
"userid"	TEXT);''')

conn.execute('''CREATE TABLE if not exists messages
("rec_id"	INTEGER,
"pat_id"	INTEGER NOT NULL,
"create_date"	DATE NOT NULL,
"message"	TEXT,
"app_id"	INTEGER,
"status"	INTEGER DEFAULT 0,
PRIMARY KEY("rec_id" AUTOINCREMENT));''')


conn.execute('''CREATE TABLE if not exists  pendingappointment
("app_id"	INTEGER,
"pat_id"	INTEGER NOT NULL,
"doc_id"	INTEGER NOT NULL,
"appointment_date"	DATE NOT NULL,
"status"	INTEGER DEFAULT 0,
FOREIGN KEY("doc_id") REFERENCES "doctor"("doc_id"),
FOREIGN KEY("pat_id") REFERENCES "patient"("pat_id"),
PRIMARY KEY("app_id" AUTOINCREMENT));''')


conn.execute('''CREATE TABLE if not exists recordstamplates
("rec_id"	INTEGER,
"create_date"	DATE NOT NULL,
"tamplate"	TEXT,
PRIMARY KEY("rec_id" AUTOINCREMENT));''')