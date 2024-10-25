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
historySection.style.display = 'none';

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

// Add new transaction
function addTransaction() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    // Ensure valid input before adding
    if (description && !isNaN(amount)) {
        const transaction = { description, amount };
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Clear input fields
        descriptionInput.value = '';
        amountInput.value = '';

        // Update balance and display
        updateBalance();
        displayTransactions();
    } else {
        alert("Please enter a valid description and amount.");
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

// Enable Drag-and-Drop for Desktop and Mobile
function enableDragAndDrop() {
    const items = historyList.querySelectorAll('li');
    let draggedItemIndex = null;

    items.forEach(item => {
        // Desktop drag events
        item.addEventListener('dragstart', (e) => {
            draggedItemIndex = item.dataset.index;
            setTimeout(() => (item.style.display = 'none'), 0);
        });
        item.addEventListener('dragend', () => {
            setTimeout(() => {
                item.style.display = 'block';
                draggedItemIndex = null;
            }, 0);
        });
        item.addEventListener('dragover', (e) => e.preventDefault());
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetIndex = e.target.closest('li').dataset.index;
            if (draggedItemIndex !== null && targetIndex !== null) {
                reorderTransactions(draggedItemIndex, targetIndex);
            }
        });

        // Mobile touch events
        item.addEventListener('touchstart', (e) => {
            draggedItemIndex = item.dataset.index;
            item.style.opacity = 0.5;
        });
        item.addEventListener('touchmove', (e) => {
            const touchLocation = e.targetTouches[0];
            item.style.position = "absolute";
            item.style.left = `${touchLocation.pageX}px`;
            item.style.top = `${touchLocation.pageY}px`;
        });
        item.addEventListener('touchend', (e) => {
            item.style.opacity = 1;
            item.style.position = "relative";
            item.style.left = "0px";
            item.style.top = "0px";
            const targetElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            const targetIndex = targetElement.closest('li')?.dataset.index;
            if (draggedItemIndex !== null && targetIndex !== null && draggedItemIndex !== targetIndex) {
                reorderTransactions(draggedItemIndex, targetIndex);
            }
        });
    });
}

// Function to reorder transactions in array and update UI
function reorderTransactions(fromIndex, toIndex) {
    const item = transactions.splice(fromIndex, 1)[0];
    transactions.splice(toIndex, 0, item);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions(); // Refresh the display to reflect new order
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

// Event Listeners for basic functions
addTransactionButton.addEventListener('click', addTransaction);
saveTransactionButton.addEventListener('click', saveTransaction);
clearDataButton.addEventListener('click', clearAllData);
toggleHistoryButton.addEventListener('click', () => {
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
    toggleHistoryButton.textContent = historySection.style.display === 'none' ? 'Show Transaction History' : 'Hide Transaction History';
});
exportDataButton.addEventListener('click', exportToCSV);
