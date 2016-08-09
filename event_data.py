#! /usr/bin/python3
# Communicates with Sqlite3 database

import cgi, cgitb, sqlite3, datetime

conn = sqlite3.connect('events.db')
c = conn.cursor()

try:
    c.execute('select * from events')
except sqlite3.OperationalError as oe:
    c.execute('create table events (date date, column text, title text, description text)')
    c.execute('select * from events')

print("Content-type: text/html\n")

base_table = """
<table style='width:100%;border-collapse:collapse' border=1>
    <col style='width:20%;background-color:#80FF80'>
    <col style='width:20%;background-color:#FFFF66'>
    <col style='width:20%;background-color:#FF6666'>
    <col style='width:20%;background-color:#FF944D'>
    <col style='width:20%;background-color:#C2C2A3'>
    <tr>
        <th style='background-color:#99FF99'>Do Pool</th>
        <th style='background-color:#FFFF80'>Longterm</th>
        <th style='background-color:#FF8080'>High Priority</th>
        <th style='background-color:#FFA366'>Doing</th>
        <th style='background-color:#CCCCB2'>Done</th>
    </tr>
"""
print(base_table)

# TODO: execute necessary functions

print('</table>')

conn.commit()
conn.close()
