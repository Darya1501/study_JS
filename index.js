'use strict';

const calculateButton = document.getElementById('#start');
const addIncomeButton = document.querySelectorAll('button')[0];
const addExpensesButton = document.querySelectorAll('button')[2];
const depositCheckbox = document.querySelector('#deposit-check');
const addIncomeFields = document.querySelectorAll('.additional_income-item');

const budgetMonthValue = document.getElementsByClassName('budget_month-value');
const budgetDayValue = document.getElementsByClassName('budget_day-value');
const expensesMonthValue = document.getElementsByClassName('expenses_month-value');
const addIncomeValue = document.getElementsByClassName('additional_income-value');
const addExpensesValue = document.getElementsByClassName('additional_expenses-value');
const incomePeriodValue = document.getElementsByClassName('income_period-value');
const targetMonthValue = document.getElementsByClassName('target_month-value');

const budgetMonthField = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const incomeAmount = document.querySelector('.income-amount');
const expensesTitle = document.querySelector('.expenses-title');
const expensesAmount = document.querySelector('.expenses-amount');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');

const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');
const periodSelect = document.querySelector('.period-select');




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

let money,
  start = function() {
  do {
    money = prompt('Ваш месячный доход:');
  } while (!isNumber(money));
    money = +money;
  };
start();


let appData = {
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 50000,
  period: 3,

  asking: function() {

    if (confirm('Есть ли у вас дополнительный источник заработка?')) {
      let itemIncome = getUserString('Какой у вас дополнительный заработок?', 'Репетиторство');
      let cashIncome = getUserNum('Сколько в месяц вы на этом зарабатываете?', 10000);
      appData.income[itemIncome] = cashIncome;
    }

    let addExpenses = getUserString('Перечислите возможные расходы за рассчитываемый период через запятую:', 'Лекарства, обучение, проезд');
    appData.addExpenses = addExpenses.toLowerCase().split(', ');

    for (let i = 0; i < 2; i++) {
      let expense = getUserString('Введите обязательную статью расходов:');
      let count = getUserNum('Во сколько это обойдется?');
      appData.expenses[expense] = count;
    }

    appData.deposit = confirm('Есть ли у вас депозит в банке?');
  },

  budget: money,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,

  getExpensesMonth: function() {
    for (let expense in appData.expenses) {
      appData.expensesMonth += appData.expenses[expense];
    }
  },

  getBudget: function() {
    appData.budgetMonth = appData.budget - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },

  getTargetMonth: function() {
    appData.period = Math.ceil(appData.mission / appData.budgetMonth);
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
    return appData.budgetMonth * appData.period; 
  }
};

appData.asking();
appData.getInfoDeposit();
appData.getExpensesMonth();
appData.getBudget();
appData.getTargetMonth();
appData.getStatusIncome();

console.log('Расходы за месяц:', appData.expensesMonth);
console.log('Количество месяцев для достижения цели:', appData.period);
console.log(appData.income.status);

console.log('Наша программа включает в себя данные: ');
for (let key in appData) {
  if (typeof(appData[key]) !== 'function') {
    console.log(key, '-', appData[key]);
  }
}

appData.addExpenses.forEach(function(item, i, arr) {
  arr[i] = item[0].toUpperCase() + item.slice(1);
});
console.log( appData.addExpenses.join(', ') );