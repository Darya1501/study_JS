'use strict';

// Кнопки управления программой
const startButton = document.getElementById('start');
const cancelButton = document.getElementById('cancel');

// Входные данные доходов
const salary = document.querySelector('.salary-amount');
let incomeItems = document.querySelectorAll('.income-items');
const addIncomeButton = document.querySelectorAll('button')[0];
const addIncomeFields = document.querySelectorAll('.additional_income-item');

// Входные данные расходов
let expensesItems = document.querySelectorAll('.expenses-items');
const addExpensesButton = document.querySelectorAll('button')[1];
const addExpensesItem = document.querySelector('.additional_expenses-item');

// Входные данные депозита
const depositCheckbox = document.querySelector('#deposit-check');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

// Цель
const targetAmount = document.querySelector('.target-amount');

// Период расчета
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');

// Поля для вывода результатов
const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const addIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const addExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];


const AppData = function() {
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.incomeMonth = 0;
  this.income = {};
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
};

AppData.prototype.start = function() {

  this.budget = +salary.value;

  this.getExpenses();
  this.getIncome();
  this.getExpensesMonth();
  this.getBudget();
  this.getAddExpenses();
  this.getAddIncome();

  this.showResult();

  const input = document.querySelectorAll('.data input[type="text"]');
  input.forEach(function(item) {
    item.readOnly = 'true';
    item.style.cursor = 'default';
    item.style.backgroundColor = '#f5efed';
    item.setAttribute('title', 'Сначала сбросте результат');
  });

  startButton.style.display = 'none';
  cancelButton.style.display = 'block';
};


AppData.prototype.showResult = function() {
  const _this = this;
  budgetMonthValue.value = this.budgetMonth;
  budgetDayValue.value = this.budgetDay;
  expensesMonthValue.value = this.expensesMonth;
  addExpensesValue.value = this.addExpenses.join(', ');
  addIncomeValue.value = this.addIncome.join(', ');
  targetMonthValue.value = this.getTargetMonth();
  incomePeriodValue.value = this.calcSavedMoney();

  periodSelect.addEventListener('input', function() {
    incomePeriodValue.value = _this.calcSavedMoney();
  });
};

AppData.prototype.reset = function() {
  const results = document.querySelectorAll('.result-total');
  results.forEach(function(item) {
    item.value = '';
  });

  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.incomeMonth = 0;
  this.income = {};
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;

  const input = document.querySelectorAll('.data input[type="text"]');
  input.forEach(function(item) {
    item.removeAttribute('readonly');
    item.style.cursor = 'auto';
    item.removeAttribute('title');
    item.value = '';
    item.style.backgroundColor = '#fff';
  });

  periodSelect.value = 1;
  periodAmount.textContent = 1;

  expensesItems.forEach(function(item, i) {
    if (i !== 0) {
      item.remove();
    }
  });

  incomeItems.forEach(function(item, i) {
    if (i !== 0) {
      item.remove();
    }
  });

  startButton.style.display = 'block';
  cancelButton.style.display = 'none';
};

// Добавляем новые поля в блоке "Обязательные расходы"
AppData.prototype.addExpensesBlock = function() {
  let cloneExpensesItems = expensesItems[0].cloneNode(true);
  cloneExpensesItems.childNodes[1].value = '';
  cloneExpensesItems.childNodes[3].value = '';
  expensesItems[0].parentNode.insertBefore(cloneExpensesItems, addExpensesButton);

  expensesItems = document.querySelectorAll('.expenses-items');
  if (expensesItems.length === 3) {
    addExpensesButton.style.display = 'none';
  }
};

// Добавляем новые поля "Дополнительный доход"
AppData.prototype.addIncomeBlock = function() {
  let cloneIncomeItems = incomeItems[0].cloneNode(true);
  cloneIncomeItems.childNodes[1].value = '';
  cloneIncomeItems.childNodes[3].value = '';
  incomeItems[0].parentNode.insertBefore(cloneIncomeItems, addIncomeButton);

  incomeItems = document.querySelectorAll('.income-items');
  if (incomeItems.length === 3) {
    addIncomeButton.style.display = 'none';
  }
};

// Получение значений из блока "Обязательные расходы"
AppData.prototype.getExpenses = function() {

  const _this = this;
  expensesItems.forEach(function(item){
    let itemExpenses = item.querySelector('.expenses-title').value;
    let cashExpenses = item.querySelector('.expenses-amount').value;

    if (itemExpenses !== '' && cashExpenses !== '') {
      _this.expenses[itemExpenses] = +cashExpenses;
    }
  });
};

// Получение значений из блока "Дополнительный доход"
AppData.prototype.getIncome = function() {
  const _this = this;
  incomeItems.forEach(function(item){
    let itemIncome = item.querySelector('.income-title').value;
    let cashIncome = item.querySelector('.income-amount').value;

    if (itemIncome !== '' && cashIncome !== '') {
      _this.income[itemIncome] = +cashIncome;
    }
  });

  for (let key in this.income) {
    this.incomeMonth += +this.income[key];
  }
};

// Получение списка возможных источников дохода
AppData.prototype.getAddExpenses = function() {
  const _this = this;
  let addExpenses = addExpensesItem.value.split(',');
  addExpenses.forEach(function(item) {
    item = item.trim();
    if (item !== '') {
      _this.addExpenses.push(item);
    }
  });
};

// Получение списка возможных расходов
AppData.prototype.getAddIncome = function() {
  const _this = this;
  addIncomeFields.forEach(function(item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      _this.addIncome.push(itemValue);
    }
  });
};

// Вычисление суммы расходов
AppData.prototype.getExpensesMonth = function() {
  for (let expense in this.expenses) {
    this.expensesMonth += this.expenses[expense];
  }
};

// Вычисление бюджета на месяц и день
AppData.prototype.getBudget = function() {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = Math.floor(this.budgetMonth / 30);
};

// Вычисление срока достижения цели
AppData.prototype.getTargetMonth = function() {
  return Math.ceil(+targetAmount.value / this.budgetMonth);
};

// Вычисление накоплений за период
AppData.prototype.calcSavedMoney = function() {
  return this.budgetMonth * periodSelect.value; 
};

// Слушатели событий
AppData.prototype.eventsListeners = function() {  
  // Кнопка "Расчитать"
  startButton.style.opacity = '0.2';
  startButton.style.cursor = 'default';
  startButton.addEventListener('click', this.start.bind(this));

  startButton.addEventListener('mouseenter', function() {
    if (salary.value.trim() !== '') {
      startButton.style.opacity = '1';
      startButton.style.cursor = 'pointer';
      startButton.removeAttribute('title');
      startButton.removeAttribute('disable');
    } else {
      startButton.style.opacity = '0.2';
      startButton.style.cursor = 'default';
      startButton.setAttribute('title', 'Заполните поле "Месячный доход"');
      startButton.setAttribute('disable', 'true');
    }
  });

  cancelButton.addEventListener('click', this.reset.bind(this));
  addExpensesButton.addEventListener('click', this.addExpensesBlock);
  addIncomeButton.addEventListener('click', this.addIncomeBlock);
  periodSelect.addEventListener('input', function() {
    periodAmount.textContent = periodSelect.value;
  });

};


const appData = new AppData();
appData.eventsListeners();



// Нужно ли переносить валидацию полей в AppData?
let validateField = function(field) {

  if (field.getAttribute('placeholder') === 'Наименование') {

    let validChars = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдеёжзиклмнопрстуфхцчшщъыьэюя.,!? ';
    field.addEventListener('keydown', function(event) {
      if (validChars.indexOf(event.key) === -1 && event.key !== 'Backspace') {
        event.preventDefault();
      } 
    });

  } else if (field.getAttribute('placeholder') === 'Сумма') {

    let validChars = '0123456789';
    field.addEventListener('keydown', function(event) {
      if (validChars.indexOf(event.key) === -1 && event.key !== 'Backspace') {
        event.preventDefault();
      } 
    });

  }
};

const inputs = document.querySelectorAll('input');
inputs.forEach(function(item) {
  validateField(item);
});