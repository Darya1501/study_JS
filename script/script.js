'use strict';

let income = 'Иллюстрации';
let mission = 10000;
let period = 5;

let money = +prompt('Ваш месячный доход:');
let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:',
 'Мобильная связь, обучение, проезд');
let deposit = confirm('Есть ли у вас депозит в банке?');

let expenses1 = prompt('Введите обязательную статью расходов: ');
let amount1 = +prompt('Во сколько это обойдется?');
let expenses2 = prompt('Введите обязательную статью расходов: ');
let amount2 = +prompt('Во сколько это обойдется?');


console.log('Тип переменной money - ', typeof(money), ', income -', typeof(income), ', deposit -',  typeof(deposit));
console.log('Длина строки addExpenses:', addExpenses.length);
console.log('Период равен', period, 'месяцев.', 'Цель заработать', mission, 'рублей');
let arr = addExpenses.toLowerCase().split(', ');
console.log('Дополнительные траты:', arr);


let budgetMonth = money - (amount1 + amount2);
console.log('Бюджет на месяц: ', budgetMonth);

let countOfMonth = Math.ceil(mission / budgetMonth);
console.log('Цель будет достигнута за', countOfMonth, 'месяцев');

let budgetDay = Math.floor(budgetMonth / 30);
console.log('Дневной бюджет:', budgetDay);

if (budgetDay >= 1200) {
  console.log('У вас высокий уровень дохода');
} else if(budgetDay >= 600) {
  console.log('У вас средний уровень дохода');
} else if(budgetDay >= 0) {
  console.log('К сожалению, у вас уровень дохода ниже среднего');
} else {
  console.log('Что то пошло не так');
}