//Budget Controller
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            
             this.percentage = Math.round((this.value / totalIncome) * 100);
            
        } else {
            
            this.percentage = -1;
        }    
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    var Income = function(id, description, value){
        
        this.id = id;
        this.description = description;
        this.value = value;
    
        };
  
    var calculateTotal = function(type){
    
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        
        data.totals[type] = sum;
        
    };
    
    var allExpenses   = [];
    var allIncomes    = [];
    var totalExpenses = 0;
    
    var data = {
        allItems: {
                exp:[],
                inc:[]
     },
        totals: {
            
                exp:0,
                inc:0
            
        },
        budget: 0,
        percentage: -1
        
    };
    
    return {
        addItem: function(type, des, val){
            
            var newItem, ID;
            if(data.allItems[type].length > 0){
                
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else{
            ID = 0;
        }
        
            if(type === 'exp'){
                
                
                 newItem = new Expense(ID, des, val);
                
            } else if(type === 'inc'){
                
                 newItem = new Income(ID, des, val);
                
            }
            
          data.allItems[type].push(newItem);
          return newItem;
            
            
        },
        
        deleteItem: function(type, id){
            
           // data.allItems[type]
            var ids = data.allItems[type].map(function(current){
               
                return current.id;
                
            });
            
            index = ids.indexOf(id);
            if(index !== -1 ){
                data.allItems[type].splice(index,1);
            }
            
        },
        
        calculateBudget: function(){
          
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            
            //calculate the percentage of income that we spent 
            if(data.totals.inc > 0){
                
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                
            } else {
                
                data.percentage = -1;
            }
        },
                calculatePercentages: function(){
                    
                    data.allItems.exp.forEach(function(cur){
                  
                        cur.calcPercentage(data.totals.inc);
                        
                    });
        },
            
            getPercentages: function(){
                
                var allPerc = data.allItems.exp.map(function(cur){
                   
                    return cur.getPercentage();
                    
                });
                return allPerc;
            },
                
                
        getBudget: function(){
        
            return {
                
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
                
            };
            
        },
        
        testing: function(){
            console.log(data);
        }
    };

})();


    

//UI controller
var UIController = function(){
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue:'.add__value',
            inputBtn: '.add__btn',
            incomeContainer:'.income__list',
            expensesContainer:'.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container:'.container',
            expensesPercLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
            
            
        };
    
     var formatNumber = function(num, type){
          var numSplit, int, dec;
            /*
            
            + or - before number exactly 2 decimal points comma separating the thousands
            
            
            */
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            
            if(int.length > 3){
                
               int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
            }
            
            
            dec = numSplit[1];
            
            

            
            return (type === 'exp' ? sign='-' : sign = '+') + ' ' + int +'.' + dec;
        };
        
    var nodeListForEach = function(list, callback){
              
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
                
            };
    
    
    return {
        
      getInput: function(){
          return{
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      },
        
        addListItem: function(obj, type){
            
            var html, newHtml;
            //create HTML string with placeholder text 
            
            if(type ==='inc'){
                
                element = DOMstrings.incomeContainer;
                
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp'){
                     element = DOMstrings.expensesContainer; 
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
            
            //replace the placeholder text with some actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        deleteListItem: function(selectorID){
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        clearFields: function(){
        
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            var fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
          
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
            
            if(obj.percentage > 0){
                
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0) {
                    
                    current.textContent = percentages[index] + '%';
                    
                } else {
                    
                    current.textContent ='---';
                }
                
            });
            
        },
        
        displayMonth: function(){
            var now, month, months, year;
            var now = new Date();
            //var christmas = new Date(2016, 11, 25);
            months = ['January', 'February', 'March', 'April' , 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel). textContent = months[month] + ' ' + year;
            
            
        },
        
        changedType: function(){
          
            var fields = document.querySelectorAll(
            
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
        
        nodeListForEach(fields, function(cur){
           
            cur.classList.toggle('red-focus');
            
        });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        
    },
        getDOMstrings: function(){
            
            return DOMstrings;
            
        }
    };
    
    
}();


//global app controller
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        
        var DOM = UICtrl.getDOMstrings();
      
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
         document.addEventListener('keypress', function(event){
       
          if(event.keyCode === 13 || event.which === 13){
              
         ctrlAddItem();
              
          }
    });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
};
    
    var updateBudget = function(){
        
      //1. calculate the budget
        budgetCtrl.calculateBudget();
        
      //2. return the budget
        var budget = budgetCtrl.getBudget();
        
      //3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
        
      //1. calculate percentages
        budgetCtrl.calculatePercentages();
    
        //2. read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        
        
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        
     //1. get the field input data
        input = UICtrl.getInput();
      
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            
             //2. add the item to the budget controller 
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
     //3. add the item to the UI 
     UICtrl.addListItem(newItem, input.type);
        
        
    //clear.the fields
        UICtrl.clearFields();
        
     //5. calculate and update budget
        updateBudget();
            
            
    //6. calculate and update percentages
            updatePercentages();
            
        }
    
    };
    
    var ctrlDeleteItem = function(event){
      var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            //2. delete the item from UI
            UICtrl.deleteListItem(itemID);
            
            
            //3. update and show the new budget
            updateBudget();
            
            
        
        }
    };
    
    return {
        init: function(){
            
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                
                  budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1
                
            });
            setupEventListeners();
            
        }
    };
    
})(budgetController, UIController);

controller.init();




/*

ES5

var box5 = {
color: 'green',
position: 1,
clickMe: function(){
var self = this;
document.querySelector('.green').addEventListener('click', function(){
var str = 'This is box number ' + self.position + ' and it is ' + self.color;
alert(str);
});
}
}

box5.clickMe();



ES6

const box6 = {
color: 'green',
position: 1,
clickMe: () => {

document.querySelector('.green').addEventListener('click', () => {
var str = 'This is box number ' + this.position + ' and it is ' + this.color;
alert(str);
        });
    }
}

box6.clickMe();






function Person(name) {

this.name = name;

}

Person.prototype.myFriends5 = function(friends) {

    var arr = friends.map(function(el) {
    
        return this.name + ' is friends with ' + el;
    
    
    });
    
console.log(arr);

}

var friends = ['Bob', 'Jane', 'Mark'];

new Person('John').myFriends5(friends);

//ES6

Person.prototype.myFriends5 = function(friends) {

    var arr = friends.map(el => 
    
        '${this.name} is friends with ${el}');
    
    console.log(arr);


    };
    
    new
    Person('Mike').myFriends6(friends);

}


//es5
var john = ['John', 26];
var name = john[0];
var age = john[1];

//es6
const[name, year] = ['John', 26];
console.log(name);
console.log(age);


const obj = {

firstName: 'John',
lastName: 'Smith'
};

const {firstName, lastName} = obj;

console.log(firstName);
console.log(lastName);

const{firstName: a, lastName: b} = obj;

function calcAgeRetirement(year) {

const age = new Date().getFullYear() - year;

return [age, 65 - age];

}

const[age2, retirement] = calcAgeRetirement(1990);

console.log(age2);
console.log(retirement);

//arrays

const boxes = document.querySelectorAll('.box');

var boxesArr5 = Array.prototype.slice.call(boes);
boxesArr5.forEach(function(cur) {
cur.style.backgroundColor = 'dodgerblue';

});

//ES6 
const boxes = document.querySelectorAll('.box');

const boxesArr6 = Array.from(boxes);
boxesArr6.forEach(cur => cur.style.backgroundColor = 'dodgerblue);

ES5 
for(var i = 0; i < boxersArr5.length; i++){
    
    if(boxesArr5[i].className === 'boxblue'){
    
    continue;
    

    }
    blxesArr5[i].texContent = 'I changed to blue!';
    
}

//ES6
for(const cur of boxesArr6){

    if(cur.className.includes('blue')){
    
    continue;
    
    }
cur.textContent = 'I changed to blue!';
}

//ES5
var ages = [12, 17, 8, 21, 14, 11];

var full = ages.map(function(cur) {

return cur >= 18;
});

console.log(full);

console.log(full.indexOf(true)); //3 
console.log(ages[full.indexOf(true)]); //21

//ES6

ages.findIndex(cur => cur >= 18); // 3 index
console.log(ages.find(cur => cur >= 18)); //21 value

function addFourAges(a,b,c,d){
return a + b + c + d;

}

var sum1 = addFourAges(18, 30, 12, 21);

console.log(sum1);

var ages = [18, 30, 12, 21];
var sum2 = addFourAges.apply(null, ages);

//ES6

const sum3 = addFourAges(...ages); //axactly same thing with (18, 30, 12,21)

const familySmith = ['John', 'Jane', 'Mark'];
const familyMiller = ['Mary', 'Bob', 'Ann'];
const bigFamily = [...familySmith,'Lily', ...familyMiller];
const h = document.querySelector('h1');
const boxes = document.querySelectorAll('.box');
const all = [h, ...boxes];
Array.from(all).forEach( cur => cur.style.color = 'purple');

function isFullAge5(){
var agesArr = Array.prototype.slice.call(arguments);

argsArr.forEach(function(cur) {
console.log((2016 - cur) >= 18);
})

}

isFullAge5(1990, 1999, 1965);

//ES6
function isFullAge6(...years) {

    years.forEach(cur => console.log( (2016 - cur) >= 18));

}

isFullAge6(1990, 1999, 1965);







*/



