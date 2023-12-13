if (window.location.pathname === '/') {
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
                      return { mainCategory: category, subCategories: subcategories };
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
          template += '<img src="{{this.mainCategory.img_url}}" width="400" height="300">';
          
          // Display subcategories if available
          template += '{{#each this.subCategories}}';
          template += '<ul>';
          template += '<li id="subcategory-item">{{this.title}}</li>';
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
}
