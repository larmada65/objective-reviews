const supabase = window.supabase.createClient(
  "YOUR_PROJECT_URL",
  "YOUR_PUBLIC_ANON_KEY"
);

fetch("albums.json")
  let allAlbums = [];
  
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

  fetch("data/albums.json")
    .then(res => res.json())
    .then(data => {
      allAlbums = data.albums;
      populateGenres(allAlbums);
      renderAlbums(allAlbums);
    });

  function populateGenres(albums) {
    const genreFilter = document.getElementById("genreFilter");
  
    const genres = [...new Set(albums.map(a => a.genre))].sort();
  
    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreFilter.appendChild(option);
    });
  }

  function renderAlbums(albums) {
    const container = document.getElementById("album-container");
    container.innerHTML = "";
  
    albums.forEach(album => {
      const card = document.createElement("div");
      card.className = "album-card";
  
      card.innerHTML = `
        <img src="${album.cover}" alt="${album.title}">
        <h3>${album.band}</h3>
        <p>${album.title} (${album.year})</p>
        <p>Rating: ${album.rating}/20</p>
      `;
  
      card.onclick = () => {
        window.location.href = `album.html?id=${album.id}`;
      };
  
      container.appendChild(card);
    });
  }

  function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const genre = document.getElementById("genreFilter").value;
    const sort = document.getElementById("sortBy").value;
  
    let filtered = [...allAlbums];
  
    // SEARCH
    if (search) {
      filtered = filtered.filter(album =>
        album.band.toLowerCase().includes(search) ||
        album.title.toLowerCase().includes(search)
      );
    }
  
    // GENRE
    if (genre !== "all") {
      filtered = filtered.filter(album => album.genre === genre);
    }
  
    // SORT
    switch (sort) {
      case "year-desc":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }
  
    renderAlbums(filtered);
  }

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("genreFilter").addEventListener("change", applyFilters);
  document.getElementById("sortBy").addEventListener("change", applyFilters);

document.getElementById("createBandForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("bandName").value;
  const bio = document.getElementById("bandBio").value;
  const file = document.getElementById("bandImage").files[0];

  let imageUrl = null;

  if (file) {
    const fileName = Date.now() + "-" + file.name;

    await supabase.storage
      .from("band-images")
      .upload(fileName, file);

    const { data } = supabase.storage
      .from("band-images")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  await supabase.from("bands").insert([{ name, bio, image_url: imageUrl }]);

  alert("Band created!");
});
