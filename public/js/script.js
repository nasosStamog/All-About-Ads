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
          template += '<img src="{{this.mainCategory.img_url}}" width="400" height="300">';
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
        template += '<img src="{{this.images.[0]}}" width = "400" height = "300">';
        template += '<h5>{{this.description}}</h5>';
        template += '<h3>Τιμή: {{this.cost}} €</h3>';
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
}else{
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
        template += '{{#each this.images}}';
        template += '<img src="{{this}}" width = "400" height = "300">';
        template += '{{/each}}';
       
        template += '<h5>{{this.description}}</h5>';
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