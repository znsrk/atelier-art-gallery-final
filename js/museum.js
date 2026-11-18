const museumForm = document.querySelector("#museum-form");
const museumInput = document.querySelector("#museum-search");
const museumButton = document.querySelector("#museum-submit");
const museumStatus = document.querySelector("#museum-status");
const museumResults = document.querySelector("#museum-results");
const museumEndpoint = "https://api.artic.edu/api/v1/artworks/search";

museumButton.disabled = false;

function addMuseumArtwork(artwork) {
    const card = document.createElement("article");
    card.className = "museum-card";
    const title = artwork.title || "Untitled";

    if (artwork.is_public_domain && artwork.image_id) {
        const image = document.createElement("img");
        image.src = "https://www.artic.edu/iiif/2/" + encodeURIComponent(artwork.image_id) + "/full/400,/0/default.jpg";
        image.alt = title;
        image.loading = "lazy";
        image.addEventListener("error", function () { image.remove(); });
        card.append(image);
    }

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = "https://www.artic.edu/artworks/" + encodeURIComponent(artwork.id);
    link.textContent = title;
    heading.append(link);

    const artist = document.createElement("p");
    artist.textContent = artwork.artist_display || "Artist information unavailable";

    const date = document.createElement("p");
    date.textContent = artwork.date_display || "Date unavailable";
    card.append(heading, artist, date);
    museumResults.append(card);
}

museumForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (museumButton.disabled) return;

    const search = museumInput.value.trim();
    museumResults.replaceChildren();
    if (!search) {
        museumStatus.textContent = "Enter an artist or artwork to search.";
        museumInput.focus();
        return;
    }

    const url = new URL(museumEndpoint);
    url.searchParams.set("q", search);
    url.searchParams.set("fields", "id,title,artist_display,date_display,image_id,is_public_domain");
    url.searchParams.set("limit", "6");
    museumButton.disabled = true;
    museumStatus.textContent = "Searching the museum collection…";

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
        if (!response.ok) throw new Error("Museum request failed.");

        const result = await response.json();
        for (const artwork of result.data) {
            addMuseumArtwork(artwork);
        }

        museumStatus.textContent = result.data.length
            ? "Showing " + result.data.length + " museum results."
            : "No artworks found. Try another artist or title.";
    } catch {
        museumResults.replaceChildren();
        museumStatus.textContent = "The museum collection is unavailable. Try searching again in a moment.";
    } finally {
        museumButton.disabled = false;
    }
});
