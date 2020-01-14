export const DOM = {
    searchForm: document.querySelector('.search'),
    searchQuery: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResultsList: document.querySelector('.results__list'),
    resultsPages: document.querySelector('.results__pages'),
    loaderSpinner: 'loader',
    buttonPrev: 'results__btn--prev',
    buttonNext: 'results__btn--next'
}

export const displayLoader = parent => {
    var loader = `
        <div class="${DOM.loaderSpinner}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const removeLoader = () => {
    var loader = document.querySelector(`.${DOM.loaderSpinner}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}