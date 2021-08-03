'use strict';

let income = 'Иллюстрации';
let mission = 50000;
let period = 5;

let money = +prompt('Ваш месячный доход:', 20000);
let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:',
 'Лекарства, обучение, проезд');
let deposit = confirm('Есть ли у вас депозит в банке?');

let expenses1 = prompt('Введите обязательную статью расходов:', 'Мобильная связь');
let amount1 = +prompt('Во сколько это обойдется?', 500);
let expenses2 = prompt('Введите обязательную статью расходов:', 'Коммунальные услуги');
let amount2 = +prompt('Во сколько это обойдется?', 5000);


const showTypeOf = function(data) {
  console.log( data, typeof(data) );
};

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);


const getExpensesMonth = function(amount1, amount2) {
  return amount1 + amount2;
};
let expensesMonth = getExpensesMonth(amount1, amount2);
console.log('Расходы за месяц: ', expensesMonth);

let arr = addExpenses.toLowerCase().split(', ');
console.log('Возможные расходы:', arr);

const getAccumulatedMonth = function(money, expensesMonth) {
  return money - expensesMonth;
};
let accumulatedMonth = getAccumulatedMonth(money, expensesMonth);


const getTargetMonth = function(mission, accumulatedMonth) {
  return Math.ceil(mission / accumulatedMonth);
};
let targetMonth = getTargetMonth(mission, accumulatedMonth);
console.log('Цель: ', mission);
console.log('Срок достижения цели: ', targetMonth);

let budgetDay = Math.floor(accumulatedMonth / 30);
console.log('Дневной бюджет:', budgetDay);


let getStatusIncome = function() {
  if (budgetDay >= 1200) {
    return ('У вас высокий уровень дохода');
  } else if(budgetDay >= 600) {
    return ('У вас средний уровень дохода');
  } else if(budgetDay >= 0) {
    return ('К сожалению, у вас уровень дохода ниже среднего');
  } else {
    return ('Что то пошло не так');
  }
};
console.log( getStatusIncome() );