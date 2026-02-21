const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("albums.json")
  .then(res => res.json())
  .then(albums => {

    const album = albums[id];

    document.getElementById("title").textContent =
      `${album.title} (${album.year})`;

    document.getElementById("band").textContent = album.band;
    document.getElementById("cover").src = album.cover;

    const tracks = document.getElementById("tracks");

    album.tracks.forEach(track => {
      const li = document.createElement("li");
      li.textContent = `${track.title} — ${track.time}`;
      tracks.appendChild(li);
    });

    loadRatings();
  });

function submitRating() {
  const val = Number(document.getElementById("userRating").value);
  if (!val && val !== 0) return;

  const key = "ratings-" + id;
  const ratings = JSON.parse(localStorage.getItem(key)) || [];

  ratings.push(val);
  localStorage.setItem(key, JSON.stringify(ratings));

  loadRatings();
}

function loadRatings() {
  const key = "ratings-" + id;
  const ratings = JSON.parse(localStorage.getItem(key)) || [];

  if (!ratings.length) return;

  const avg = ratings.reduce((a,b)=>a+b,0) / ratings.length;

  document.getElementById("average").textContent =
    `Average: ${avg.toFixed(2)} / 20 (${ratings.length} ratings)`;
}