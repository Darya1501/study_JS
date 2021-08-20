

// Кнопки управления программой
const startButton = document.getElementById('start');
const cancelButton = document.getElementById('cancel');

// Входные данные доходов
const salary = document.querySelector('.salary-amount');
const incomeItems = document.querySelectorAll('.income-items');
const addIncomeButton = document.querySelectorAll('button')[0];
const addIncomeFields = document.querySelectorAll('.additional_income-item');

// Входные данные расходов
const expensesItems = document.querySelectorAll('.expenses-items');
const addExpensesButton = document.querySelectorAll('button')[1];
const addExpensesItem = document.querySelector('.additional_expenses-item');

// Входные данные депозита
const depositCheckbox = document.querySelector('#deposit-check');
const depositBank = document.querySelector('.deposit-bank');
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

    this.getExpInc();
    this.getExpensesMonth();
    this.getInfoDeposit();
    this.getBudget();
    this.getAddExpInc();

    this.showResult();

    const input = document.querySelectorAll('.data input[type="text"]');
    input.forEach(item => {
      item.readOnly = 'true';
      item.style.cursor = 'default';
      item.style.backgroundColor = '#f5efed';
      item.setAttribute('title', 'Сначала сбросте результат');
    });

    depositCheckbox.disabled = true;
    depositBank.disabled = true;

    addIncomeButton.style.display = 'none';
    addExpensesButton.style.display = 'none';

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
    results.forEach(item => {
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
    input.forEach(item => {
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

    depositCheckbox.disabled = false;
    depositBank.disabled = false;

    addIncomeButton.style.display = 'block';
    addExpensesButton.style.display = 'block';

    startButton.style.display = 'block';
    cancelButton.style.display = 'none';
  }

  // Добавляем новые поля "Дополнительный доход" или "Обязательные расходы"
  addNewBlock(button) {
    console.log('button: ', button);
    const startStr = button.classList[1].split('_')[0];
    const items = document.querySelectorAll(`.${startStr}-items`);

    const cloneItems = items[0].cloneNode(true);
    cloneItems.childNodes[1].value = '';
    cloneItems.childNodes[3].value = '';
    items[0].parentNode.insertBefore(cloneItems, button);

    if (items.length === 2) {
      button.style.display = 'none';
    }
    this.validateField();
  }

  // Получение значений "Обязательные расходы" и "Дополнительный доход"
  getExpInc() {
    const count = item => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      if (itemTitle !== '' && itemAmount !== '') {
        this[startStr][itemTitle] = +itemAmount;
      }
    };
    expensesItems.forEach(count);
    incomeItems.forEach(count);
    for (const key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  //  Получение списков возможных расходов и доходов
  getAddExpInc() {
    const write = item => {
      let array;
      if (typeof(item) === 'string') {
        item = item.trim();
        array = 'addExpenses';
      } else {
        item = item.value.trim();
        array = 'addIncome';
      }
      if (item !== '') {
        this[array].push(item);
      }
    };
    const addExpenses = addExpensesItem.value.split(',');
    addExpenses.forEach(write);
    addIncomeFields.forEach(write);

  }

  // Вычисление суммы расходов
  getExpensesMonth() {
    for (const expense in this.expenses) {
      this.expensesMonth += this.expenses[expense];
    }
  }

  // Вычисление бюджета на месяц и день
  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
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

  getInfoDeposit() {
    if (this.deposit) {
      this.moneyDeposit = depositAmount.value;
      if (depositPercent.value < 0 || depositPercent.value > 100) {
        this.percentDeposit = 0;
        depositPercent.value = 0;
        alert('Внимание, значение поля процент - не верное! Установлено значение по умолчанию - 0%');
      } else {
        this.percentDeposit = depositPercent.value;
      }
    }
  }

  changePersent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.value = '';
      depositPercent.style.display = 'inline-block';
    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = valueSelect;
    }
  }

  depositHandler() {
    if (depositCheckbox.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePersent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePersent);
    }
  }

  // Слушатели событий
  eventsListeners() {
    startButton.style.opacity = '0.2';
    startButton.style.cursor = 'default';
    startButton.addEventListener('click', this.start.bind(this));

    startButton.addEventListener('mouseenter', () => {
      if (salary.value.trim() === '') {
        startButton.style.opacity = '0.2';
        startButton.style.cursor = 'default';
        startButton.setAttribute('title', 'Заполните поле "Месячный доход"');
        startButton.disabled = true;
      }
    });

    salary.addEventListener('keydown',  () => {
      if (salary.value.trim() !== '') {
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';
        startButton.removeAttribute('title');
        startButton.disabled = false;
      }
    });

    cancelButton.addEventListener('click', this.reset.bind(this));
    addExpensesButton.addEventListener('click', this.addNewBlock.bind(this, addExpensesButton));
    addIncomeButton.addEventListener('click', this.addNewBlock.bind(this, addIncomeButton));
    periodSelect.addEventListener('input', () => {
      periodAmount.textContent = periodSelect.value;
    });

    depositCheckbox.addEventListener('change', this.depositHandler.bind(this));
  }

  // Валидация полей
  validateField() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(field => {
      if (field.getAttribute('placeholder') === 'Наименование' || field.getAttribute('placeholder') === 'название') {
        const validChars = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя.,!? ';
        field.addEventListener('keydown', event => {
          if (validChars.indexOf(event.key) === -1 && event.key !== 'Backspace') {
            event.preventDefault();
          }
        });
      } else if (field.getAttribute('placeholder') === 'Сумма' || field.getAttribute('placeholder') === 'Процент') {
        const validChars = '0123456789';
        field.addEventListener('keydown', event => {
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
