import 'regenerator-runtime/runtime' 
import 'core-js/stable'

import * as model from './model.js'
import * as cfg from './config'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
import bookmarksView from './views/bookmarksView'
import addRecipeView from './views/addRecipeView'


// https://forkify-api.herokuapp.com/v2

// Keep the state
// if(module.hot){
//   module.hot.accept();
// }


const controlRecipe = async function(){
  try{
    // 1)Get ID
    const id = window.location.hash.slice(1); // get the ID of the recipe from hash
    if(!id) return;  //Guard clause
    
    recipeView.renderSpinner(); // render loading spinner

    // 2)Update Views
    resultsView.update(model.getSearchResultsPage()); // highlight selected recipe
    bookmarksView.update(model.state.bookmarks);
    
    // 3)Get the recipe 
    
    await model.loadRecipe(id);
    const {recipe} = model.state;
    
    // 4)Rendering the recipe
    recipeView.render(recipe); 
    
  }catch(err){
    console.error(err);
    recipeView.renderError(err);
    
  }
};

const controlSearch = async function(){
  try{
    resultsView.renderSpinner();

    // 1) Get results
    const query = searchView.getKeyword();
    if (!query) return;

    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    
    // 2) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 3) Render pagination
    paginationView.render(model.state.search);

    // 4) Clear Field
    searchView.clearInput();
    

  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlPagination= function(goToPage){
  //  1)  Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //  2)  Render new pagination buttons
  // console.log(Array.isArray(model.state.search));
  paginationView.render(model.state.search);
}


const controlServings = function(newServings){
  // 1) Update the state
  model.updateServings(newServings);

  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
}


const controlBookmark = function(){
  // 1) İf the recipe is bookmarked remove bookmark else add bookmark
  model.state.recipe.bookmarked ?  model.removeBookmark(model.state.recipe.id) : model.addBookmark(model.state.recipe);
  
  // 2) Update the view
  recipeView.update(model.state.recipe);

  // 3) Bookmarks tab
  bookmarksView.render(model.state.bookmarks)
  
  // console.log(model.state.recipe);
}

const controlBookmarkUpdate = function(){
  bookmarksView.render(model.state.bookmarks);
}


const controlAddRecipe = async function(recipe){
  try{
    //  1) Render spinner
    addRecipeView.renderSpinner();
    //  2) Upload recipe to the API
    await model.uploadRecipe(recipe);
    console.log(model.state.recipe);
    
    //  3) Render recipe && Bookmarks
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    //  4) Change url ID
    window.history.pushState(null,'',`#${model.state.recipe.id}`)  // state, title, url 

    //  5) Close modal window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    },cfg.MODAL_CLOSING_SEC*1000);
  }catch(err){
    console.error('❌',err);
    addRecipeView.renderError(err.message);
  }
}


/// Initiate Event Handlers in the view
const init=function(){
  bookmarksView.addHandlerRender(controlBookmarkUpdate);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookmark(controlBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
}
init();


