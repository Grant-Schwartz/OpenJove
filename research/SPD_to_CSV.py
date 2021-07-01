
'''
This example reads a Radio Skypipe data file, with single data channel (the default)
This reads and prints the raw header info, and then reads and displays the first 
	1000 time/value records
	
Note: command line argument is the file spec.
'''


'''
Type SkyPipeHeader
	 version As String * 10
	 Start As Double 
	 Finish As Double
	 Lat As Double
	 Lng As Double
	 MaxY As Double
	 MinY As Double
	 TimeZone As Integer
	 Source As String * 10
	 Author As String * 20
	 LocalName As String * 20
	 Location As String * 40
	 Channels As Integer
	 NoteLength As Long
 End Type
 '''



import struct
import sys
import os
import csv
import math
from datetime import datetime, timedelta
from dates import convert_date

def convert(rid,spd):
	filename = spd
	print ('Processing Filename:', filename)
			
	br = BinaryReader(filename) 
	try:
		# read the header
		# https://docs.python.org/3/library/struct.html

		length = 0

		header_field_names = (
			'version', 'start', 'finish', 'lat', 'lng', 'maxy', \
			'miny', 'timezone', 'source', 'author', 'localname', \
			'location', 'channels', 'notelength')
				
		# read header 
		format_string = '< 10s d d d d d d h 10s 20s 20s 40s h i';
		data_size = struct.calcsize(format_string)
		length += data_size
		header_tuple = br.readfields(format_string, data_size)
		
		hdr_dict = dict(zip(header_field_names, header_tuple))
	
		# for k, v in hdr_dict.items():
		#    print (k, v)
		
		# read notes
		notelength = hdr_dict.get('notelength')
		length += notelength
		format_string = '< %is' % (notelength)
		
		# print notes
		# ***** DO NOT COMMENT OUT THE LINE BELOW!!! IT MESSES WITH THE DATES AND VALUES! *****
		notes_tuple = br.readfields(format_string, notelength)
		# notes = 'Notes: %s' % (notes_tuple[0])
		# print(notes)
		
		# read data
		record_count = (filesize - length)/((int(hdr_dict.get('channels'))+1)*8);
		# print ('Record count: ', record_count)
		
		# Count for number of data (time/value) seen
		count = 1
		
		# Create list to hold time and data values
		data_list = []

		
		int_record_count = int(record_count)
		# print("Number of Samples: %f" %int_record_count)

		channels_plus_date = int(hdr_dict.get('channels'))+1
			  
		############################################################
		# Test code
		
		# We get the *4 from:
		# 790713/197678 = 4
		# where 790713 = int_record_count
		# and 197678 = was the final count gotten without the *4
		record_format_num = int(int_record_count * channels_plus_date)
		record_format_str = str(record_format_num)
		
		format_string = '< '+ record_format_str + 'd'

		data_tuple = br.readfields(format_string, record_format_num*8)
		for x in range(0, record_format_num, channels_plus_date):
			date = convert_date(data_tuple[x])
			if channels_plus_date == 2:
				data = [date,data_tuple[x+1]]
			elif channels_plus_date == 3:
				data = [date,data_tuple[x+1],data_tuple[x+2]]
			elif channels_plus_date == 4:
				data = [date,data_tuple[x+1],data_tuple[x+2],data_tuple[x+3]]
			elif channels_plus_date == 5:
				data = [date,data_tuple[x+1],data_tuple[x+2],data_tuple[x+3],data_tuple[x+4]]
			elif channels_plus_date == 6:
				data = [date,data_tuple[x+1],data_tuple[x+2],data_tuple[x+3],data_tuple[x+4],data_tuple[x+5]]

			data_list.append(data)
			count = count + 1

		
		# If the amount of records does not match the found records print error!
		if (int_record_count != count-1):
			print("***** Warning! The amount of records initially found does not match the amount of counted records *****")
		
		
		json_data = {
			'generated': False,
			'header': {
				'rid': rid,
				'start': start,
				'finish': finish,
				'localname': 'OpenJove',
				'lng': float(longitude),
				'lat': float(latitude),
				'author': author,
				'location': receiver_location,
				'receiverDetails': receiver_details,
				'source': '',
				'calibrated': calibrated,
				'observing': observing,
				'timezone': 0,
				'channels': channels_plus_date-1
			},
			'note': recording_notes,
			'ch1': list(data),
			'timestamps': list(timestamps)
		}
				
			
	
	except BinaryReaderEOFException: 
		# One of our attempts to read a field went beyond the end of the file. 
		print ('Error: File seems to be corrupted.')
		

	




class BinaryReaderEOFException(Exception):
	def __init__(self):
		pass
	def __str__(self):
		return 'Not enough bytes in file to satisfy read request'

class BinaryReader:
	# Map well-known type names into struct format characters.
	typeNames = {
		'int8'   :'b',
		'uint8'  :'B',
		'int16'  :'h',
		'uint16' :'H',
		'int32'  :'i',
		'uint32' :'I',
		'int64'  :'q',
		'uint64' :'Q',
		'float'  :'f',
		'double' :'d',
		'char'   :'s'
	}

	# class constructor
	def __init__(self, fileName):
		#print('BinaryReader Constructor...')
		self.file = open(fileName, 'rb')
		return;

	# read a piece of data    
	def read(self, typeName):
		typeFormat = BinaryReader.typeNames[typeName.lower()]
		typeSize = struct.calcsize(typeFormat)
		value = self.file.read(typeSize)
		if typeSize != len(value):
			raise BinaryReaderEOFException
		return struct.unpack(typeFormat, value)[0]

	# read a bunch of fields at once
	def readfields(self, format_string, size):
		# see https://docs.python.org/3/library/struct.html  
		data = self.file.read(int(size))
		datalist = struct.unpack(format_string, data)

		return datalist


	def __del__(self):
		#print('BinaryReader Destructor...')
		self.file.close()

		
# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
	convert('1514055732ULTI.spd')
	
