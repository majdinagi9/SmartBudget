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
const exportDataButton = document.getElementById('export-data');

// Transactions array and edit index
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editIndex = null;

// Initialize UI
updateBalance();
displayTransactions();
historySection.style.display = 'none'; // Start with history hidden

// Function to update balance
function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

// Function to display transactions in the list
function displayTransactions() {
    historyList.innerHTML = '';
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

// Add new transaction
function addTransaction() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    if (description && !isNaN(amount)) {
        transactions.push({ description, amount });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        descriptionInput.value = '';
        amountInput.value = '';
        updateBalance();
        displayTransactions();
    }
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    displayTransactions();
}

// Edit transaction
function editTransaction(index) {
    editIndex = index;
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    addTransactionButton.style.display = 'none';
    saveTransactionButton.style.display = 'block';
}

// Save edited transaction
function saveTransaction() {
    if (editIndex !== null) {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        if (description && !isNaN(amount)) {
            transactions[editIndex] = { description, amount };
            localStorage.setItem('transactions', JSON.stringify(transactions));
            descriptionInput.value = '';
            amountInput.value = '';
            editIndex = null;
            addTransactionButton.style.display = 'block';
            saveTransactionButton.style.display = 'none';
            updateBalance();
            displayTransactions();
        }
    }
}

// Export transactions to CSV
function exportToCSV() {
    const csvContent = "Description,Amount\n" + 
        transactions.map(t => `${t.description},${t.amount}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Clear all transactions
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
toggleHistoryButton.addEventListener('click', () => {
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
    toggleHistoryButton.textContent = historySection.style.display === 'none' ? 'Show Transaction History' : 'Hide Transaction History';
});
exportDataButton.addEventListener('click', exportToCSV);
