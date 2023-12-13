if (window.location.pathname === '/') {
  fetch('https://wiki-ads.onrender.com/categories')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      const objWithIdOne = data.find(item => item.id === 1);
      const imgUrlOfIdOne = objWithIdOne ? objWithIdOne.img_url : '';

      // Fetch the template content
      let template = document.getElementById('test').innerHTML;

      // Compile the template
      let compiledTemplate = Handlebars.compile(template);

      // Execute the compiled template and store the content in a variable
      let content = compiledTemplate({ test: imgUrlOfIdOne });

      // Get the placeholder element and set its inner HTML with the compiled content
      let placeHolder = document.getElementById('test');
      placeHolder.innerHTML = content;
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}