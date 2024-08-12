/* ----- FOOTER ----- */

function loadComponent(componentId, filePath) {
  fetch(filePath)
      .then(response => response.text())
      .then(data => {
          document.getElementById(componentId).innerHTML = data;
      })
      .catch(error => console.error('Error loading the component:', error));
}

loadComponent('footer', 'components/footer.html');


/* ----- TABLEOFCONTENT ----- */


  