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
	mission: 50000,
	period: 3,
	asking: function() {
		let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:', 'Лекарства, обучение, проезд');
		appData.addExpenses = addExpenses.toLowerCase().split(', ');
		appData.deposit = confirm('Есть ли у вас депозит в банке?');

		for (let i = 0; i < 2; i++) {
			let count;
			let expense = prompt('Введите обязательную статью расходов:');
			do {
				count = prompt('Во сколько это обойдется?');
			} while (!isNumber(count));
			appData.expenses[expense] = +count;
		}
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

};

appData.asking();
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