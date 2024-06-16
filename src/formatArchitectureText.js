export function formatArchitectureText(input, extendBars, showFullPath) {
    const lines = input.split('\n');
    let result = ['.',]; // Start with root marker
    let pathStack = [];

    lines.forEach((line, index) => {
        const currentLevel = line.match(/^( |\t)*/)[0].length;
        const content = line.trim();
        if (content.length === 0) return; // Skip rendering empty lines

        // Update path for current level
        pathStack[currentLevel] = content;
        pathStack = pathStack.slice(0, currentLevel + 1); // Trim path stack beyond current level

        // Construct full path only if needed
        const fullPath = showFullPath ? './' + pathStack.join('/') : content;
        const isLast = (index + 1 === lines.length) || (lines[index + 1].match(/^( |\t)*/)[0].length <= currentLevel);

        const prefix = isLast ? "└──" : "├──";
        let indentation = '';
        for (let i = 0; i < currentLevel; i++) {
            indentation += extendBars ? '│   ' : '    ';
        }

        result.push(indentation + prefix + ' ' + fullPath);
    });

    return result.join('\n');
}
