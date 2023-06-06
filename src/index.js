import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {form, gallery, loadMoreBtn} from './js/refs.js';
import {getPhotos} from './js/pixApi.js';

let page = 1;

const imgModal = new SimpleLightbox('.photo-card a', {captionDelay: 250, captionsData: 'alt'});

form.addEventListener('submit', onPictureFind);

loadMoreBtn.addEventListener('click', onLoadMorePictures)

async function onPictureFind(e) {
try {
    e.preventDefault();

    gallery.innerHTML = ''

    loadMoreBtn.hidden = true;

    page = 1;

    const findData = form.elements.searchQuery.value

    const allData = await getPhotos(findData, page);
    const hits = allData.hits;

    if (hits.length === 0) {
        throw new Error("Empty array");
    }

    gallery.innerHTML = createMarkup(hits);

    const totalHits = allData.totalHits;

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    imgModal.refresh();

    if (totalHits <= page * 40) {
        loadMoreBtn.hidden = true;
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
        loadMoreBtn.hidden = false;
    }
} catch (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")}
};

async function onLoadMorePictures(e) {
    try {
        e.preventDefault();

        page += 1;

        const findData = form.elements.searchQuery.value

        const allData = await getPhotos(findData, page);
        const hits = allData.hits;
    
        if (hits.length === 0) {
            throw new Error("Empty array");
        }

        gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

        pageScroll()

        imgModal.refresh();

        if (allData.totalHits <= page * 40) {
            loadMoreBtn.hidden = true;
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure("Sorry, there are no images more.")
    }
}

function createMarkup(arr) {
    return arr.map(el => 
        `<div class="photo-card">
            <a class="gallery__link" href=${el.largeImageURL}>
                <img src="${el.webformatURL}" alt="${el.tags}" width=330 loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${el.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${el.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${el.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${el.downloads}</b>
                </p>
            </div>
        </div>`
    )
};

function pageScroll() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
});
}