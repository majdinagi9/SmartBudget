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
const exportDataButton = document.getElementById('export-data'); // Reference export button

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

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
}

function displayTransactions() {
    historyList.innerHTML = ''; // Clear the history list
    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.dataset.index = index; // Store the index for reordering
        listItem.innerHTML = `
            <span>${transaction.description}</span>
            <span>
                ${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}
                <button class="btn btn-danger btn-sm ms-2" onclick="deleteTransaction(${index})">Delete</button>
                <button class="btn btn-primary btn-sm ms-2" onclick="editTransaction(${index})">Edit</button>
            </span>
        `;
        listItem.setAttribute('draggable', true); // Make item draggable for desktop
        historyList.appendChild(listItem);
    });

    enableDragAndDrop(); // Enable drag and drop
}

function enableDragAndDrop() {
    const items = historyList.querySelectorAll('li');
    let draggedItem = null;

    items.forEach(item => {
        // For desktop
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            setTimeout(() => (item.style.display = 'none'), 0);
        });
        item.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
        item.addEventListener('dragover', (e) => e.preventDefault());
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem) {
                historyList.insertBefore(draggedItem, item);
                updateTransactionOrder(); // Update transactions order
            }
        });

        // For mobile (touch events)
        item.addEventListener('touchstart', (e) => {
            draggedItem = item;
            e.target.style.opacity = 0.5;
        });
        item.addEventListener('touchmove', (e) => {
            const touchLocation = e.targetTouches[0];
            item.style.position = "absolute";
            item.style.left = `${touchLocation.pageX}px`;
            item.style.top = `${touchLocation.pageY}px`;
        });
        item.addEventListener('touchend', (e) => {
            e.target.style.opacity = 1;
            item.style.position = "relative";
            item.style.left = "0px";
            item.style.top = "0px";
            if (draggedItem && e.target !== draggedItem) {
                historyList.insertBefore(draggedItem, e.target);
                updateTransactionOrder();
            }
        });
    });
}

// Update the transaction order based on the new order in the DOM
function updateTransactionOrder() {
    const reorderedItems = Array.from(historyList.querySelectorAll('li'));
    transactions = reorderedItems.map(item => {
        const index = item.dataset.index;
        return transactions[index];
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
}

// Export to CSV functionality
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

// Event Listeners
addTransactionButton.addEventListener('click', addTransaction);
saveTransactionButton.addEventListener('click', saveTransaction);
clearDataButton.addEventListener('click', clearAllData);
exportDataButton.addEventListener('click', exportToCSV); // Attach export functionality

// Initial load
updateBalance();
displayTransactions();
