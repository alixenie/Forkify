import {DOM} from './base';
import {shortenTitle} from './searchView'

export const toggleLiked = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
    DOM.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const displayLikes = likeItem => {
    const likeHtml = `
        <li>
            <a class="likes__link" href="#${likeItem.id}">
                <figure class="likes__fig">
                    <img src="${likeItem.image}" alt="${likeItem.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${shortenTitle(likeItem.title)}</h4>
                    <p class="likes__author">${likeItem.author}</p>
                </div>
            </a>
        </li>
    `
    DOM.likesList.insertAdjacentHTML('beforeend', likeHtml);
}

export const removeLikes = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`);
    if (el) el.parentElement.removeChild(el);
}