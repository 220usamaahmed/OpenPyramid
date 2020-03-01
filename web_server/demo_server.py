"""

Flask server that serves one test SVS File's Deep Zoom Image
The following calls can be made to this flask server:
	1. /slide/dzi
	2. /slide/tile/<int:level>/<int:col>_<int:row>.<format>

This file is called from main.py in the root directory.

"""

import os

with os.add_dll_directory(os.path.join(os.getcwd(), "dll_includes/openslide-win64-20171122/bin")):
	from openslide import open_slide
	from openslide.deepzoom import DeepZoomGenerator

from flask import Flask, abort, make_response
from io import BytesIO


SVS_FILE = "./svs_images/CMU-1.svs"

DEEPZOOM_FORMAT = "jpeg"
DEEPZOOM_TILE_SIZE = 254
DEEPZOOM_OVERLAP = 1
DEEPZOOM_LIMIT_BOUNDS = True
DEEPZOOM_TILE_QUALITY = 75


# Flask app
app = Flask(__name__)


# DZI Generator Global Variable
dzi_gen = None


@app.before_first_request
def load_slide():
	"""
	Runs before any request is made to load SVS 
	file into DZI Generator
	"""
	global dzi_gen

	slide = open_slide(SVS_FILE)
	dzi_gen = DeepZoomGenerator(slide, 
		tile_size=DEEPZOOM_TILE_SIZE, 
		overlap=DEEPZOOM_OVERLAP, 
		limit_bounds=DEEPZOOM_LIMIT_BOUNDS)


@app.route("/slide/dzi")
def dzi():
	"""
	Responds with DZI XML
	"""
	response = make_response(dzi_gen.get_dzi(DEEPZOOM_FORMAT))
	response.mimetype = "application/xml"
	return response


@app.route("/slide/tile/<int:level>/<int:col>_<int:row>.<format>")
def tile(level, col, row, format):
	format = format.lower()

	# Error Handling
	if format != "jpeg" and format != "png":
		abort(415, {
			"message": "Only JPEG and PNG are supported image formats for tiles."
			})

	if level < 0 or level > dzi_gen.level_count:
		abort(404, {
			"message": f"Level specified for the tile in invalid. There are {dzi_gen.level_count} levels in the DZI."
			})

	if col < 0 or col >= dzi_gen.level_tiles[level][0] or row < 0 or row >= dzi_gen.level_tiles[level][0]:
		abort(404, {
			"message": f"Row or Column specified for level {level} does not exist."
			})

	# Creating image and responding
	tile = dzi_gen.get_tile(level, (col, row))
	buff = BytesIO()
	tile.save(buff, format, quality=DEEPZOOM_TILE_QUALITY)
	response = make_response(buff.getvalue())
	response.mimetype = f"image/{format}"
	return response