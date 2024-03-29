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

document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Enter') {

        const newParagraph = document.createElement('p');

        newParagraph.id = 'p' + paragraphCounter;

        newParagraph.contentEditable = true;

        document.getElementById("paragraphs").appendChild(newParagraph);

        newParagraph.focus();

        const range = document.createRange();
        range.selectNodeContents(newParagraph);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
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
  else if (event.ctrlKey && event.key === "s") {
    save({
      filters: [{
        name: "ANTS file",
        extensions: ["antmd"]
      }]
    })
    .then((response) => {
        currentSavePath = response;
        currentlyOpenPath = response;
        invoke('write', {path: currentSavePath, contents: editor.innerText, append: false});
        // console.log(editor.innerText, currentSavePath)
      })
    .catch((e) => {
        throw new Error(e)
      });
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
    
      invoke('read', {path: currentlyOpenPath})
        .then((response) => {editor.innerHTML = response});
      // console.log(currentlyOpenPath)
    }
  })
  .catch((e) => {
    throw new Error(e)
  });

});
