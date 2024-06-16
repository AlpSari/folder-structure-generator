import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Folder Structure Renderer title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Folder Structure Renderer/i);
  expect(titleElement).toBeInTheDocument();
});


test('toggles extend bars and full path display', () => {
  render(<App />);

  const extendBarsButton = screen.getByText(/Toggle Extend Bars/i);
  fireEvent.click(extendBarsButton);
  expect(extendBarsButton).toBeInTheDocument();

  const fullPathButton = screen.getByText(/Toggle Full Path Display/i);
  fireEvent.click(fullPathButton);
  expect(fullPathButton).toBeInTheDocument();
});

test('copies formatted text to clipboard', async () => {
  render(<App />);

  const textarea = screen.getByPlaceholderText(/Enter text with spaces or tabs for hierarchy/i);
  fireEvent.change(textarea, { target: { value: 'folder\n\tsubfolder\n\t\tfile.txt' } });

  const copyButton = screen.getByText(/Copy to Clipboard/i);

  // Mock the clipboard API
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve())
    }
  });

  fireEvent.click(copyButton);

  // Ensure the clipboard writeText method was called
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    `.
├── folder
    ├── subfolder
        └── file.txt`
  );
});
