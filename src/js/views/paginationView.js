import View from './View' 
import icons from '../../img/icons.svg'


class paginationView extends View{
    _parentElement = document.querySelector('.pagination');
    

    addHandlerClick(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');
            console.log(btn);
            if(!btn) return; // if there isnt a button, break

            const goToPage = Number(btn.dataset.goto);
            console.log(goToPage); 
            handler(goToPage);
        })
    }

    _generateMarkup(){
        const currPage = this._data.page;
        const pagesLength = Math.ceil((this._data.results).length / this._data.resultsPerPage);
        console.log(pagesLength); 
        

        // Page 1
        if(currPage ===1 && pagesLength>1){
            return `
            <button data-goto="${currPage+1}" class="btn--inline pagination__btn--next">
                <span>Page ${currPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }  
        
        // Last page
        if(currPage === pagesLength && pagesLength>1){
            return `
            <button data-goto="${currPage-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage-1}</span>
            </button>
            `;
        }
        
        //  Other page
        if(currPage < pagesLength){
            return `
            <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
                </button>
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
          `;
        }
        //  Page 1 and and the last
        return '';
    }
}

export default new paginationView();