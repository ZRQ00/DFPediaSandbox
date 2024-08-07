# Sandbox for Deepfakepedia #
This is a flask application that can create and edit json files.

Features include:
- Save current JSON file
- Load new JSON file
- Add new item to local JSON
- Edit current item in local JSON
- HTML elements can be added to JSON file
- Clear current JSON file. 🛑**IMPORTANT**🛑 Function removes all current items in local JSON


# How to Run #
1. [**Install Flask**](https://flask.palletsprojects.com/en/3.0.x/installation/)
2. ``git clone https://github.com/ZRQ00/DFPediaSandbox.git``
3. Open your terminal in the sandbox's directory and type in ``python run.py``
4. Head to the local address given from the terminal. Usually [http://127.0.0.1:5000](http://127.0.0.1:5000)

# Usage #
### Save ###
Saves the local json to a new file located at ``../modules/filename.json``

### Load ###
Loads an existing json file that follows the following format:


    [{
    
        "text": "Example Text",
        "content": null
    },
    {
        "text": "Example Image",
        "content": {
            "type": "type",
            "filename": "static/uploads/filename"
        }
    }]

### Add ###
Adds a new item into local JSON.

The button opens a new window that contains:
- Text: text that goes into this field
- uploader: uploads an image, video, or audio file

### Edit ###
Edits a selected item in local JSON.

The button opens a new window similar to [Add](#add), the only difference is that the window is prefilled and is only used to change the current item.

# Pages #
Clicking on a page will replace the current contents showing in the main window with the content of the N-th item.
