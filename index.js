const express = require('express');
const app = express();
const path = require('path');

// Serve static HTML files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
