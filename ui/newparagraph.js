// Initialize a counter to keep track of the number of paragraphs created
let paragraphCounter = 2;

const container = document.getElementById("paragraphs");

// Place the cursor at the end of the paragraph
function moveCursorToEnd(paragraph) {
    // Create a new Range object
    const range = document.createRange();
    
    // Set the range to the end of the paragraph
    range.selectNodeContents(paragraph);
    range.collapse(false); // Collapse the range to the end
    
    // Create a new Selection object and set the range
    const selection = window.getSelection();
    selection.removeAllRanges(); // Clear any existing selection
    selection.addRange(range); // Set the new range
}

document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Enter') {
        paragraphCounter++;

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
  else if (event.key == "Backspace" && document.activeElement.textContent === "") {
    const prev = document.activeElement.previousSibling;
    document.activeElement.remove();
    prev.focus();
    moveCursorToEnd(document.activeElement);
    event.preventDefault();
    // document.activeElement. = this.innerHTML.length;
  }
});

const editor = document.getElementById('p1');
const fileInput = document.getElementById('fileInput');
const openButton = document.getElementById('openButton');

openButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
            
  reader.onload = () => {
    const contents = reader.result;
    editor.value = contents; 
  };
  reader.readAsText(file);
});
