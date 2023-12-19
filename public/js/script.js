var user;
var sessionId;

if (window.location.pathname === '/') {
    //Helper if function for handlebars
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
  fetch('https://wiki-ads.onrender.com/categories')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // Fetch subcategories for each main category
          const subcategoryPromises = data.map(category => {
              return fetch(`https://wiki-ads.onrender.com/categories/${category.id}/subcategories`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Subcategory fetch failed');
                      }
                      return response.json();
                  })
                  .then(subcategories => {
                    //console.log(subcategories[0].id)
                      return { mainCategory: category, subCategories: subcategories};
                  })
                  .catch(error => {
                      console.error('Error fetching subcategories:', error);
                      return { mainCategory: category, subCategories: [] }; // Return empty array if there's an error
                  });
          });

          // Wait for all subcategory fetches to complete
          return Promise.all(subcategoryPromises);
      })
      .then(combinedData => {
        
          // Fetch the template content for the categories with subcategories
          let template = '{{#each combinedData}}';
          template += '<div class="category-item">';
          template += '<h2>{{this.mainCategory.title}}</h2>';
          template += '{{#ifEquals this.mainCategory.id 1}}'
          template += '<a onclick = "categoryFinder({{this.mainCategory.id}})">';
          template += '{{/ifEquals}}'
          template += '{{#ifEquals this.mainCategory.id 3}}'
          template += '<a onclick = "categoryFinder({{this.mainCategory.id}})">';
          template += '{{/ifEquals}}'
          template += '<img src="https://wiki-ads.onrender.com/{{this.mainCategory.img_url}}" width="400" height="300">';
          template += '</a>';
          // Display subcategories if available
          template += '{{#each this.subCategories}}';
          template += '<ul>';
          template += '<a onclick = "subCategoryFinder({{this.id}})">';
          template += '<li id="subcategory-item">{{this.title}}</li>';
          template += '</a>';
          template += '</ul>';
          template += '{{/each}}';
          template += '</div>';
          template += '{{/each}}';
          
          // Compile the template
          let compiledTemplate = Handlebars.compile(template);

          // Execute the compiled template and store the content in a variable
          let content = compiledTemplate({ combinedData });

          // Get the placeholder element and set its inner HTML with the compiled content
          let placeHolder = document.querySelector('.main-categories');
          placeHolder.innerHTML = content;
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}else if(window.location.pathname === '/category.html'){

    const url = new URL(window.location.href);
    const paramsString = url.search;
    
    const searchParams = new URLSearchParams(paramsString);
    const id =  searchParams.get("id");
    
    const site = `https://wiki-ads.onrender.com/ads?category=${id}`;

// Fetch data from the constructed URL
    fetch(site)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(categoryAds => {
        
        // Work with the retrieved data here
        console.log(categoryAds); // Log the fetched data to the console
        // Process the data as needed
        let template = '{{#each categoryAds}}';
        template += '<div class="category-ad">';
        template += '<h2>{{this.title}}</h2>';
        template += '<img src="https://wiki-ads.onrender.com/{{this.images.[0]}}" width = "400" height = "300">';
        template += '<h5>{{this.description}}</h5>';
        template += '<h3>Τιμή: {{this.cost}} €</h3>';
        template += `<button class="button-24" role="button" onclick="addtoFavorites('{{this.id}}','{{this.title}}','{{this.description}}','{{this.cost}}','https://wiki-ads.onrender.com/{{this.images.[0]}}' )">Προσθήκη στα Αγαπημένα</button>`;
        template += '</div>';
        template += '{{/each}}';
        
        // Compile the template
        let compiledTemplate = Handlebars.compile(template);

        // Execute the compiled template and store the content in a variable
        let content = compiledTemplate({ categoryAds });

        // Get the placeholder element and set its inner HTML with the compiled content
        let placeHolder = document.querySelector('.main-category-ads');
        placeHolder.innerHTML = content;

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation :', error);
    });
//--------------------------------------------Login Service – LS-----------------------------------------------------
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        fetch('Login-Service', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Σφάλμα κατά την ταυτοποίηση');
            }
            return response.json();
        })
        .then(data => {
            // Εμφανίζει μήνυμα επιτυχούς ταυτοποίησης στο loginMessage div
            document.getElementById('loginMessage').innerHTML = `Επιτυχής ταυτοποίηση. Session ID: ${data.sessionId}`;
            user = data.username;
            sessionId = data.sessionId
            let placeHolder = document.querySelector('.button-container');
            let content = '<div class="user-id">';
            content += `<h2>Επιτυχής Σύνδεση</h2>`
            content += `<h4> ${username}, Καλως'όρισες!</h4>`
            content += '</div>'
            placeHolder.innerHTML += content
            const loginContainer = document.querySelector('.login-container');
            loginContainer.style.display = 'none';
            loginOn = false;
        })
        .catch(error => {
            // Εμφανίζει μήνυμα σφάλματος ταυτοποίησης στο loginMessage div
            document.getElementById('loginMessage').innerHTML = 'Ανεπιτυχής ταυτοποίηση. Ελέγξτε τα στοιχεία σας.';
        });
    });


//----------------------------------------------------------------------------------------------------------------------



}else{
    // Registering a Handlebars helper function named "split"
    Handlebars.registerHelper('split', function (stringToSplit, separator) {
    // Split the string using the provided separator and return the resulting array
    return stringToSplit.split(separator);
    });
  
    const url = new URL(window.location.href);
    const paramsString = url.search;
    
    const searchParams = new URLSearchParams(paramsString);
    const id =  searchParams.get("id");
    
    const site = `https://wiki-ads.onrender.com/ads?subcategory=${id}`;

    fetch(site)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(subCategoryAds => {
        
        let template = '{{#each subCategoryAds}}';
        template += '<div class="category-ad">';
        template += '<h2>{{this.title}}</h2>';
        template += '<div class="images-box">';
        template += '{{#each this.images}}';
        template += '<img src="https://wiki-ads.onrender.com/{{this}}" width = "400" height = "300">';
        template += '{{/each}}';
        template += '</div>';
        template += '<h5>{{this.description}}</h5>';
        template += '<table class="features-table">';
        template += '<tbody>';
        template += '{{#each (split this.features "; ")}}'; 
        template += '<tr>';
        
        template += '<td>{{this}}</td>';
        
        template += '</tr>';
        template += '{{/each}}';
        template += '</tbody>';
        template += '</table>';
        template += '<h3>Τιμή: {{this.cost}} €</h3>';
        template += '</div>';
        template += '{{/each}}';
        
        // Compile the template
        let compiledTemplate = Handlebars.compile(template);

        // Execute the compiled template and store the content in a variable
        let content = compiledTemplate({ subCategoryAds });

        // Get the placeholder element and set its inner HTML with the compiled content
        let placeHolder = document.querySelector('.main-subcategory-ads');
        placeHolder.innerHTML = content;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation :', error);
    });

    



}

function categoryFinder(id) {
    window.location.href = `category.html?id=${encodeURIComponent(id)}`;
    
}
function subCategoryFinder(id) {
    
    window.location.href = `subcategory.html?id=${encodeURIComponent(id)}`;
    
}

var loginOn = false;
function setLoginForm(){
    const loginContainer = document.querySelector('.login-container');

    if(loginOn!=true){
        loginContainer.style.display = 'block';
        loginOn = true;

    }else{
        loginContainer.style.display = 'none';
        loginOn = false;

    }
    
}





function addtoFavorites(id,title,description,cost,imageUrl){
    if (user === undefined) {
        displayMessage('Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων', 2000); // 3000 milliseconds = 3 seconds
      }else{
        console.log(user)
        const queryParams = `?id=${id}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&cost=${cost}&imageUrl=${encodeURIComponent(imageUrl)}&username=${encodeURIComponent(user)}&sessionId=${encodeURIComponent(sessionId)}`;
        fetch(`/Add-To-Favorites-Service${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                // Add other headers if needed
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parsing JSON data from response if required
        })
        .then(data => {
           
            if(data.addedtoFavorite && data.authorized){
                displayMessage('Επιτυχής προσθήκη στη λίστα αγαπημένων', 2000);
            }
            if(!data.authorized){
                displayMessage('Μη εξουσιοδοτημένος χρήστης', 2000)
            }
            if(data.doubleId){
                displayMessage('Η αγγελία που προσθέσατε υπάρχει ήδη στα αγαπημένα.', 2000)
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
      }
   

    
}


function displayMessage(message, duration) {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        background-color: #333;
        color: white;
        border-radius: 5px;
        z-index: 9999;
    `;

    document.body.appendChild(messageContainer);

    setTimeout(function () {
        messageContainer.style.display = 'none';
        document.body.removeChild(messageContainer);
    }, duration);
}