const photoContainer = document.getElementById("photo-container");
const photoCount = document.getElementById("photo-count");

async function fetchPhotos() {
  try {
  //  const response = await fetch("https://jsonplaceholder.typicode.com/albums/2/photos");
  //  const photos = await response.json();

    const photoDivs = photos.map(photo => {
      const photoDiv = document.createElement("div");
      photoDiv.className = "photo-container";

      const photoImg = document.createElement("img");
      photoImg.className = "photo";
      photoImg.src = photo.url;
      photoImg.alt = photo.title;

      const photoTitle = document.createElement("p");
      photoTitle.innerText = photo.title;

      photoDiv.appendChild(photoImg);
      photoDiv.appendChild(photoTitle);

      photoDiv.addEventListener("click", () => {
        photoDiv.style.opacity = 0;
        setTimeout(() => {
          photoDiv.remove();
          updatePhotoCount();
        }, 1000);
      });

      return photoDiv;
    });

    photoContainer.append(...photoDivs);
    updatePhotoCount();

  } catch (error) {
    console.error(error);
  }
}

function updatePhotoCount() {
  const count = photoContainer.childElementCount;
  photoCount.innerText = `${count} Photos`;
}

fetchPhotos();