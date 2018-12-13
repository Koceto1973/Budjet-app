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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

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

    return {

        addItem: function(type, des, val) {
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },

        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// ui controller
var UIController =( function(){
    
    // single link to the css selectors
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        dateLabel: '.budget__title--month'
    }

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };            
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value, type);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            // trick to use slice on list instead of array
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },

        // display current month and year
        displayMonth: function() {
            
            // current date
            var now = new Date(); //var christmas = new Date(2016, 11, 25);
            
            // month as a number 1...12
            var month = now.getMonth(); 
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            // year
            year = now.getFullYear();


            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        // provide html strings to the app controller
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

// global app controller
var appController = ( function(budjet,UI){

    var stringsOfDOM; // html selectors

    var setupEventListeners = function() {
        stringsOfDOM = UI.getDOMstrings(); // UI, give me the html selectors
        
        // addItem
        document.querySelector(stringsOfDOM.inputBtn).addEventListener('click', addItem);
        // addItem with Enter key
        document.addEventListener('keypress',function(event){
            if ( event.keyCode === 13 || event.which === 13 ) { // event.which for older browsers
                addItem();
            }
        });

        // delete item
        document.querySelector(stringsOfDOM.container).addEventListener('click', ctrlDeleteItem);
        
        // item type change
        document.querySelector(stringsOfDOM.inputType).addEventListener('change', UICtrl.changedType); 
    }   

    var updateBudget = function() {
        
        // 1. Calculate the budget
        budjet.calculateBudget();
        
        // 2. Return the budget
        var bdgt = budjet.getBudget();
        
        // 3. Display the budget on the UI
        UI.displayBudget(bdgt);
    };

    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budget.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budget.getPercentages();
        
        // 3. Update the UI with the new percentages
        UI.displayPercentages(percentages);
    };

    function addItem() {

        // accept input
        var input = UI.getInput();
        // console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // update budjet
            var newItem = budjet.addItem(input.type,input.description,input.value);

            // update ui
            UI.addListItem(newItem,input.type);

            // clear the input fields
            UI.clearFields();

            // budjet set up
            updateBudget();

            // percentage set up
            updatePercentages()
        }
    } 

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budget.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UI.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    
    return {

        // initialization routine
        init: function() {

            // activate controls
            setupEventListeners();

            // set ui initially
            UI.displayMonth();
            UI.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            console.log('App has started!');
        }
    }

})(budjetController,UIController);

// app entry point
appController.init();


