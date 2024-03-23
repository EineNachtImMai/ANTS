// Initialize a counter to keep track of the number of paragraphs created
let paragraphCounter = 0;

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
        document.body.appendChild(newParagraph);

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
