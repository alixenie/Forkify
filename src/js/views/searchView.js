import {DOM} from './base';

export const getInput = () => DOM.searchQuery.value;

export const loadResults = (recipes, page = 1, resultsPerPage = 10) => {
    clearResults();
    displayResults(recipes, page, resultsPerPage);
}

const displayResults = (recipes, page, resultsPerPage) => {
    clearSearchField();
    const start = (page -1) * resultsPerPage;
    const end = page * resultsPerPage;
    if (recipes) {
        recipes.slice(start, end).forEach(displaySingleRecipe);
        displayPageButtons(page, recipes.length, resultsPerPage);
    }
}

const clearResults = () => {
    DOM.searchResultsList.innerHTML = '';
    DOM.resultsPages.innerHTML = '';
}

const createButton = (page, type) => {
    var buttonHtml = `
        <button class="btn-inline results__btn--${type}" data-goto="${type == 'prev' ? page - 1 : page + 1}">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
            </svg>
            <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>
        </button>
    `;
    DOM.resultsPages.insertAdjacentHTML('beforeend', buttonHtml);
}

const displayPageButtons = (page, resultsNum, resultsPerPage) => {
    const pagesNum = Math.ceil(resultsNum / resultsPerPage);
    if (pagesNum > 1) {
        if (page == 1) {
            createButton(page, 'next');
        } else if (page == pagesNum) {
            createButton(page, 'prev');
        } else {
            createButton(page, 'next');
            createButton(page, 'prev');
        }
    }
}

const displaySingleRecipe = recipe => {
    const recipeHtml = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${shortenTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    DOM.searchResultsList.insertAdjacentHTML('beforeend', recipeHtml);
}

const shortenTitle = (title, maxLength = 17) => {
    const shortTitle = [];
    if (title.length > maxLength) {
        title.split(/[\s-]+/).reduce((totalCharacters, cur) => {
            if(totalCharacters + cur.length <= maxLength) {
                shortTitle.push(cur);
            }
            return totalCharacters + cur.length;
        }, 0);
        return `${shortTitle.join(' ')}...`;
    }
    return title;
}

const clearSearchField = () => {
    DOM.searchQuery.value = '';
}