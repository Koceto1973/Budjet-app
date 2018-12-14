// budget controller
var budgetController = ( function(){
    
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

    Expense.prototype.calcPercentages = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };    
    
    Expense.prototype.getPercentages = function() {
        return this.percentage;
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

        deleteItem: function(type, id) {
                        
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            var ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            var index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
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

        calculatePercentages: function() {
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentages(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentages();
            });
            return allPerc;
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(number) {
        
        // sign format
        var sign = (number === 0 ? '' : (number >0 ? '+' : '-' ));
        
        // two digits decimal
        var number = Math.floor(Math.abs(number)*100);
        var integerPart = Math.floor(number/100);
        var decimalPart = number-integerPart*100;
        
        // thousands separator
        var integerTripples = [];
        while (integerPart>999) {
            var tripple = integerPart - 1000*Math.floor(integerPart/1000);
            integerTripples.unshift(tripple);
            integerPart = (integerPart - tripple)/1000;
        };
        integerTripples.unshift(integerPart);
        var integerPartAsThousandsSeparatedString = integerTripples.join(',');                

        return sign + ' ' + integerPartAsThousandsSeparatedString + ( decimalPart !==0 ? ('.' + decimalPart):'');
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value)
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

        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
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

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc);
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp*(-1));
            
            // display percentage correctly
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },        
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });            
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

        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');            
        },
        
        // provide html strings to the app controller
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

// global app controller, knows budget and ui and uses their interface functions
var appController = ( function(budget,UI){

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

        // delete item by catching the bubbling event
        document.querySelector(stringsOfDOM.container).addEventListener('click', DeleteItem);
        
        // add item type change
        document.querySelector(stringsOfDOM.inputType).addEventListener('change', UI.changedType); 
    }   

    var updateBudget = function() {
        
        // 1. Calculate the budget
        budget.calculateBudget();
        
        // 2. Return the budget
        var bdgt = budget.getBudget();
        
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
            // update budget
            var newItem = budget.addItem(input.type,input.description,input.value);

            // update ui
            UI.addListItem(newItem,input.type);

            // clear the input fields
            UI.clearFields();

            // budget set up
            updateBudget();

            // percentage set up
            updatePercentages()
        }
    } 

    var DeleteItem = function(event) {
                
        // get the element by DOM traversal, get to parent, then .id
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        // only our predefined buttons have hard-coded ids
        if (itemID) {
            
            //inc-1
            var splitID = itemID.split('-');
            var type = splitID[0];
            
            var ID = parseInt(splitID[1]);
            
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
            // object argument constructed and passed 'on the run'
            UI.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            console.log('App has started!');
        }
    }

})(budgetController,UIController);

// app entry point
appController.init();




