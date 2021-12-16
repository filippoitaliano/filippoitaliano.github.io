class ArticlesBar {

  static appendTo(parentNode) {
    const id = `articlesbar_${getRandomNumber()}`;

    appendInnerHtmlTemplate(parentNode, id, `
      <hr />
      <div class="six-columns-grid-container articles-bar" id="${id}">
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
    
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
     
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
     
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
     
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
   
        <img 
          class="topbar-logo" 
          src="${window.location.origin}/client/placeholder.png"
          alt="a hacky placeholder for an article" 
        />
      </div>
      <hr />
    `);
  }

}