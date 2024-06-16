import React, { useState } from 'react';
import { formatArchitectureText } from './formatArchitectureText';
import './App.css';  // Make sure your CSS is correctly imported

function App() {
  const [inputText, setInputText] = useState('');
  const [extendBars, setExtendBars] = useState(false);
  const [showFullPath, setShowFullPath] = useState(false);

  const handleKeyDown = (event) => {
    const { key, target } = event;
    const { selectionStart, selectionEnd } = target;

    // Correctly fetching the currentLine for both tab/space and enter scenarios
    const fullText = inputText.substring(0, selectionStart);
    const lines = fullText.split('\n');
    const currentLine = lines[lines.length - 1];

    if (key === 'Tab' || key === ' ') {  // Handle tab or space for indentation
      event.preventDefault();
      const lastNonEmptyLine = [...lines].reverse().find(line => line.trim().length > 0) || '';
      const lastIndentLength = lastNonEmptyLine.match(/^( |\t)*/)[0].length;

      // Only allow increasing indentation if the current indentation is less than or equal to the last line's + 1
      if (currentLine.match(/^( |\t)*/)[0].length <= lastIndentLength) {
        const addition = key === 'Tab' ? '\t' : ' ';
        if (currentLine.match(/^( |\t)*/)[0].length < lastIndentLength + 1) {
          const newInputText = inputText.substring(0, selectionStart) + addition + inputText.substring(selectionEnd);
          setInputText(newInputText);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = selectionStart + addition.length;
          }, 0);
        }
      }
    } else if (key === 'Enter') {
      event.preventDefault();
      const indentLength = currentLine.match(/^( |\t)*/)[0].length;
      const spacesToAdd = currentLine.substring(0, indentLength);
      const modifiedText = inputText.substring(0, selectionStart) + '\n' + spacesToAdd + inputText.substring(selectionEnd);
      setInputText(modifiedText);
      setTimeout(() => {
        const newPosition = selectionStart + 1 + spacesToAdd.length;
        target.selectionStart = target.selectionEnd = newPosition;
      }, 0);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedText)
      .catch(err => console.error('Failed to copy text: ', err));
  };

  const formattedText = formatArchitectureText(inputText, extendBars, showFullPath);

  return (
    <div className="App">
      <h1>Folder structure generator</h1>
      <div className="container">
        <textarea
          className="textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter text with spaces or tabs for hierarchy..."
        />
        <pre className="pre-output">
          {formattedText}
        </pre>
      </div>
      <div>
        <button onClick={() => setExtendBars(!extendBars)}>Toggle Extend Bars</button>
        <button onClick={() => setShowFullPath(!showFullPath)}>Toggle Full Path Display</button>
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>
    </div>
  );
}

export default App;
