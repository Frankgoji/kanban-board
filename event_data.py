#! /usr/bin/python3
# Communicates with Sqlite3 database and sends the event data back to the client
# in the form of a table

import cgi, cgitb, sqlite3

print("Content-type: text/html\n")
print("Hello world!")
