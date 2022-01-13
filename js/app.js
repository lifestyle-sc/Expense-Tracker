// Storage Controller
const LocalCtrl = (function () {

    const items = function initLS() {
        let array

        if(localStorage.getItem('items') === null) {
            array = []
        }else {
            array = JSON.parse(localStorage.getItem('items'))
        }

        return array
    }

    // Public method
    return {
        getLS : function () {
            return items()
        },

        setItemInLS : function (newData) {
            const itemsArr = items()

            itemsArr.push(newData)

            localStorage.setItem('items', JSON.stringify(itemsArr))
        },

        updateItemInLS : function (updatedItem) {
            const itemsArr = items()

            itemsArr.forEach((item, index) => {
                if(item.id === updatedItem.id) {
                    itemsArr.splice(index, 1, updatedItem)
                }
            })

            localStorage.setItem('items', JSON.stringify(itemsArr))
        },

        deleteItemFromLS : function (id) {
            const itemsArr = items()

            itemsArr.forEach((item, index) => {
                if(item.id === id) {
                    itemsArr.splice(index, 1)
                }
            })

            localStorage.setItem('items', JSON.stringify(itemsArr))
        },

        clearItemsFromLS : function () {
            localStorage.removeItem('items')
        }
    }
})()

// Item Controller
const ItemCtrl = (function () {
    // item constructor
    const Item = function(expense, amount, date, id) {
        this.expense = expense
        this.amount = amount
        this.date = date
        this.id = id
    }

    // data structure
    const data = {
        items : LocalCtrl.getLS(),
        currExpense : null,
        totalExpenses : 0
    }


    // Public method
    return {
        getItems : function() {
            return data.items
        },

        newItemData : function (newData) {
            const expense = newData.expense
            const amount = parseFloat(newData.amount)
            const date = newData.date
            let id

            // ID generator
            if(data.items.length === 0) {
                id = 0
            }else {
                id = data.items[data.items.length - 1].id + 1
            }

            // Declaring a new item object
            const item = new Item(expense, amount, date, id)

            // Pushing the new item object to data structure
            data.items.push(item)

            return item
        },

        updateDataStructure : function(update) {
            const amount = parseFloat(update.amount)
            const current = data.currExpense
            let updatedData

            data.items.forEach((item, index) => {
                if(item.id === current.id) {
                    updatedData = {
                        expense : update.expense,
                        amount : amount,
                        date : update.date,
                        id : item.id
                    }

                    data.items.splice(index, 1, updatedData)
                }
            })

            return updatedData
        },

        deleteItemFromDB : function(id) {
            data.items.forEach((item, index) => {
                if(item.id === id) {
                    data.items.splice(index, 1)
                }
            })
        },

        getTotalExpenses : function () {
            let total = 0

            data.items.forEach((item) => {
                total += item.amount
            })

            data.totalExpenses = total

            return data.totalExpenses
        },

        setCurrExpense : function (id) {
            let current = null

            data.items.forEach((item) => {
                if(item.id === id) {
                    current = item
                }
            })

            data.currExpense = current

        },

        getCurrExpense : function () {
            return data.currExpense
        },

        getItemsID : function () {
            const ids = data.items.map((item) => {
                return item.id
            })

            return ids
        },

        ClearAllItems : function () {
            const ids  = this.getItemsID()
            let result

            ids.forEach((id) => {
                result = data.items.filter((item) => {item.id === id})
            })

           data.items = result 
        },

        logData : function () {
            console.log(data)
        }
    }
})()

// UI Controller
const UICtrl = (function () {
    const uiSelectors = {
        UIexpenseBody : '#expense-body',
        UItotalExpenses : '#total-expenses',
        UIexpense : '#expense',
        UIamount : '#amount',
        UIdate : '#date',
        UIaddBtn : '.add-btn',
        UIupdateBtn : '.update-btn',
        UIdeleteBtn : '.delete-btn',
        UIclearBtn : '.clear-btn',
        UIbackBtn : '.back-btn',
        UIheaderTitle : '.header-title'
    }

    // Public method
    return {
        // Paint All item on the UI
        paintItems : function (items) {
            let html = ''
            if(items.length === 0) {
                html += `<tr id="item-false"><strong>No Expenses Added!</strong></tr>`
            }else {
                items.forEach(function(item) {
                    html += `
                    <tr id="item-${item.id}">
                        <td>${item.expense}</td>
                        <td>$${item.amount}</td>
                        <td>${item.date}</td>
                        <td><a href="#" class="edit green-text"><i class="fas fa-pencil-alt"></i></a></i></td>
                    </tr>
                    `
                })
            }

            document.querySelector(uiSelectors.UIexpenseBody).innerHTML = html
        },

        // Paint new item 
        paintNewItem : function (newItem) {
            const tr = document.createElement('tr')
            tr.id = `item-${newItem.id}`

            tr.innerHTML = `
            <td>${newItem.expense}</td>
            <td>$${newItem.amount}</td>
            <td>${newItem.date}</td>
            <td><a href="#" class="edit green-text"><i class="fas fa-pencil-alt"></i></a></td>
            `

            if(document.querySelector('#item-false')) {
                document.querySelector(uiSelectors.UIexpenseBody).innerHTML = ''
            }

            document.querySelector(uiSelectors.UIexpenseBody).insertAdjacentElement('beforeend', tr)
        },

        updateUI : function (id) {
            const idName = `#item-${id}`
            const updateData = this.getUIvalue()

            document.querySelector(idName).innerHTML = `
            <td>${updateData.expense}</td>
            <td>$${updateData.amount}</td>
            <td>${updateData.date}</td>
            <td><a href="#" class="edit green-text"><i class="fas fa-pencil-alt"></i></a></td>  
            `
        },

        // Paint total expense on UI
        paintTotalExpenses : function(total) {
            document.querySelector(uiSelectors.UItotalExpenses).textContent = `$${total}`
        },

        // get UI value 
        getUIvalue : function () {
            const expense = document.querySelector(uiSelectors.UIexpense).value
            const amount = document.querySelector(uiSelectors.UIamount).value
            const date = document.querySelector(uiSelectors.UIdate).value

            return {
                expense, 
                amount,
                date
            }
        },

        validateInput : function () {
            const data = this.getUIvalue()
            const re = /^[0-9]+\.?[0-9]{0,2}$/
            let match 

            if(re.test(parseFloat(data.amount))){
                match = true
            }else {
                match = false
            }

            if(data.expense === '' || !match || data.date === '') {
                return true
            }else {
                return false
            }

        },

        deleteItemFromUI : function (id) {
            const idName = `item-${id}`

            document.getElementById(idName).remove()
        },

        clearExpensesUI : function (ids) {
            let idname 
            ids.forEach((id) => {
                idname = `item-${id}`
                document.getElementById(idname).remove()
                
            })
        },

        // enableEditState
        enableEditState : function (target) {
            // Assign value to input fields
            document.querySelector(uiSelectors.UIexpense).value = target.previousElementSibling.previousElementSibling.previousElementSibling.textContent
            document.querySelector(uiSelectors.UIamount).value = target.previousElementSibling.previousElementSibling.textContent.split('$')[1]
            document.querySelector(uiSelectors.UIdate).value = target.previousElementSibling.textContent

            // Change header text to edit
            document.querySelector(uiSelectors.UIheaderTitle).textContent = 'Edit Expense'

            // Style add and clear button none
            document.querySelector(uiSelectors.UIaddBtn).style.display = 'none'
            document.querySelector(uiSelectors.UIclearBtn).style.display = 'none'

            // Style update, delete and back btn inline
            document.querySelector(uiSelectors.UIupdateBtn).style.display = 'inline'
            document.querySelector(uiSelectors.UIdeleteBtn).style.display = 'inline'
            document.querySelector(uiSelectors.UIbackBtn).style.display = 'inline'

        },

        // disableEditState
        disableEditState : function () {
            this.clearInputFields()

            // Change header text back to add
            document.querySelector(uiSelectors.UIheaderTitle).textContent = 'Add Expense'

            // Style add and clear button inline
            document.querySelector(uiSelectors.UIaddBtn).style.display = 'inline'
            document.querySelector(uiSelectors.UIclearBtn).style.display = 'inline'

            // Style update, delete and back btn none
            document.querySelector(uiSelectors.UIupdateBtn).style.display = 'none'
            document.querySelector(uiSelectors.UIdeleteBtn).style.display = 'none'
            document.querySelector(uiSelectors.UIbackBtn).style.display = 'none'

        },

        // Clear input fields
        clearInputFields : function () {
            document.querySelector(uiSelectors.UIexpense).value = ''
            document.querySelector(uiSelectors.UIamount).value = ''
            document.querySelector(uiSelectors.UIdate).value = ''
        },

        showAlert : function (message, className) {
            const div = document.createElement('div')
            div.className = className
            div.appendChild(document.createTextNode(message))

            const parentCont = document.querySelector('.main-container')
            const sibling = document.querySelector('.total-expenses-h')

            parentCont.insertBefore(div, sibling)

            setTimeout(() => {
                this.clearAlert()
            }, 2000)
        },

        clearAlert : function () {
            const currAlert = document.querySelector('.alert')

            if(currAlert) {
                currAlert.remove()
            }
        },

        // get UI selectors
        getUIselectors : function () {
            return uiSelectors
        }
    }
})()

// App Controller
const App = (function (ItemCtrl, LocalCtrl, UICtrl) {

    const loadAllEventListeners = function() {
        const UIselectors = UICtrl.getUIselectors()

        // Add expense event listener
        document.querySelector(UIselectors.UIaddBtn).addEventListener('click', addExpenseSubmit)

        // Disable enter key to submit on click
        document.addEventListener('click', (e) => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        // Show edit state event listener
        document.querySelector(UIselectors.UIexpenseBody).addEventListener('click', enableEditClick)

        // Update expense event listener
        document.querySelector(UIselectors.UIupdateBtn).addEventListener('click', updateItemSubmit)

        // Delete expense event listener
        document.querySelector(UIselectors.UIdeleteBtn).addEventListener('click', deleteItemSubmit)

        // Back event listener
        document.querySelector(UIselectors.UIbackBtn).addEventListener('click', (e) => {
            // Disable edit state method
            UICtrl.disableEditState()

            e.preventDefault()
        })
        // Clear expenses event listener
        document.querySelector(UIselectors.UIclearBtn).addEventListener('click', clearExpensesSubmit)
    }

    function addExpenseSubmit (e) {
        const newData = UICtrl.getUIvalue()

        
        if(UICtrl.validateInput()) {
            // show danger alert
            UICtrl.showAlert('Please fill all fields!', 'alert alert-danger')
        }else {
            // show success alert
            UICtrl.showAlert('Expense added', 'alert alert-success')
            // get new item created in data structure
            const newItem = ItemCtrl.newItemData(newData)

            // Paint new item on the UI
            UICtrl.paintNewItem(newItem)

            // add item to LS
            LocalCtrl.setItemInLS(newItem)

            // get total expenses
            const totalExpenses = ItemCtrl.getTotalExpenses()

            // call paint totalExpenses
            UICtrl.paintTotalExpenses(totalExpenses)

            // clear input field
            UICtrl.clearInputFields()

            //console.log(newItem)
        }

        e.preventDefault()
    }

    // function to enable edit state
    function enableEditClick(e) {
        if(e.target.parentElement.classList.contains('edit')) {
            // Enable edit state
            UICtrl.enableEditState(e.target.parentElement.parentElement)

            // get target id
            const elementID = e.target.parentElement.parentElement.parentElement.id.split('-')

            const id = parseInt(elementID[1])

            ItemCtrl.setCurrExpense(id)

            //console.log(ItemCtrl.getCurrExpense(id))
           
        }

        e.preventDefault()
    }

    // Update expense function
    function updateItemSubmit(e) {
        const updatedData = UICtrl.getUIvalue()
        const id = ItemCtrl.getCurrExpense().id

        // Update data structures 
       const updatedItem =  ItemCtrl.updateDataStructure(updatedData)

        // Update UI
        UICtrl.updateUI(id)

        // updated LS
        LocalCtrl.updateItemInLS(updatedItem)

        // show alert message for updating
        UICtrl.showAlert('Expense Updated', 'alert alert-success')

        // get total expenses
        const totalExpenses = ItemCtrl.getTotalExpenses()

        // call paint totalExpenses
        UICtrl.paintTotalExpenses(totalExpenses)

        // Disable edit state
        UICtrl.disableEditState()

        e.preventDefault()
    }

    // Delete expense submit function
    function deleteItemSubmit(e) {
        const id = ItemCtrl.getCurrExpense().id

        // delete expense from data structure
        ItemCtrl.deleteItemFromDB(id)

        // delete expense from UI
        UICtrl.deleteItemFromUI(id)

        // Delete item from ls
        LocalCtrl.deleteItemFromLS(id)

        // show alert message for deleting
        UICtrl.showAlert('Expense Deleted', 'alert alert-success')

        // get total expenses
        const totalExpenses = ItemCtrl.getTotalExpenses()

        // call paint totalExpenses
        UICtrl.paintTotalExpenses(totalExpenses)

        // Disable edit state
        UICtrl.disableEditState()

        e.preventDefault()
    }

    // clear expenses submit
    function clearExpensesSubmit(e) {
        const ids = ItemCtrl.getItemsID()

        if(ItemCtrl.getItems().length === 0) {
            UICtrl.showAlert('No Expenses Avaliable!', 'alert alert-warning')
        }else {
            if(confirm('Are you sure')) {
                UICtrl.showAlert('Expenses Removed', 'alert alert-success')
                // Clear expenses from data structure
                ItemCtrl.ClearAllItems()
                // Clear All expenses from UI
                UICtrl.clearExpensesUI(ids)

                // Clear all expenses from LS
                LocalCtrl.clearItemsFromLS()

                // get total expenses
                const totalExpenses = ItemCtrl.getTotalExpenses()

                // call paint totalExpenses
                UICtrl.paintTotalExpenses(totalExpenses)
            }
        }

        //console.log(ItemCtrl.getItems().length)

        e.preventDefault()
    }

    // Public method
    return {
        init : function () {
            UICtrl.disableEditState()

            const items = ItemCtrl.getItems()
            UICtrl.paintItems(items)

            // get total expenses
            const totalExpenses = ItemCtrl.getTotalExpenses()

            // call paint totalExpenses
            UICtrl.paintTotalExpenses(totalExpenses)

            loadAllEventListeners()

        }
    }
})(ItemCtrl, LocalCtrl, UICtrl) 

// calls init on page load
App.init()