// Loads the JSON file
function loadJSON() {
    const fileInput = document.getElementById('file-input');
    fileInput.click(); // Trigger file input click event

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if(file.type !== 'application/json'){
            alert('File uploaded was not a json file, please try uploading a json file!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        fetch('./load', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Filename': filename
            }
        })
        .then(response => response.json())
        .then(data => {
            const filename = file.name.replace(/\.json$/, '');
            document.getElementById('filename').value = `${filename}`;
            document.getElementById('text-content').innerText = "Loaded Successfully!";
            localStorage.setItem('CurrentJsonFile', data);

            displayLoadedData(JSON.parse(data))
        })
        .catch(error => console.error('Error:', error));
    });
}

// Function to save JSON data to the server
function saveJSON() {
    // Retrieve the JSON data from localStorage
    const loadedJSON = localStorage.getItem('CurrentJsonFile');
    const filename = document.getElementById('filename').value;
    if(filename == ''){
        alert('Please enter the filename.');
        return;
    }
    const JSONparsed = JSON.parse(loadedJSON);
    if (loadedJSON) {
        // Send the JSON data and filename to the server using fetch API
        fetch('./save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename, data: JSONparsed }) // Include filename along with JSON data
        })
        .then(response => response.json())
        .then(data => {
            // Display success or error message based on server response
            if (data.success) {
                alert(data.success);
            } else {Wz
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        // Display an error message if no JSON data is available
        alert('No JSON data loaded. Please load JSON data first.');
    }
}
// When document is loaded, load json from local storage
document.addEventListener('DOMContentLoaded', () => {
    loadJSONFromLocalStorage();
    localStorage.removeItem('currentIndex');
});

// Function to load JSON from local storage
function loadJSONFromLocalStorage() {
    const jsonFromStorage = localStorage.getItem('CurrentJsonFile');
    if (jsonFromStorage) {
        const data = JSON.parse(jsonFromStorage);
        displayLoadedData(data);
    }
}

// Manage the type of item being displayed
function displayItem(item) {
    // Display text and content separately
    document.getElementById('text-content').innerHTML = item.text;

    if (item.content) {
        const contentType = item.content.type;
        const content = item.content.filename;

        if (contentType === 'image') {
            document.getElementById('media-content').innerHTML = `<img class="image" src="${content}" alt="Image">`;
        } else if (contentType === 'video') {
            document.getElementById('media-content').innerHTML = `<video src="${content}" controls></video>`;
        } else if (contentType === 'audio') {
            document.getElementById('media-content').innerHTML = `<audio src="${content}" controls></audio>`;
        } else {
            document.getElementById('media-content').innerText = ``;
        }
    } else {
        document.getElementById('media-content').innerText = 'No content';
    }
}

// Function to display loaded JSON data
function displayLoadedData(data) {
    const buttonsDiv = document.getElementById('pages');
    buttonsDiv.innerHTML = ''; // Clear existing buttons

    // Create a button for each item in the JSON data
    data.forEach((item, index) => {
        const button = document.createElement('button');
        button.classList.add('pages-button');
        button.textContent = `Page ${index + 1}`;
        button.addEventListener('click', () => {
            // Display the item content when the button is clicked
            displayItem(item);
            setCurrentIndex(index);
        });
        buttonsDiv.appendChild(button);
    });
}

function setCurrentIndex(index){
    localStorage.setItem('currentIndex', index)
}
// Show the modal popup
function openModal() {
    document.getElementById('addModal').style.display = 'block';
}

// Hide the modal popup
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

function clearModule(){
    localStorage.removeItem("CurrentJsonFile");
    const buttonsDiv = document.getElementById('pages');
    buttonsDiv.innerHTML = '';
    document.getElementById('text-content').innerHTML = '';
    document.getElementById('media-content').innerHTML = '';

}
// Add item when "Add Item" button is clicked
function addItem() {
    const text = document.getElementById('add-text');
    const fileInput = document.getElementById('add-media');
    const file = fileInput.files[0];

    // Construct item object
    const item = {
        text: text.value,
        content: file ? { type: file.type.split('/')[0], filename: "static/uploads/" + file.name } : null
    };
    text.value = '';
    let currentJsonFile = JSON.parse(localStorage.getItem('CurrentJsonFile')) || [];

    // Add the new item to the 'CurrentJsonFile'
    currentJsonFile.push(item);

    // Update 'CurrentJsonFile' in local storage
    localStorage.setItem('CurrentJsonFile', JSON.stringify(currentJsonFile));

    // Perform actions with the item (e.g., send to server, add to UI)
    // This is just a placeholder, you can customize it based on your requirements
    console.log('Item added:', item);

    // Save file to server
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch('./upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('File uploaded successfully:', data.filename);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
    
    fileInput.value = '';
    loadJSONFromLocalStorage()

    // Close the modal popup
    closeModal();
}

// Edits items from the local storage json file
// Takes page's existing elements and puts it into a window similar to add item
function openEditModal(){
    let currentIndex = localStorage.getItem('currentIndex');
    if (currentIndex){
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('edit-text').value = document.getElementById('text-content').innerHTML;
    } else {
        alert("Cannot edit nonexistent item! Please click on an item.");
        return;
    }
    
}

// Hide the modal popup
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Add item when "Add Item" button is clicked
function editItem() {
    const text = document.getElementById('edit-text');
    const fileInput = document.getElementById('edit-media');
    const file = fileInput.files[0];

    // Construct item object
    const item = {
        text: text.value,
        content: file ? { type: file.type.split('/')[0], filename: "static/uploads/" + file.name } : null
    };

    let currentJsonFile = JSON.parse(localStorage.getItem('CurrentJsonFile')) || [];
    let currentIndex = localStorage.getItem('currentIndex');

    // Change the item in 'CurrentJsonFile'
    if(currentIndex){
        currentJsonFile[currentIndex] = item;

        // Update 'CurrentJsonFile' in local storage
        localStorage.setItem('CurrentJsonFile', JSON.stringify(currentJsonFile));

        // Perform actions with the item (e.g., send to server, add to UI)
        // This is just a placeholder, you can customize it based on your requirements
        console.log('Item edited:', item);

        // Save file to server
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('./upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('File uploaded successfully:', data.filename);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
            // load the json again
        }
        loadJSONFromLocalStorage()
        displayItem(item);
    }

    // Close the modal popup
    closeEditModal();
}