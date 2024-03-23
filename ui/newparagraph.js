// Initialize a counter to keep track of the number of paragraphs created
let paragraphCounter = 2;

const container = document.getElementById("paragraphs");

// Add event listener for keydown event

// document.addEventListener('keydown', function(event) {
//     // Check if the pressed keys are Shift + Enter
//     if (event.shiftKey && event.key === 'Enter') {
//         // Increment the paragraph counter
//         paragraphCounter++;

//         // Create a new paragraph element
//         const newParagraph = document.createElement('div');

//         // Set the ID of the new paragraph using the counter value
//         newParagraph.id = 'p' + paragraphCounter;

//         // Set the contenteditable attribute to true
//         newParagraph.contentEditable = true;

//         newParagraph.innerHTML = "a";

//         // Append the new paragraph to the document body
//         container.appendChild(newParagraph);

//         // Focus on the newly created paragraph for user input
//         newParagraph.focus();

//         // Select all text in the newly created paragraph
//         const range = document.createRange();
//         range.selectNodeContents(newParagraph);
//         const selection = window.getSelection();
//         selection.removeAllRanges();
//         selection.addRange(range);

//         // Prevent the default behavior of the Shift + Enter key combination
//         event.preventDefault();
//     }
// });


// let active = document.activeElement

// active.onkeypress = function (evt) {
//     if (evt.keyCode == 13 && active.nodeName=="DIV") {
//         // Shift + enter pressed
//         evt.preventDefault()
//         evt.stopPropagation() // Stop default handling

//         // Simulate enter is pressed
//         active.innerHTML += "<br>";
//     }
// }
// Add event listener for keydown event
document.addEventListener('keydown', function(event) {
    // Check if the pressed keys are Shift + Enter
    if (event.shiftKey && event.key === 'Enter') {
        // Increment the paragraph counter
        paragraphCounter++;

        // Create a new paragraph element
        const newParagraph = document.createElement('p');

        // Set the ID of the new paragraph using the counter value
        newParagraph.id = 'p' + paragraphCounter;

        // Set the contenteditable attribute to true
        newParagraph.contentEditable = true;

        // Append the new paragraph to the document body
        document.getElementById("paragraphs").appendChild(newParagraph);

        // Focus on the newly created paragraph for user input
        newParagraph.focus();

        // Select all text in the newly created paragraph
        const range = document.createRange();
        range.selectNodeContents(newParagraph);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Prevent the default behavior of the Shift + Enter key combination
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
