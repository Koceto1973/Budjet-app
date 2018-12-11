// budjet controller
var budjetController = ( function(){

})();

// ui controller
var UIController =( function(){
    
    // single link to the css selectors
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };            
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

// global app controller
var appController = ( function(budjet,UI){

    var DOM = UI.getDOMstrings();

    function addItem() {
        // accept input

        // update budjet

        // update ui

        // recalculate budjet

        // display budjet

        console.log("Ouch!");
    }
    // by click event
    document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
    // or by keypress enter
    document.addEventListener('keypress',function(event){
        if ( event.keyCode === 13 || event.which === 13 ) { // event.which for older browsers
            addItem();
        }
    });

})(budjetController,UIController);

