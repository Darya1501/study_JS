'use strict';

let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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
      let itemIncome, cashIncome;
      do {
        itemIncome = prompt('Какой у вас дополнительный заработок?', 'Репетиторство');
      } while (itemIncome.trim() === '' || isNumber(itemIncome));
      do {
        cashIncome = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);
      } while (!isNumber(cashIncome));
      appData.income[itemIncome] = cashIncome;
    }

    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:', 'Лекарства, обучение, проезд');
    appData.addExpenses = addExpenses.toLowerCase().split(', ');

    for (let i = 0; i < 2; i++) {
      let count, expense;
      do {
        expense = prompt('Введите обязательную статью расходов:');
      } while(expense.trim() === '' || isNumber(expense));
      do {
        count = prompt('Во сколько это обойдется?');
      } while (!isNumber(count));
      appData.expenses[expense] = +count;
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
      let percent, money;
      do {
        percent = prompt('Какой годовой процент?', 10);
      } while (!isNumber(percent));
      do {
        money = prompt('Какая сумма депозита?', 10000);
      } while (!isNumber(money));
      appData.percentDeposit = +percent;
      appData.moneyDeposit = +money;
    }
  },

  calcSavedMoney: function() {
    return appData.budgetMonth * appData.period; 
    // Мы не должны здесь учитывать ещё и депозит? 
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