
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
from datetime import datetime, timedelta, date, time
from dates import convert_date, convert_from_date
import json
import numpy as np

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
OJF_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'OJF')
SPD_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'SPD')

class JSONEncoder(json.JSONEncoder):

	def default(self, obj):
		if isinstance(obj, (datetime, date, time)):
			return obj.isoformat()
		elif isinstance(obj, timedelta):
			return (datetime.min + obj).time().isoformat()
		elif isinstance(obj, np.integer):
			return int(obj)
		elif isinstance(obj, np.floating):
			return float(obj)
		elif isinstance(obj, np.ndarray):
			return obj.tolist()
		return super(JSONEncoder, self).default(obj)

def convert_from(rid):
	print ('Processing Filename:', rid)
	osstat = os.stat(SPD_UPLOAD_FOLDER+f'/{rid}.spd')
	filesize =  osstat.st_size
	br = BinaryReader(SPD_UPLOAD_FOLDER+f'/{rid}.spd') 
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
				'start': convert_date(hdr_dict['start']),
				'finish': convert_date(hdr_dict['finish']),
				'localname': hdr_dict['localname'].decode("utf-8").strip(),
				'lng': hdr_dict['lat'],
				'lat': hdr_dict['lng'],
				'author': hdr_dict['author'].decode("utf-8").strip(),
				'location': hdr_dict['location'].decode("utf-8").strip(),
				'receiverDetails': None,
				'source': hdr_dict['source'].decode("utf-8").strip(),
				'calibrated': None,
				'observing': None,
				'timezone': 0,
				'channels': channels_plus_date-1,
				'version': 'v1.0'
			},
			'note': notes_tuple[0].decode('utf-8','ignore')
		}
		json_data['timestamps'] = [sample[0] for sample in data_list]
		
		if channels_plus_date-1 == 1:
			json_data['ch1'] = [sample[1] for sample in data_list]
		elif channels_plus_date-1 == 2:
			json_data['ch1'] = [sample[1] for sample in data_list]
			json_data['ch2'] = [sample[2] for sample in data_list]
		elif channels_plus_date-1 == 3:
			json_data['ch1'] = [sample[1] for sample in data_list]
			json_data['ch2'] = [sample[2] for sample in data_list]
			json_data['ch3'] = [sample[3] for sample in data_list]
		elif channels_plus_date-1 == 4:
			json_data['ch1'] = [sample[1] for sample in data_list]
			json_data['ch2'] = [sample[2] for sample in data_list]
			json_data['ch3'] = [sample[3] for sample in data_list]
			json_data['ch4'] = [sample[4] for sample in data_list]
		elif channels_plus_date-1 == 5:
			json_data['ch1'] = [sample[1] for sample in data_list]
			json_data['ch2'] = [sample[2] for sample in data_list]
			json_data['ch3'] = [sample[3] for sample in data_list]
			json_data['ch4'] = [sample[4] for sample in data_list]
			json_data['ch5'] = [sample[5] for sample in data_list]

		with open(os.path.join(OJF_UPLOAD_FOLDER, f'{rid}.json'), 'w') as outfile:
			json.dump(json_data, outfile, cls=JSONEncoder)
		return True
	except BinaryReaderEOFException: 
		# One of our attempts to read a field went beyond the end of the file. 
		return False
		

def convert_to(rid, data):
	br = BinaryWriter(SPD_UPLOAD_FOLDER+f'/{rid}.spd')
	header_format_string = '< 10s d d d d d d h 10s 20s 20s 40s h i';
	data_size = struct.calcsize(header_format_string)
	#Version Issue
	try:
		version_test = data['header']['version']
	except:
		data['header']['version'] = 'v1'
	# header_field_names = (
	# 		'version', 'start', 'finish', 'lat', 'lng', 'maxy', \
	# 		'miny', 'timezone', 'source', 'author', 'localname', \
	# 		'location', 'channels', 'notelength')
	# Notelength For Header
	data['header']['notelength'] = len(data['note'])
	formatted_header = []

	# Date Conversion
	start_dt = datetime.strptime(data['timestamps'][0], "%Y-%m-%dT%H:%M:%S.%f")
	start_serial = convert_from_date(start_dt)

	end_dt = datetime.strptime(data['timestamps'][-1], "%Y-%m-%dT%H:%M:%S.%f")
	end_serial  = convert_from_date(end_dt)

	max_y = max(data['ch1'])
	min_y = min(data['ch1'])

	spd_header = [
		bytes(data['header']['version'], encoding='utf-8'),
		start_serial,
		end_serial,
		data['header']['lat'],
		data['header']['lng'],
		max_y,
		min_y,
		0,
		bytes(data['header']['source'], encoding='utf-8'),
		bytes(data['header']['author'], encoding='utf-8'),
		bytes(data['header']['localname'], encoding='utf-8'),
		bytes(data['header']['location'], encoding='utf-8'),
		data['header']['channels'],
		data['header']['notelength']
	]

	br.writefields(header_format_string, spd_header)

	br.write('< {}s'.format(data['header']['notelength']), bytes(data['note'], encoding='utf-8'))
	
	

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

class BinaryWriter:
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
		self.file = open(fileName, 'wb')
		return;

	def write(self, data_format, data):
		packed_bytes = struct.pack(data_format, data)
		self.file.write(packed_bytes)

	def writefields(self, format_string, data):
		print(*data)
		packed_fields = struct.pack(format_string, *data)
		self.file.write(packed_fields)
		
		
# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
	with open(OJF_UPLOAD_FOLDER+'/f4165e24-5433-4ccd-b966-5b6445d58adb.json') as f:
		test_data = json.load(f)
	print(test_data['note'])
	print(test_data['header']['version'])
	convert_to('test', test_data)
	# convert_from('f4165e24-5433-4ccd-b966-5b6445d58adb')
	
