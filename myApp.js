// budjet controller
var budjetController = ( function(){
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    var data = {
        allIncomes: [],
        allExpences: []
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

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

    var setupEventListeners = function() {
        var DOM = UI.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
        
        document.addEventListener('keypress',function(event){
            if ( event.keyCode === 13 || event.which === 13 ) { // event.which for older browsers
                addItem();
            }
        });
    }   

    function addItem() {
        // accept input
        var input = UI.getInput();
        console.log(input);

        // update budjet

        // update ui

        // recalculate budjet

        // display budjet

    } 
    
    return {
        init: function() {
            console.log('App has started!');
            setupEventListeners();
        }
    }

})(budjetController,UIController);

// app entry point
appController.init();

