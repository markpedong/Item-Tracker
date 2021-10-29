// Select Items
const alert = document.querySelector('.alert')
const form = document.querySelector('.form-control')
const items = document.getElementById('items')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.item-container')
const list = document.querySelector('.item-list')
const clearBtn = document.querySelector('.clear-btn')


// Edit Option
let editElement;
let editFlag = false;
let editID = "";

// Functions
addItem = (e) => {
    e.preventDefault();
    const value = items.value;

    const id = new Date().getTime().toString()
    if (value && !editFlag) {
        createListItem(id, value)
        displayAlert('Item added to the list', 'success');
        // show container
        container.classList.add('show-container')
        //add to Local Storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault()

    }else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlert('Value changed', 'success');
        // edit Local Storage
        editLocalStorage(editID, value);
        setBackToDefault()
    }else{
        displayAlert("Please Enter value", "danger" )
        
    }
}
// display alert
displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)
    
    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
        
    }, 1000)
}

// Clear Function
clearItems = () => {
    const itemValues = document.querySelectorAll('.itemsList')

    if (itemValues.length > 0) {
        itemValues.forEach(function (item) {
            list.removeChild(item)
        });
    }
    container.classList.remove("show-container")
    displayAlert("Empty list", "danger") 
    setBackToDefault()
    localStorage.removeItem('list');
}
// EditFunction
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set Edit Item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // Set form value
    items.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
}
// Delete Function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // removeFromLocalStorage
    removeFromLocalStorage(id)
}

// set back to default
setBackToDefault = () => {
    items.value = '';
    editFlag = false;
    editID = "";
    submitBtn.text = "Submit";
}

// Local Storage
addToLocalStorage = (id, value) => {
    const itemsObj = {id, value}
    let itemsArr = getLocalStorage()
    console.log(itemsArr);
    
    itemsArr.push(itemsObj);
    localStorage.setItem('list', JSON.stringify(itemsArr))
   
}
removeFromLocalStorage = (id) =>{
    let itemsArr = getLocalStorage();

    itemsArr = itemsArr.filter(function (item) {
        if (item.id !==id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(itemsArr))
}

// EditFrom Local Storage
editLocalStorage = (id, value) => {
    let itemsArr = getLocalStorage();
    itemsArr = itemsArr.map(function (items) {
        if (items.id === id) {
            items.value = value;
        }

        return items;
    })
    localStorage.setItem('list', JSON.stringify(itemsArr))
}

getLocalStorage = () => {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
}

// Setuptems
setupItems = () => {
    let itemsArr = getLocalStorage();
    if (itemsArr.length > 0) {
        itemsArr.forEach(function (item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

createListItem = (id, value) => {
    const element = document.createElement('article');
    // add Class
    element.classList.add('itemsList');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="item-listTitle">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="far fa-edit fa-lg" style="cursor: pointer;"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash-alt fa-lg" style="cursor: pointer;"></i>
        </button>
    </div>`;

    // Edit and Delete Item
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    
    //append child
    list.appendChild(element);
}

// Event Listeners

//submitForm
submitBtn.addEventListener("click", addItem);
// ClearItems
clearBtn.addEventListener("click", clearItems)
// load Items
window.addEventListener('DOMContentLoaded', setupItems);

