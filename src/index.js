import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === '') return;

  
  page = 1;
  gallery.innerHTML = ''; 
  loadMoreBtn.style.display = 'none'; 

  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: '43744030-ea06338756c122773b134f56e',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });

    const { data } = response;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    displayImages(data.hits);

    if (data.totalHits > page * 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  const searchQuery = form.searchQuery.value.trim();

  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: '43744030-ea06338756c122773b134f56e',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });

    const { data } = response;
    displayImages(data.hits);

    if (data.totalHits <= page * 40) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('Failed to load more images. Please try again.');
  }
});

function displayImages(images) {
  images.forEach((image) => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    `;

    card.appendChild(img);
    card.appendChild(info);
    gallery.appendChild(card);
  });
}
