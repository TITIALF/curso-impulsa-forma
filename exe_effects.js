document.addEventListener("DOMContentLoaded", function() {
  const toggles = document.querySelectorAll(".daddy");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", function(e) {
      e.preventDefault();
      const subMenu = this.nextElementSibling;
      if(subMenu && subMenu.classList.contains("other-section")){
        subMenu.classList.toggle("open");
        this.classList.toggle("active-arrow");
      }
    });
  });
});
Luego agrega esto en tu CSS (content.css o nav.css) para que las flechas giren y el color vuelva al original:

css
Copiar código
.other-section { display: none; }
.other-section.open { display: block; }

.daddy.active-arrow::after {
  content: "▼";
  display: inline-block;
  margin-left: 5px;
  transform: rotate(180deg);
}

.daddy::after {
  content: "▶";
  display: inline-block;
  margin-left: 5px;
}

#siteNav li a:hover { background-color: #e0e0e0; } /* gris suave */
