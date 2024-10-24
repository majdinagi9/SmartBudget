// Elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('add-transaction');
const saveTransactionButton = document.getElementById('save-transaction');
const historyList = document.getElementById('history-list');
const balanceDisplay = document.getElementById('balance');
const clearDataButton = document.getElementById('clear-data');
const toggleHistoryButton = document.getElementById('toggle-history');
const historySection = document.getElementById('history-section');

let transactions = [];
let editIndex = null;

// Ensure the transaction history is hidden initially
historySection.style.display = 'none';

// Load existing transactions from LocalStorage for the logged-in user
function loadUserData() {
    const userTransactions = localStorage.getItem(`transactions_${userId}`);
    if (userTransactions) {
        transactions = JSON.parse(userTransactions);
    } else {
        transactions = [];  // Initialize an empty list for new users
    }
    updateBalance();
    displayTransactions();
}

// Save transactions to LocalStorage for the current user
function saveUserData() {
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
}

// Toggle Transaction History visibility
toggleHistoryButton.addEventListener('click', () => {
    if (historySection.style.display === 'none') {
        historySection.style.display = 'block';
        toggleHistoryButton.textContent = 'Hide Transaction History';
    } else {
        historySection.style.display = 'none';
        toggleHistoryButton.textContent = 'Show Transaction History';
    }
});

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

function displayTransactions() {
    historyList.innerHTML = ''; // Clear the history list
    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.innerHTML = `
            <span>${transaction.description}</span>
            <span>
                ${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}
                <button class="btn btn-danger btn-sm ms-2" onclick="deleteTransaction(${index})">Delete</button>
                <button class="btn btn-primary btn-sm ms-2" onclick="editTransaction(${index})">Edit</button>
            </span>
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

        // Save the updated transactions to LocalStorage for this user
        saveUserData();

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
    saveTransactionButton.style.display = 'block';
}

function saveTransaction() {
    if (editIndex !== null) {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);

        if (description && !isNaN(amount)) {
            transactions[editIndex] = { description, amount };

            // Save the updated transactions to LocalStorage for this user
            saveUserData();

            // Clear input fields and reset buttons
            descriptionInput.value = '';
            amountInput.value = '';
            editIndex = null;

            addTransactionButton.style.display = 'block';
            saveTransactionButton.style.display = 'none';

            // Update UI
            updateBalance();
            displayTransactions();
        }
    }
}

function deleteTransaction(index) {
    transactions.splice(index, 1); // Remove the transaction from the array
    saveUserData(); // Update LocalStorage
    updateBalance();
    displayTransactions(); // Refresh the list
}

function clearAllData() {
    transactions = [];
    localStorage.removeItem(`transactions_${userId}`);
    updateBalance();
    displayTransactions();
}

// Event Listeners
addTransactionButton.addEventListener('click', addTransaction);
saveTransactionButton.addEventListener('click', saveTransaction);
clearDataButton.addEventListener('click', clearAllData);

// Initial load will happen after user login
