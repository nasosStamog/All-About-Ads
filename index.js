const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid'); 
// Serve static HTML files from the 'public' directory
let users = [];
let favoriteAds = [];
let userIdIndex = 0;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });


app.post('/Login-Service', (req, res) => {
  const username = req.body.username;
  // Access the username here and perform necessary actions

    const sessionId = uuid.v4();
    const userid = [username,sessionId]
    users.push(userid)
    res.json({ sessionId,username });
  
});

app.get('/Add-To-Favorites-Service', (req, res) => {
  const { id, title, description, cost, imageUrl, username, sessionId } = req.query;
  // Use the received parameters as needed
  let doubleId = false;
  let userId = [username,sessionId]
  let authorized = false;
  let addedtoFavorite = false;
  const favoriteAd = [id,title,description,cost,imageUrl,username,sessionId]
  
  users.map(user => {
    //έλεγχος ύπαρξης χρήστη
    if(userId[0] === user[0] && userId[1] === user[1]){
      authorized = true;
      
  }else{
    authorized = false;
  }
  
  })
  if(authorized){
    
    //έλεγχος για ύπαρξη χρήστη στη λίστα των αγαπημένων
    const userIdExists = favoriteAds.some(user => user[0] === userId[0] && user[1] === userId[1]);
    
    if(!userIdExists){
    //προσθήκη ταυτοποιημένου χρήστη στην favoriteAds
    favoriteAds.push(userId)
    userIdIndex = favoriteAds.findIndex(user => JSON.stringify(user) === JSON.stringify(userId));
    
    }
  

    for (let i = 2; i < favoriteAds[userIdIndex].length; i++) {
      if(favoriteAds[userIdIndex][i].includes(id)){
      doubleId = true;
    }
  }
    if(!doubleId){
    //προσθήκη αγαπημένης αγγελίας στην λίστα [userId] κάθε χρήστη στην favoriteAds
    favoriteAds[userIdIndex].push(favoriteAd)
    }
    //Αποστολή κωδικού επιτυχημένης καταχώρησης
    addedtoFavorite = true;
    
    
  }
  res.json({authorized,addedtoFavorite,doubleId});
  
});

app.get('/Favorites-Retrieval-Service', (req, res) => {
  const {username, sessionId } = req.query;;
  let userId = [username,sessionId]
  let authorized = false;
  
  let favoriteList = [];
  users.map(user => {
    //έλεγχος ύπαρξης χρήστη
    if(userId[0] === user[0] && userId[1] === user[1]){
      authorized = true;
      
  }else{
    authorized = false;
  }
  })
  if(authorized){
    //add user favorites to the list the server will send
    for (let i = 2; i < favoriteAds[userIdIndex].length; i++) {
      favoriteList.push(favoriteAds[userIdIndex][i])
  }
    res.json(favoriteList)
  
  
  }

  


})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
