import os
import scipy.io.wavfile as wavfile
import wave
from matplotlib import pyplot as plt
import numpy as np

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'uploads')

def gen_np_arrays(rid,start,finish):
	file = wave.open(os.path.join(UPLOAD_FOLDER, f'{rid}.wav'))
	samples = file.getnframes()
	audio = file.readframes(samples)

	data = np.frombuffer(audio, dtype=np.int16)
	audio_data = np.absolute(data)

	delta = ((finish-start) / len(data))
	timestamps = np.array([start+delta*sample for sample in range(len(data))])

	return audio_data, timestamps