const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid'); 
// Serve static HTML files from the 'public' directory
let users = [];
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.post('/login', (req, res) => {
  const username = req.body.username;
  // Access the username here and perform necessary actions

  // For example, log the username to the console
  console.log('Username:',username )
    const sessionId = uuid.v4();
    const userid = [username,sessionId]
    users.push(userid)
    console.log('List:',users )
    res.json({ sessionId,username });
  
});

app.get('/users', (req, res) => {
  res.json(users);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
