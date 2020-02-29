import os

with os.add_dll_directory(os.path.join(os.getcwd(), "openslide-win64-20171122/bin")):
	import openslide
	from openslide import ImageSlide, open_slide
	from openslide.deepzoom import DeepZoomGenerator

from flask import Flask, abort, make_response, render_template, url_for
from io import BytesIO


DEEPZOOM_SLIDE = None
DEEPZOOM_FORMAT = "jpeg"
DEEPZOOM_TILE_SIZE = 254
DEEPZOOM_OVERLAP = 1
DEEPZOOM_LIMIT_BOUNDS = True
DEEPZOOM_TILE_QUALITY = 75
SLIDE_NAME = "slide"

SVS_FILE = "svs_images/CMU-1.svs"

dzi_gen = None # Maybe use app config to save this 

app = Flask(__name__)


class PILBytesIO(BytesIO):
	def fileno(self):
		'''Classic PIL doesn't understand io.UnsupportedOperation.'''
		raise AttributeError('Not supported')


@app.before_first_request
def load_slide():

	global dzi_gen

	# Loading SVS file into DZI Generator
	slide = open_slide(SVS_FILE)
	dzi_gen = DeepZoomGenerator(slide, 
		tile_size=DEEPZOOM_TILE_SIZE, 
		overlap=DEEPZOOM_OVERLAP, 
		limit_bounds=DEEPZOOM_LIMIT_BOUNDS)


@app.route("/slide.dzi")
def dzi():
	resp = make_response(dzi_gen.get_dzi(DEEPZOOM_FORMAT))
	resp.mimetype = "application/xml"
	return resp


@app.route("/")
def index():
	return "Open Paramid"


@app.route("/<int:level>/<int:col>_<int:row>.<format>")
def tile(level, col, row, format):
	format = format.lower()
	if format != 'jpeg' and format != 'png':
		# Not supported by Deep Zoom
		abort(404)

	tile = dzi_gen.get_tile(level, (col, row))

	buf = PILBytesIO()
	tile.save(buf, format, quality=DEEPZOOM_TILE_QUALITY)
	resp = make_response(buf.getvalue())
	resp.mimetype = f"image/{format}"
	return resp


if __name__ == '__main__':
	app.run()