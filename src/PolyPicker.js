
class PolyPicker{
    constructor(pSelect) {
        this.parent = pSelect.parentNode;
        pSelect.parentNode.removeChild(pSelect);
        this.id = pSelect.getAttribute('id');
        this.name = pSelect.getAttribute('name');
        this.placeholder = pSelect.getAttribute('data-placeholder')||"";
        this.emptyList = pSelect.getAttribute('data-empty-list')||"";

        let options = Array.from(pSelect.options).map((pOption)=>{
            return {
                name:pOption.innerHTML,
                value:pOption.value,
                selected:pOption.getAttribute('selected')!==null
            };
        });

        this._anoCloseHandler = this.closeHandler.bind(this);

        this.render(options);
    }

    render(pOptions){
        this.container = document.createElement('div');
        this.container.setAttribute('id', this.id);
        this.container.classList.add('polypicker-container', 'close');
        let listSelected = document.createElement('div');
        listSelected.classList.add('polypicker-selected');
        listSelected.addEventListener('click', (e)=>{
            if(e.target !== e.currentTarget){
                return;
            }
            this.container.classList.remove('close');
            window.addEventListener('click', this._anoCloseHandler, true);
        });
        let listContainer = document.createElement('div');
        listContainer.classList.add('polypicker-list');
        this.container.appendChild(listSelected);
        this.container.appendChild(listContainer);
        this.parent.appendChild(this.container);
        this.setOptions(pOptions);
    }

    setOptions(pOptions){
        this.options = pOptions;
        this.options.forEach((pOption)=>{
            let item = document.createElement('div');
            if(pOption.selected){
                item.classList.add('selected');
                this.createSelectedElement(pOption);
            }
            item.setAttribute('data-value', pOption.value);
            item.innerHTML = pOption.name;
            this.container.querySelector('.polypicker-list').appendChild(item);
            item.addEventListener('click', this.selectHandler.bind(this));
        });
        this.updatedList();
    }

    createSelectedElement(pOption){
        let selected = document.createElement('div');
        selected.innerHTML = pOption.name;
        selected.setAttribute("data-value", pOption.value);
        let span = document.createElement('span');
        span.innerHTML = '&times;';
        span.addEventListener('click', this.deselectHandler.bind(this));
        selected.appendChild(span);
        this.container.querySelector('.polypicker-selected').appendChild(selected);
        let inp = document.createElement('input');
        inp.setAttribute("type", "hidden");
        inp.setAttribute("name", this.name+"[]");
        inp.setAttribute("value", pOption.value);
        this.container.appendChild(inp);
    }

    selectHandler(e){
        let opts = this.options.filter((pOption)=>pOption.value===e.currentTarget.getAttribute("data-value"));
        if(!opts.length){
            return;
        }
        e.currentTarget.classList.add('selected');
        let opt = opts[0];
        this.createSelectedElement(opt);
        this.updatedList();
    }

    deselectHandler(e){
        let selected = e.currentTarget.parentNode;
        selected.parentNode.removeChild(selected);
        this.container.querySelector('.polypicker-list div[data-value="'+selected.getAttribute('data-value')+'"]').classList.remove('selected');
        let inp = this.container.querySelector('input[value="'+selected.getAttribute("data-value")+'"]');
        if(inp){
            inp.parentNode.removeChild(inp);
        }
        this.updatedList();
    }

    closeHandler(){
        this.container.classList.add('close');
        window.removeEventListener('click', this._anoCloseHandler);
    }

    updatedList(){
        let placeHolder = document.querySelector('.polypicker-selected>.placeholder');
        if(placeHolder){
            placeHolder.parentNode.removeChild(placeHolder);
        }
        let emptyLabel = document.querySelector('.polypicker-list>.empty');
        if(emptyLabel){
            emptyLabel.parentNode.removeChild(emptyLabel);
        }
        if(!this.container.querySelectorAll(".polypicker-selected>div[data-value]").length && this.placeholder){
            this.container.querySelector(".polypicker-selected").innerHTML = "<div class='placeholder'>"+this.placeholder+"</div>";
        }
        if(this.container.querySelectorAll(".polypicker-selected>div[data-value]").length===this.options.length && this.emptyList){
            this.container.querySelector(".polypicker-list").innerHTML = "<div class='empty'>"+this.emptyList+"</div>";
        }
    }
}

(function(){
    function init(){
        document.querySelectorAll('select[data-role="PolyPicker"]').forEach((pSelect)=>{
            new PolyPicker(pSelect);
        });
    }

    window.addEventListener('DOMContentLoaded', init);
})();