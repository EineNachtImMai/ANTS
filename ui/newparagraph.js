// Initialize a counter to keep track of the number of paragraphs created
let paragraphCounter = 2;

// just a useless comment

// Imports
const { open, save } = window.__TAURI__.dialog;
const { readTextFile } = window.__TAURI__.fs;
const { invoke } = window.__TAURI__.tauri

// constants refering to the elements of our UI
const butt = document.getElementById("openButton");
const container = document.getElementById("paragraphs");


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
      createNewChild(paragraphs, parsedContents[i], false);
    }
  } else {createNewChild(paragraphs, parsedContents[0], false)};
}

function createNewChild(parent, childcontents, focus) {
  
  const newContainer = document.createElement("div");
  newContainer.id = "container" + paragraphCounter;
  newContainer.className = "container";
  parent.appendChild(newContainer);

  const newChild = document.createElement("p");
  newChild.id = "editor" + paragraphCounter;
  newChild.contentEditable = true;
  newChild.className = "textzone";
  newChild.innerHTML = childcontents;
  newContainer.appendChild(newChild);

  const newDisplay = document.createElement("p");
  newDisplay.id = paragraphCounter;
  newDisplay.style = "display: none";
  newDisplay.className = "textdisplay";
  newContainer.appendChild(newDisplay);

  if (focus) { newChild.focus() };

  paragraphCounter++;
}

document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Enter') {
    createNewChild(container, "", true);
    event.preventDefault();
    }
  else if (event.key === 'Enter') {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === 'P' && focusedElement.getAttribute('contenteditable') === 'true') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode( document.createTextNode("\n") );
      range.insertNode(document.createElement('br'));
      // range.insertNode(document.createElement('br'));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      event.preventDefault();
    }
  }
  else if (event.key == "Backspace" && document.activeElement.textContent === "" && document.activeElement.id != "editor1") {
    const dad = document.activeElement.parentNode;
    const prev = dad.previousElementSibling.getElementsByClassName("textzone")[0];
    dad.remove();
    prev.focus();
    moveCursorToEnd(prev);
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

function parseMDToHTML(markdown) {
  // handle the parsing
  return invoke('convertMDtoHTML', {contents: markdown})
}

document.addEventListener('click', (event) => {
  const dad = event.target.closest(".container");
  // console.log(Array.from(document.getElementsByClassName("textdisplay")));
  Array.from(document.getElementsByClassName("textdisplay")).forEach((element) => {
    // console.log(parseMDToHTML(document.getElementById("editor" + element.id).innerHTML));
    // console.log(element);
    parseMDToHTML(document.getElementById("editor" + element.id).innerText).then((parsed) => {element.innerHTML = parsed.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "")});
    window.MathJax.Queue(['Typeset', MathJax, element.id])
    element.style.display = "block";
  });
  Array.from(document.getElementsByClassName("textzone")).forEach((element) => element.style.display = "none");
  if (dad) {
    const htmlContent = dad.querySelector('.textdisplay');
    const editorElement = dad.querySelector('.textzone');
    
    editorElement.style.display = 'block';
    editorElement.focus();
    htmlContent.style.display = 'none';
  }
});


window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
  svg: {
    fontCache: 'global'
  }
};
