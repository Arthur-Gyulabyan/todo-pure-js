'use strict';

const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const itemContainer = document.querySelector('#container');

class TodoList {
    static idCounter = 0;

    constructor() {
        this.itemCount = 0;
    }

    addItem() {
        if (input.value === '') {
            return;
        }

        const html = `
            <div class="todo-item" id="item-${TodoList.idCounter}">
              <div class="todo-item__text">
                <span class="todo-item-description">${input.value}</span>
              </div>

              <div class="todo-item__buttons">
                <button class="todo-item__buttons--done"><i class="fad fa-check"></i></button>
                <button class="todo-item__buttons--edit"><i class="fad fa-edit"></i></button>
                <button class="todo-item__buttons--delete"><i class="fad fa-trash-alt"></i></button>
              </div>
             </div>
`;

        itemContainer.insertAdjacentHTML('beforeend', html);
        input.value = '';

        this.addButtonEvents();
        this.updateData();
    }

    deleteItem(item) {
        item.remove();
    }

    editItem(itemText, editBtn) {
        const itemTextValue = itemText.textContent;
        console.log(itemText);

        itemText.style.display = 'none';
        const input = document.createElement('input');
        input.value = itemTextValue;
        input.classList.add('edit-input');
        input.setAttribute('type', 'text');

        itemText.parentElement.appendChild(input);
        input.focus();

        input.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                itemText.textContent = input.value;
                itemText.style.display = 'inline-block';
                input.remove();
                editBtn.disabled = false;
            }
        });


    }

    addButtonEvents() {
        const currentItem = document.querySelector(`#item-${TodoList.idCounter}`);
        const currentItemText = currentItem.children[0].firstElementChild;

        const currentItemEditBtn = currentItem.children[1].children[1];
        const currentItemDeleteBtn = currentItem.children[1].children[2];

        currentItemDeleteBtn.addEventListener('click', () => {
            this.deleteItem(currentItem);
        });

        currentItemEditBtn.addEventListener('click', (event) => {
           this.editItem(currentItemText, currentItemEditBtn);
           currentItemEditBtn.disabled = true;
            console.log(currentItemEditBtn);
        });
    }

    updateData() {
        TodoList.idCounter++;
    }

}

const todo = new TodoList();

addBtn.addEventListener('click', () => {
    todo.addItem();
});
