window.onload = function() {
  console.log("Hello!");

  

  const mainProfileImage = new PreviewImage('test.jpg');
  const root = document.getElementById("app");
  mainProfileImage.render(root);

  const mainDescription = new Paragraph("Ciao! Sono Filippo Italiano, ho 23 anni e abito in un piccolo comune del bergamasco. Lavoro da 4 anni nel mondo web, prevalentemente nell'ambito front-end.");
  mainDescription.render(root);
};