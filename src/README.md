# Development
The library is developed as part of a Flask application which emulates the presence of a DZI Folder.

## How to use
1. You need OpenSlide to open SVS Files and conver them to Deep Zoom Images. Download the windows binaries from their ![website](https://openslide.org/) and place them in the dll_includes folder.

2. Run the following command in the terminal to download the required Python packages for the web server.
```
pip install -r requirements.txt
```

3. Run the following command in the terminal to start the web server
```
python main.py
```
Go the the IP given in the output.