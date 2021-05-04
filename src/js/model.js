import * as cfg from './config.js'
import {ajax} from './helpers.js'


export const state = {
    recipe:{},
    search:{
        keyword: '',
        results: [],
        page: 1,
        resultsPerPage: cfg.PER_PAGE,
    },
    bookmarks: [],
};


const createRecipeObject= function(data){
    const {recipe} = data.data;
        return {
        id: recipe.id,
        title: recipe.title,
        publisher:recipe.publisher,
        sourceUrl : recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})  // if there is a key store it
    };
}

export const loadRecipe = async function(id){
    try{
        console.log(id);
        const data = await ajax(`${cfg.API}/${id}?key=${cfg.KEY}`);
        state.recipe = createRecipeObject(data)
        
        
        state.bookmarks.some(bmk=> bmk.id === id) ?  state.recipe.bookmarked = true : state.recipe.bookmarked = false;

        console.log(state.recipe);

    }catch(err){
        console.error(`${err} ❌❌❌`);
        throw err;

    }
}

export const loadSearchResults = async function(keyword){
    try{
        state.search.keyword = keyword;
        const data = await ajax(`${cfg.API}?search=${keyword}&key=${cfg.KEY}`);
        // console.log(data);

        state.search.results = data.data.recipes.map(rcp => {
            return{
                id: rcp.id,
                title: rcp.title,
                publisher:rcp.publisher,
                image: rcp.image_url,
                ...(rcp.key && {key: rcp.key}),
            }
        });
        state.search.page=1;
    }catch(err){
        console.error(`${err} ❌❌❌`);
        throw err;

    }
}


export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    
    const start = (page-1)* state.search.resultsPerPage;
    const end = page* state.search.resultsPerPage;

    return state.search.results.slice(start,end);
}

export const updateServings=function(number){
    //  1) Update quantity of each ingredient
    state.recipe.ingredients.forEach(element => {
        if(element.quantity){
            element.quantity = element.quantity*number/ state.recipe.servings; 
        }
    });
    //  2) Update servings
    state.recipe.servings = number;
}

const storeBookmarks = function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

    ///     Bookmarks   ///
export const addBookmark = function(recipe){
    // 1) Save bookmark to the state
    state.bookmarks.push(recipe);

    // 2) Mark bookmark button
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    storeBookmarks();
}

export const removeBookmark = function(id){
    //  1) Remove element from bookmarks array
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index,1);

    //  2) remove marked btn
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    storeBookmarks();
}

const clearBookmarks= function(){
    localStorage.clear('bookmarks');
}

// clearBookmarks();

// Initialize local storage
const init= function(){
    const  storage = localStorage.getItem('bookmarks');
    if( storage ) state.bookmarks = JSON.parse(storage);

};

init();


export const uploadRecipe= async function(newRecipe){
    try{
        //  1) Get ingredients from the form data
        const ingredients = Object.entries(newRecipe).filter(entry=>entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing=> {
            const ingArr = ing[1].replaceAll(' ','').split(',');
            if(ingArr.length !== 3 ) throw new Error('Wrong ingredient format! Try again.');

            const [quantity,unit,description] = ingArr
            return {quantity: quantity ? +quantity : null,unit,description};
        });
        
        //  2) create recipe object   
        const recipe={
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time:+newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients

        };

        //  3) Send data to API
        const data = await ajax(`${cfg.API}?key=${cfg.KEY}`,recipe);
        console.log(data);

        // 4) Save recipe to the state & Add bookmark
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }catch(err){
        throw err;
    }

};