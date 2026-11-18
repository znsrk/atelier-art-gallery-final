const museumForm = document.querySelector("#museum-form");
const museumInput = document.querySelector("#museum-search");
const museumButton = document.querySelector("#museum-submit");
const museumStatus = document.querySelector("#museum-status");
const museumResults = document.querySelector("#museum-results");
const museumEndpoint = "https://openaccess-api.clevelandart.org/api/artworks/";

museumButton.disabled = false;

function addMuseumArtwork(artwork) {
    const card = document.createElement("article");
    card.className = "museum-card";
    const title = artwork.title || "Untitled";
    const imageUrl = artwork.images?.web?.url;

    if (artwork.share_license_status === "CC0" && imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = title;
        image.loading = "lazy";
        image.addEventListener("error", function () { image.remove(); });
        card.append(image);
    }

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = "https://www.clevelandart.org/art/" + encodeURIComponent(artwork.accession_number);
    link.textContent = title;
    heading.append(link);

    const artist = document.createElement("p");
    const creators = artwork.creators || [];
    const names = creators.map(function (creator) { return creator.description; });
    artist.textContent = names.join(" · ") || "Artist information unavailable";

    const date = document.createElement("p");
    date.textContent = artwork.creation_date || "Date unavailable";
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
    url.searchParams.set("select", "accession_number,title,creators,creation_date,images,share_license_status");
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
