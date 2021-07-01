from datetime import datetime

def convert_date(serial):
	seconds = (serial - 25569) * 86400.0
	converted = datetime.utcfromtimestamp(seconds)
	return converted

def convert_from_date(dt):
	unix = (dt - datetime(1970,1,1)).total_seconds()
	converted = unix / 86400.0 + 25569
	return converted