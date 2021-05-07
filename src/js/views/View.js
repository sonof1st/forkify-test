import icons from 'url:../../img/icons.svg'

export default class view{
    _data;
    render(data){
        // if(!data || Array.isArray(data) && data.length === 0) return this.renderError();
        if(!data || data.length === 0) return this.renderError();

        this._data=data;
        this._clear();
        const markup = this._generateMarkup();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);

    }

    update(data){

      this._data=data;
      const newMarkup = this._generateMarkup()

      const newDOM = document.createRange().createContextualFragment(newMarkup);  // converts string to DOM object (virtual)
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const currElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl,i)=>{
        const currEl = currElements[i];

        // Update Text
        if(!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim() !== ''){
          currEl.textContent = newEl.textContent;
        }

        //  Update attribute
        if(!newEl.isEqualNode(currEl)){
          Array.from(newEl.attributes).forEach(attr => currEl.setAttribute(attr.name,attr.value))
        }
      })
    }

    renderSpinner (){
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
      };

    renderError(message = this._errorMessage){
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
      
    
  _clear(){
        this._parentElement.innerHTML = '';  // Clear parent element
    }
       
}