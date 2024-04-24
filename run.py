from flask import Flask, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
import os
import json

app = Flask(__name__)

# Route to render the HTML template
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle the file upload and return JSON data
@app.route('/load', methods=['POST'])
def load():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        try:
            file_content = file.read().decode('utf-8')
            return jsonify(file_content)
        
        except Exception as e:
            return jsonify({'error': f'Failed to read file: {str(e)}'})
        

    return jsonify({'error': 'File upload failed'})

# Route to save JSON data from local storage to the server
@app.route('/save', methods=['POST'])
def save():
    data = request.json

    if data:
        filename = data['filename'] + '.json'  # Get the filename from the JSON data
        filepath = os.path.join('modules', filename)
        with open(filepath, 'w') as f:
            json.dump(data['data'], f, indent=4)
            

        return jsonify({'success': 'JSON data saved successfully to ' + filepath, 'file': filename})

    return jsonify({'error': 'No JSON data provided'})

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('static', 'uploads', filename)
        filename2 = filepath
        file.save(filepath)
        return jsonify({'success': True, 'filename': filename2})

    return jsonify({'error': 'File upload failed'})

if __name__ == '__main__':
    app.run(debug=True)