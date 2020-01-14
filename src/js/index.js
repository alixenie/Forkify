import {DOM, displayLoader, removeLoader} from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';

//init
function setUpEventListeners() {
    DOM.searchForm.addEventListener('submit', e => {
        e.preventDefault();
        searchRecipes();
    });

    DOM.resultsPages.addEventListener('click', e => {
        const button = e.target.closest('.btn-inline');
        const goToPage = parseInt(button.dataset.goto);
        searchView.loadResults(state.search.result, goToPage);
    });
}

setUpEventListeners();

//Global state of the app
const state = {};

//search
const searchRecipes = async () => {
    //get query from view
    const query = searchView.getInput();
    if (query) {
        // new search object - add to state
        state.search = new Search(query);

        //prepare ui for results
        displayLoader(DOM.searchResults);

        //search
        await state.search.getResults();
        
        //render to the ui
        removeLoader();
        searchView.loadResults(state.search.result);
    }
}


//recipe
const viewRecipe = new Recipe(46956);