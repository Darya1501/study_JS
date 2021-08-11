'use strict';

const calculateButton = document.getElementById('start');
const addIncomeButton = document.querySelectorAll('button')[0];
const addExpensesButton = document.querySelectorAll('button')[1];
const depositCheckbox = document.querySelector('#deposit-check');
const addIncomeFields = document.querySelectorAll('.additional_income-item');

const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const addIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const addExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];

const budgetMonthField = document.querySelector('.salary-amount');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');

const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');


let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let getUserString = function(question, possibleAnswer = '') {
  let answer;
  do {
    answer = prompt(question, possibleAnswer);
  } while (answer.trim() === '' || isNumber(answer));
  return answer;
};

let getUserNum = function(question, possibleAnswer = '') {
  let answer;
  do {
    answer = prompt(question, possibleAnswer);
  } while (!isNumber(answer));
  return +answer;
};

let appData = {
  budget: 0,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  incomeMonth: 0,
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,

  start: function() {
    appData.budget = +budgetMonthField.value;

    appData.getExpenses();
    appData.getIncome();
    appData.getExpensesMonth();
    appData.getBudget();
    appData.getAddExpenses();
    appData.getAddIncome();

    appData.showResult();

    // appData.getInfoDeposit();
    // appData.getStatusIncome();
  },

  showResult: function() {
    budgetMonthValue.value = appData.budgetMonth;
    budgetDayValue.value = appData.budgetDay;
    expensesMonthValue.value = appData.expensesMonth;
    addExpensesValue.value = appData.addExpenses.join(', ');
    addIncomeValue.value = appData.addIncome.join(', ');
    targetMonthValue.value = appData.getTargetMonth();
    incomePeriodValue.value = appData.calcSavedMoney();

    periodSelect.addEventListener('input', function() {
      incomePeriodValue.value = appData.calcSavedMoney();
    });

  },

  addExpensesBlock: function() {
    let cloneExpensesItems = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItems, addExpensesButton);

    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      addExpensesButton.style.display = 'none';
    }
  },

  addIncomeBlock: function() {
    let cloneIncomeItems = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItems, addIncomeButton);

    incomeItems = document.querySelectorAll('.Income-items');
    if (incomeItems.length === 3) {
      addIncomeButton.style.display = 'none';
    }
  },

  getExpenses: function() {
    expensesItems.forEach(function(item){
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;

      if (itemExpenses !== '' && cashExpenses !== '') {
        appData.expenses[itemExpenses] = +cashExpenses;
      }
    });
  },

  getIncome: function() {
    incomeItems.forEach(function(item){
      let itemIncome = item.querySelector('.income-title').value;
      let cashIncome = item.querySelector('.income-amount').value;

      if (itemIncome !== '' && cashIncome !== '') {
        appData.income[itemIncome] = +cashIncome;
      }
    });

    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }
  },

  getAddExpenses: function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },

  getAddIncome: function() {
    addIncomeFields.forEach(function(item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },

  getExpensesMonth: function() {
    for (let expense in appData.expenses) {
      appData.expensesMonth += appData.expenses[expense];
    }
  },

  getBudget: function() {
    appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },

  getTargetMonth: function() {
    return Math.ceil(+targetAmount.value / appData.budgetMonth);
  },

  getStatusIncome: function() {
    if (appData.budgetDay >= 1200) {
      appData.income.status = ('У вас высокий уровень дохода');
    } else if(appData.budgetDay >= 600) {
      appData.income.status = ('У вас средний уровень дохода');
    } else if(appData.budgetDay >= 0) {
      appData.income.status = ('К сожалению, у вас уровень дохода ниже среднего');
    } else {
      appData.income.status = ('Что-то пошло не так');
    }
  },

  getInfoDeposit: function() {
    if(appData.deposit) {
      let percent = getUserNum('Какой годовой процент?', 10);
      let money = getUserNum('Какая сумма депозита?', 10000);
      appData.percentDeposit = percent;
      appData.moneyDeposit = money;
    }
  },

  calcSavedMoney: function() {
    return appData.budgetMonth * periodSelect.value; 
  }
};


calculateButton.addEventListener('click', function() {
  if (budgetMonthField.value.trim() !== '') {
    appData.start();
  }
});

addExpensesButton.addEventListener('click', appData.addExpensesBlock);
addIncomeButton.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', function() {
  periodAmount.textContent = periodSelect.value;
});