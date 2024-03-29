// Initialize a counter to keep track of the number of paragraphs created
let paragraphCounter = 2;

// Imports
const { open, save } = window.__TAURI__.dialog;
const { readTextFile } = window.__TAURI__.fs;
const { invoke } = window.__TAURI__.tauri

// constants refering to the elements of our UI
const butt = document.getElementById("openButton");
const container = document.getElementById("paragraphs");
const editor = document.getElementById('p1');


// Variable storing the path of the currently open file
let currentlyOpenPath = null;
let currentSavePath = null;

function moveCursorToEnd(paragraph) {
    const range = document.createRange();
    
    range.selectNodeContents(paragraph);
    range.collapse(false); // Collapse the range to the end
    
    const selection = window.getSelection();
    selection.removeAllRanges(); // Clear any existing selection
    selection.addRange(range); // Set the new range
}

function collectContents() {
  let textZonesCollection = document.getElementsByClassName("textzone");

  let parsedContents = "";
  
  for (let i=0; i<textZonesCollection.length; i++) {
    parsedContents = parsedContents + textZonesCollection[i].innerText + "<|>";
  }

  return parsedContents;
}

function contentsToHtml(contents) {
  let parsedContents = contents.split("<|>");

  paragraphCounter = 1;
  container.innerHTML = "";
  if (parsedContents.length > 1) {
    for (let i=0; i<parsedContents.length-1; i++) {
      createNewChild(container, parsedContents[i]);
    }
  } else {createNewChild(container, parsedContents[0])};
}

function createNewChild(parent, childcontents) {
  const newChild = document.createElement("p");
  newChild.id = "p" + paragraphCounter;
  newChild.contentEditable = true;
  newChild.className = "textzone";
  newChild.innerHTML = childcontents;
  parent.appendChild(newChild);
  paragraphCounter++;
}

document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Enter') {

        const newParagraph = document.createElement('p');

        newParagraph.id = 'p' + paragraphCounter;

        newParagraph.contentEditable = true;
        
        newParagraph.className = "textzone";

        document.activeElement.after(newParagraph);

        newParagraph.focus();

        paragraphCounter++;
        event.preventDefault();
    }
  else if (event.key === 'Enter') {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === 'P' && focusedElement.getAttribute('contenteditable') === 'true') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      event.preventDefault();
    }
  }
  else if (event.key == "Backspace" && document.activeElement.textContent === "" && document.activeElement.id != "p1") {
    const prev = document.activeElement.previousSibling;
    document.activeElement.remove();
    prev.focus();
    moveCursorToEnd(document.activeElement);
    event.preventDefault();
  }
  else if (event.ctrlKey && event.shiftKey && event.key === "S") {
    save({
      filters: [{
        name: "ANTS file",
        extensions: ["antmd"]
      }]
    })
    .then((response) => {
        if (response) {
          currentSavePath = response;
          currentlyOpenPath = response;
          invoke('write', {path: currentSavePath, contents: collectContents(), append: false});
          // console.log(editor.innerText, currentSavePath)
        }
      })
    .catch((e) => {
        throw new Error(e)
      });
  }
  else if (event.ctrlKey && event.key == "s") {
    if (currentSavePath) {
      invoke('write', {path: currentSavePath, contents: collectContents(), append: false})
    }
    else {
     save({
      filters: [{
        name: "ANTS file",
        extensions: ["antmd"]
      }]
    })
    .then((response) => {
        if (response) {
          currentSavePath = response;
          currentlyOpenPath = response;
          invoke('write', {path: currentSavePath, contents: collectContents(), append: false});
          // console.log(editor.innerText, currentSavePath)
        }
      })
    .catch((e) => {
        throw new Error(e)
      });
 
    }
  }

  else if (event.ctrlKey && event.key === "d") {
      // handle debug case

    console.log(collectContents());
      // console.log(document.getElementsByClassName("textzone")[i].innerText); // debug key
  }
});



butt.addEventListener('click', () => {
  // Open a selection dialog for image files
  // console.log("test"); // testing purposes as usual
  const selected = open({
    multiple: false,
    filters: [{
      name: 'Text',
      extensions: ['antmd']
    }]
  })
  .then((result) => {
    if (result) {
  
      currentlyOpenPath = result;
      currentSavePath = result;
    
      invoke('read', {path: currentlyOpenPath})
        .then((response) => {
          // editor.innerHTML = response;
          contentsToHtml(response);
        });
      // console.log(currentlyOpenPath)
    }
  })
  .catch((e) => {
    throw new Error(e)
  });

});
