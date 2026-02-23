const supabase = window.supabase.createClient(
  "YOUR_PROJECT_URL",
  "YOUR_PUBLIC_ANON_KEY"
);

async function loadBands() {
  const { data: bands } = await supabase
    .from("bands")
    .select("*")
    .order("created_at", { ascending: false });

  renderBands(bands);
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
