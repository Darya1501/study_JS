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



class AppData {
  constructor() {
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
  }

  start() {
    this.budget = +salary.value;

    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getBudget();
    this.getAddExpenses();
    this.getAddIncome();
  
    this.showResult();
  
    const input = document.querySelectorAll('.data input[type="text"]');
    input.forEach((item) => {
      item.readOnly = 'true';
      item.style.cursor = 'default';
      item.style.backgroundColor = '#f5efed';
      item.setAttribute('title', 'Сначала сбросте результат');
    });
  
    startButton.style.display = 'none';
    cancelButton.style.display = 'block';
  }

  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    addExpensesValue.value = this.addExpenses.join(', ');
    addIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
  
    periodSelect.addEventListener('input', () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });
  }

  reset() {
    const results = document.querySelectorAll('.result-total');
    results.forEach((item) => {
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
    input.forEach((item) => {
      item.removeAttribute('readonly');
      item.style.cursor = 'auto';
      item.removeAttribute('title');
      item.value = '';
      item.style.backgroundColor = '#fff';
    });
  
    periodSelect.value = 1;
    periodAmount.textContent = 1;
  
    expensesItems.forEach((item, i) => {
      if (i !== 0) {
        item.remove();
      }
    });
  
    incomeItems.forEach((item, i) => {
      if (i !== 0) {
        item.remove();
      }
    });
  
    startButton.style.display = 'block';
    cancelButton.style.display = 'none';
  }

  // Добавляем новые поля в блоке "Обязательные расходы"
  addExpensesBlock() {
    const cloneExpensesItems = expensesItems[0].cloneNode(true);
    cloneExpensesItems.childNodes[1].value = '';
    cloneExpensesItems.childNodes[3].value = '';
    expensesItems[0].parentNode.insertBefore(cloneExpensesItems, addExpensesButton);
    
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      addExpensesButton.style.display = 'none';
    }
    this.validateField();
  }

  // Добавляем новые поля "Дополнительный доход"
  addIncomeBlock() {
    const cloneIncomeItems = incomeItems[0].cloneNode(true);
    cloneIncomeItems.childNodes[1].value = '';
    cloneIncomeItems.childNodes[3].value = '';
    incomeItems[0].parentNode.insertBefore(cloneIncomeItems, addIncomeButton);

    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length === 3) {
      addIncomeButton.style.display = 'none';
    }
    this.validateField();
  }

  // Получение значений из блока "Обязательные расходы"
  getExpenses() {
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title').value;
      const cashExpenses = item.querySelector('.expenses-amount').value;

      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = +cashExpenses;
      }
    });
  }

  // Получение значений из блока "Дополнительный доход"
  getIncome() {
    incomeItems.forEach((item) => {
      const itemIncome = item.querySelector('.income-title').value;
      const cashIncome = item.querySelector('.income-amount').value;

      if (itemIncome !== '' && cashIncome !== '') {
        this.income[itemIncome] = +cashIncome;
      }
    });

    for (const key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  // Получение списка возможных источников дохода
  getAddExpenses() {
    const addExpenses = addExpensesItem.value.split(',');
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  }

  // Получение списка возможных расходов
  getAddIncome() {
    addIncomeFields.forEach((item) => {
      const itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }

  // Вычисление суммы расходов
  getExpensesMonth() {
    for (const expense in this.expenses) {
      this.expensesMonth += this.expenses[expense];
    }
  }

  // Вычисление бюджета на месяц и день
  getBudget() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }

  // Вычисление срока достижения цели
  getTargetMonth() {
    return Math.ceil(+targetAmount.value / this.budgetMonth);
  }

  // Вычисление накоплений за период
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value; 
  }

  // Слушатели событий
  eventsListeners() {  
    // Кнопка "Расчитать"
    startButton.style.opacity = '0.2';
    startButton.style.cursor = 'default';
    startButton.addEventListener('click', this.start.bind(this));

    startButton.addEventListener('mouseenter', () => {
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
    addExpensesButton.addEventListener('click', this.addExpensesBlock.bind(this));
    addIncomeButton.addEventListener('click', this.addIncomeBlock.bind(this));
    periodSelect.addEventListener('input', () => {
      periodAmount.textContent = periodSelect.value;
    });
  }

  validateField() {
    const inputs = document.querySelectorAll('input'); 
    inputs.forEach((field) => {
      if (field.getAttribute('placeholder') === 'Наименование') {
        const validChars = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдеёжзиклмнопрстуфхцчшщъыьэюя.,!? ';
        field.addEventListener('keydown', (event) => {
          if (validChars.indexOf(event.key) === -1 && event.key !== 'Backspace') {
            event.preventDefault();
          } 
        });
      } else if (field.getAttribute('placeholder') === 'Сумма') {
        const validChars = '0123456789';
        field.addEventListener('keydown', (event) => {
          if (validChars.indexOf(event.key) === -1 && event.key !== 'Backspace') {
            event.preventDefault();
          } 
        });
      }
    });
  }
}


const appData = new AppData();
appData.eventsListeners();
appData.validateField();