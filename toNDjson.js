const fs = require('fs');

// Read input JSON file
const inputFile = 'data.json';
const outputFile = 'output.json';

try {
    const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // Create a writable stream for the output NDJSON file
    const outputStream = fs.createWriteStream(outputFile, { flags: 'a' });

    // Iterate over the array in the input data and write each object as a line in the output NDJSON file
    inputData.forEach(obj => {
        const jsonString = JSON.stringify(obj);
        outputStream.write(jsonString + '\n');
    });

    console.log(`Conversion successful. Output written to ${outputFile}`);

    // Close the output stream
    outputStream.end();
} catch (error) {
    console.error(`Error reading or parsing the input file: ${error.message}`);
}
