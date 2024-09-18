const fs = require('fs');

// Replace with the path to your JSON file
const inputFilePath = '/Users/luna/Downloads/csvjson.json';
// Output file path
const outputFilePath =
  '/Users/luna/Documents/GitHub/swom/src/data/outputFile.ndjson';

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const listings = JSON.parse(data);
  const ndjson = listings
    .map((listing) => {
      const sanityEntry = {
        _type: 'listing', // Replace with your actual Sanity schema type
        _id: listing.user_id,
        created_at: listing.created_at,
        userInfo: listing.userInfo,
        homeInfo: listing.homeInfo,
        amenities: listing.amenities,
      };
      return JSON.stringify(sanityEntry);
    })
    .join('\n');

  fs.writeFile(outputFilePath, ndjson, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the NDJSON file:', err);
      return;
    }
    console.log('NDJSON file has been created successfully!');
  });
});
