fetch("albums.json")
  .then(res => res.json())
  .then(albums => {

    const grid = document.getElementById("albumGrid");

    Object.entries(albums).forEach(([id, album]) => {

      const card = document.createElement("a");
      card.href = `album.html?id=${id}`;
      card.className = "card";

      card.innerHTML = `
        <img src="${album.cover}">
        <div class="card-body">
          <div class="title">${album.title}</div>
          <div class="meta">${album.band} • ${album.year}</div>
        </div>
      `;

      grid.appendChild(card);
    });

  })
  .catch(err => console.error("JSON failed to load:", err));