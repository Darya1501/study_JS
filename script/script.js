let money = 2000;
let income = 'Иллюстрации';
let addExpenses = 'Мобильная связь, обучение, проезд';
let deposit = true;
let mission = 10000;
let period = 5;

console.log('money -', typeof(money), ', income -', typeof(income), ', deposit -',  typeof(deposit));

console.log('Длина строки addExpenses:', addExpenses.length);

console.log('Период равен', period, 'месяцев.', 'Цель заработать', mission, 'рублей');

let arr = addExpenses.toLowerCase().split(', ');
console.log('Дополнительные траты:', arr);

let budgetDay = money / 30;
console.log('Дневной бюджет:', budgetDay);