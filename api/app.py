import os
from flask import Flask, request, make_response, jsonify
from uuid import uuid4
from werkzeug.utils import secure_filename
from audio import gen_np_arrays
from datetime import datetime, date, time, timedelta
import json
import numpy as np
from spd_lib import convert

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
WAV_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'uploads')
OJF_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'OJF')
SPD_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'SPD')

app = Flask(__name__)
app.config['WAV_UPLOAD_FOLDER'] = WAV_UPLOAD_FOLDER
app.config['OJF_UPLOAD_FOLDER'] = OJF_UPLOAD_FOLDER
app.config['SPD_UPLOAD_FOLDER'] = SPD_UPLOAD_FOLDER

@app.route('/ready')
def ready():
	return make_response(jsonify({'ready':True}),200)

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

@app.route('/upload', methods=['POST'])
def upload():
	rid = str(uuid4())
	file = request.files['spd']
	filename = secure_filename(f'{rid}.spd')
	file.save(os.path.join(app.config['SPD_UPLOAD_FOLDER'], filename))
	convert(rid)
	return make_response(jsonify({'message':'File succesfully uploaded','rid':rid}),200) 
		# return make_response(jsonify({'message':'Error uploading file'}),400)


@app.route('/recordings/upload',methods=['POST'])
def upload_recordings():
	try:
		rid = str(uuid4())
		recording_name = request.form['recording_name']
		author = request.form['author']
		observing = request.form['observing']
		receiver_details = request.form['receiver_details']
		receiver_location = request.form['receiver_location']
		calibrated = request.form['calibrated']
		recording_notes = request.form['recording_notes']
		longitude = request.form['long']
		latitude = request.form['lat']
		start = request.form['start']
		finish = request.form['finish']
		file = request.files['audio_data']
		filename = secure_filename(f'{rid}.wav')
		file.save(os.path.join(app.config['WAV_UPLOAD_FOLDER'], filename))
	except:
		return make_response(jsonify({'message':'Error uploading recording','error':'Form Data'}),400)
	
	start = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%fZ")
	finish = datetime.strptime(finish, "%Y-%m-%dT%H:%M:%S.%fZ")

	data, timestamps = gen_np_arrays(rid,start,finish)

	json_data = {
		'generated': True,
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
			'channels': 1
		},
		'note': recording_notes,
		'ch1': list(data),
		'timestamps': list(timestamps)
	}
	with open(os.path.join(app.config['OJF_UPLOAD_FOLDER'], f'{rid}.json'), 'w') as outfile:
		json.dump(json_data, outfile, cls=JSONEncoder)
	return make_response(jsonify({'message':'Recording succesfully uploaded','rid':rid}),200)

@app.route('/recordings/<rid>')
def recording(rid):
	f = open (os.path.join(app.config['OJF_UPLOAD_FOLDER'], f'{rid}.json'), "r")
	# Reading from file
	data = json.loads(f.read())
	return make_response(jsonify(data),200)
	
if __name__ == '__main__':
	app.run(debug=True,port=5000)