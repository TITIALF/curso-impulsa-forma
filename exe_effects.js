<style>
details {
  background: #f2f2f2;
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  cursor: pointer;
}
summary {
  font-weight: bold;
  list-style: none;
}
details[open] summary::after {
  content: "▲";
  float: right;
}
summary::after {
  content: "▼";
  float: right;
}
details p {
  margin: 8px 0 0;
}
</style>

<details>
  <summary>Título desplegable 1</summary>
  <p>Contenido del primer desplegable.</p>
  <details>
    <summary>Subdesplegable 1.1</summary>
    <p>Contenido del subdesplegable 1.1</p>
  </details>
  <details>
    <summary>Subdesplegable 1.2</summary>
    <p>Contenido del subdesplegable 1.2</p>
  </details>
</details>

<details>
  <summary>Título desplegable 2</summary>
  <p>Contenido del segundo desplegable.</p>
  <details>
    <summary>Subdesplegable 2.1</summary>
    <p>Contenido del subdesplegable 2.1</p>
  </details>
  <details>
    <summary>Subdesplegable 2.2</summary>
    <p>Contenido del subdesplegable 2.2</p>
  </details>
</details>

<details>
  <summary>Título desplegable 3</summary>
  <p>Contenido del tercer desplegable.</p>
</details>
