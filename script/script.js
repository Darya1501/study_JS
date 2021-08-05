'use strict';

let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


let income = 'Иллюстрации';
let mission = 50000;
let period = 5;
let money;
let expenses = [];


let start = function() {
  do {
    money = prompt('Ваш месячный доход:');
  } while (!isNumber(money));

  money = +money;
};
start();


let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:',
 'Лекарства, обучение, проезд');
let deposit = confirm('Есть ли у вас депозит в банке?');

const showTypeOf = function(data) {
  console.log( data, typeof(data) );
};

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);


const getExpensesMonth = function() {
  let sum = 0;
  let num;

  for (let i = 0; i < 2; i++) {
    expenses[i] = prompt('Введите обязательную статью расходов:');
    
    do {
      num = prompt('Во сколько это обойдется?');
    } while (!isNumber(num));
    sum += +num;
  }

  console.log('sum: ', sum);
  return sum;
};


let expensesAmount = getExpensesMonth();

let expensesMonth = expensesAmount;
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

if (targetMonth < 0) {
  console.log('Цель не будет достигнута');
} else {
  console.log('Срок достижения цели: ', targetMonth);
}


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
    return ('Что-то пошло не так');
  }
};
console.log( getStatusIncome() );