import View from './View' 
import icons from '../../img/icons.svg'


class addRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnAdd = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    
    constructor(){
        super();
        this._addHandlerOpenWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerOpenWindow(){
        this._btnAdd.addEventListener('click',this.toggleWindow.bind(this));
        // This keyword inside an event listener always points to the object its called on!
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click',this.toggleWindow.bind(this));
        this._overlay.addEventListener('click',this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit',function(e){
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    _generateMarkup(){}


}

export default new addRecipeView();