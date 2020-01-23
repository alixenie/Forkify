import {DOM, displayLoader, removeLoader} from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

//init
function setUpEventListeners() {
    window.addEventListener('load', () => {
        state.likes = new Likes();
        state.likes.readStorage();
        likesView.toggleLikeMenu(state.likes.getNumOfLikes());
        state.likes.likes.forEach(like => likesView.displayLikes(like));
    })

    DOM.searchForm.addEventListener('submit', e => {
        e.preventDefault();
        controlSearch();
    });

    DOM.resultsPages.addEventListener('click', e => {
        const button = e.target.closest('.btn-inline');
        const goToPage = parseInt(button.dataset.goto);
        searchView.loadResults(state.search.result, goToPage);
    });

    ['hashchange', 'load'].forEach(event => window.addEventListener(event, () => {
        controlRecipe();
    }));

    DOM.recipe.addEventListener('click', e => {
        if (e.target.matches('.btn-decrease, .btn-decrease *')) {
            if (state.recipe.servings > 1) {
                state.recipe.recalcServings('decrease');
                recipeView.updateServings(state.recipe);
            }

        } else if (e.target.matches('.btn-increase, .btn-increase *')) {
            state.recipe.recalcServings('increase');
            recipeView.updateServings(state.recipe);

        } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
            controlList();

        } else if (e.target.matches('.recipe__love, .recipe__love *')) {
            controlLikes();
        }

    })

    DOM.list.addEventListener('click', e => {
        const id = e.target.closest('.shopping__item').dataset.itemid;
        if(e.target.matches('.shopping__delete, .shopping__delete *')) {
            //delete from state
            state.list.deleteItem(id);
            //delete from ui
            listView.removeItem(id);
        } else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value, 10);
            state.list.updateCount(id, val);
        }
    })
}

setUpEventListeners();

//Global state of the app
const state = {};

//search
const controlSearch = async () => {
    //get query from view
    const query = searchView.getInput();
    if (query) {
        // new search object - add to state
        state.search = new Search(query);

        //prepare ui for results
        displayLoader(DOM.searchResults);

        try {
            //search
            await state.search.getResults();

            //render to the ui
            removeLoader();
            searchView.loadResults(state.search.result);

        } catch(err) {
            removeLoader();
            alert('Error processing results');
        }
    }
}

//recipe
const controlRecipe = async () => {
    //get id from url
    const id = window.location.hash.replace('#', '');

    if(id) {
        //prepare ui for recipe
        recipeView.clearRecipe();
        displayLoader(DOM.recipe);

        if(state.search) {
            searchView.highlightSelect(id);
        }
        
        try {
            //new recipe object
            state.recipe = new Recipe(id);

            //get recipe data
            await state.recipe.getRecipe();
            
            //calc servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            state.recipe.standardiseIngredients();
            
            //render recipe
            removeLoader();
            recipeView.displayRecipe(state.recipe, state.likes.isLiked(id));

        } catch(err) {
            alert(err);
        }
    }
}

//testing
state.likes = new Likes();

//shopping list
const controlList = () => {
    //create list if none
    if (!state.list) state.list = new List();

    //add ingredients
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.displayItem(item);
    })
}

//likes
const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        likesView.displayLikes(newLike);
    } else {
        state.likes.deleteLike(currentId);
        likesView.removeLikes(currentId);
    }

    likesView.toggleLiked(state.likes.isLiked(currentId));
    likesView.toggleLikeMenu(state.likes.getNumOfLikes());
}