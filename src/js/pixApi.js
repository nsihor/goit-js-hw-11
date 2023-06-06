const axios = require('axios').default;

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "37035646-4d5dc8c85e4153b75d2c00d5f";

const searchParams = new URLSearchParams({
    key : API_KEY,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: "40",
});

export async function getPhotos(name, page) {
    const response = await axios.get(`${BASE_URL}?${searchParams}&q=${name}&page=${page}`)

    if (response.status !== 200) {
        throw new Error("GET failed");
    }
    
    return response.data;
};