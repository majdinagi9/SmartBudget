const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('add-transaction');
const historyList = document.getElementById('history-list');
const balanceDisplay = document.getElementById('balance');
const clearDataButton = document.getElementById('clear-data');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

function displayTransactions() {
    historyList.innerHTML = ''; 
    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${transaction.description}</span>
            <span>${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}</span>
        `;
        historyList.appendChild(listItem);
    });
}

function addTransaction() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (description && !isNaN(amount)) {
        const transaction = { description, amount };
        transactions.push(transaction);

        localStorage.setItem('transactions', JSON.stringify(transactions));

        descriptionInput.value = '';
        amountInput.value = '';

        updateBalance();
        displayTransactions();
    }
}

function clearAllData() {
    transactions = [];
    localStorage.removeItem('transactions');
    updateBalance();
    displayTransactions();
}

addTransactionButton.addEventListener('click', addTransaction);
clearDataButton.addEventListener('click', clearAllData);

updateBalance();
displayTransactions();
