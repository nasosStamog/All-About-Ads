import Handlebars from "handlebars";

fetch('https://wiki-ads.onrender.com/categories')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Change this to response.text() if expecting plain text
  })
  .then(data => {
    // Work with the retrieved data here
    console.log(data); // For example, log the data to the console
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
