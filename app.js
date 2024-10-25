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
const exportDataButton = document.getElementById('export-data'); // New Export Button

// Load existing transactions from LocalStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editIndex = null;

// Ensure the transaction history is hidden initially
historySection.style.display = 'none';

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

// Update balance and display transactions
function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

function displayTransactions() {
    historyList.innerHTML = ''; // Clear the history list
    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.setAttribute('draggable', true); // Make the item draggable
        listItem.dataset.index = index; // Store the index for reordering
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

    makeItemsDraggable(); // Enable drag functionality
}

// Drag and drop functionality
function makeItemsDraggable() {
    const items = historyList.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', drop);
        item.addEventListener('dragend', dragEnd);
    });
}

let draggedItemIndex;

function dragStart(event) {
    draggedItemIndex = event.target.dataset.index;
    event.target.style.opacity = 0.5;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    const targetIndex = event.target.closest('li').dataset.index;
    [transactions[draggedItemIndex], transactions[targetIndex]] = [transactions[targetIndex], transactions[draggedItemIndex]]; // Swap items
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Update LocalStorage
    displayTransactions(); // Refresh list
}

function dragEnd(event) {
    event.target.style.opacity = 1;
}

// Export to CSV functionality
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Description,Amount\n";
    transactions.forEach(transaction => {
        csvContent += `${transaction.description},${transaction.amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
addTransactionButton.addEventListener('click', addTransaction);
saveTransactionButton.addEventListener('click', saveTransaction);
clearDataButton.addEventListener('click', clearAllData);
exportDataButton.addEventListener('click', exportToCSV); // Add export button functionality

// Initial load
updateBalance();
displayTransactions();
