// Elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('add-transaction');
const saveTransactionButton = document.getElementById('save-transaction');
const historyList = document.getElementById('history-list');
const balanceDisplay = document.getElementById('balance');
const clearDataButton = document.getElementById('clear-data');

// Load existing transactions from LocalStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editIndex = null;

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

function displayTransactions() {
    historyList.innerHTML = ''; // Clear the history list
    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${transaction.description}</span>
            <span>${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}</span>
            <button onclick="editTransaction(${index})">Edit</button>
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

        // Save the updated transactions to LocalStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Clear input fields
        descriptionInput.value = '';
        amountInput.value = '';

        // Update UI
        updateBalance();
        displayTransactions();
    }
}

function editTransaction(index) {
    editIndex = index;
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;

    addTransactionButton.style.display = 'none';
    saveTransactionButton.style.display = 'inline-block';
}

function saveTransaction() {
    if (editIndex !== null) {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);

        if (description && !isNaN(amount)) {
            transactions[editIndex] = { description, amount };

            // Save the updated transactions to LocalStorage
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Clear input fields and reset buttons
            descriptionInput.value = '';
            amountInput.value = '';
            editIndex = null;

            addTransactionButton.style.display = 'inline-block';
            saveTransactionButton.style.display = 'none';

            // Update UI
            updateBalance();
            displayTransactions();
        }
    }
}

function clearAllData() {
    transactions = [];
    localStorage.removeItem('transactions');
    updateBalance();
    displayTransactions();
}

// Event Listeners
addTransactionButton.addEventListener('click', addTransaction);
saveTransactionButton.addEventListener('click', saveTransaction);
clearDataButton.addEventListener('click', clearAllData);

// Initial load
updateBalance();
displayTransactions();
