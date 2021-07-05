'use strict';

const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const itemContainer = document.querySelector('#container');
const storage = window.localStorage;

class TodoList {
    static idCounter = Number(storage.getItem('idCounter')) || 0;

    constructor() {
        this.data = JSON.parse(storage.getItem('data')) || [];
        this.itemCount = this.data.length || 0;
    }

    static spanFromInput(span, btn, input) {
        span.textContent = input.value;
        span.style.display = 'inline-block';
        input.remove();
        btn.disabled = false;
    }

    init() {
        this.data.forEach(item => {
            const html = `
            <div class="todo-item ${item.isActive ? 'completed-item' : ''}" id="item-${item.id}">
              <div class="todo-item__text">
                <span class="todo-item-description ${item.isActive ? 'completed-text' : ''}">${item.description}</span>
              </div>

              <div class="todo-item__buttons">
                <button class="todo-item__buttons--done"><i class="${item.isActive ? 'fad fa-check-double' : 'fad fa-check'}"></i></button>
                <button class="todo-item__buttons--edit"><i class="fad fa-edit"></i></button>
                <button class="todo-item__buttons--delete"><i class="fad fa-trash-alt"></i></button>
              </div>
             </div>
        `;

            itemContainer.insertAdjacentHTML('beforeend', html);
            this.addButtonEvents(item.id);
        });
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

        this.itemCount++;

        itemContainer.insertAdjacentHTML('beforeend', html);

        this.addButtonEvents(TodoList.idCounter);
        this.addItemData(input.value);

        input.value = '';
    }

    deleteItem(item) {
        item.remove();

        const id = Number(item.id.match(/\d+/g)[0]);
        const itemDataIndex = this.data.findIndex(item => item.id === id);
        this.data.splice(itemDataIndex, 1);

        this.itemCount--;

        storage.setItem('data', JSON.stringify(todo.data));
        storage.setItem('itemCount', `${this.itemCount}`);
    }

    editItem(itemText, editBtn) {
        const item = itemText.parentElement.parentElement;
        const itemTextValue = itemText.textContent;
        const id = Number(item.id.match(/\d+/g)[0]);

        itemText.style.display = 'none';
        const input = document.createElement('input');
        input.value = itemTextValue;
        input.classList.add('edit-input');
        input.setAttribute('type', 'text');

        itemText.parentElement.appendChild(input);
        input.focus();

        input.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                TodoList.spanFromInput(itemText, editBtn, input);
                this.updateItemData(id, input.value);
            }
        });

        const listener = (event) => {
            if (event.target !== input && event.target !== editBtn.firstElementChild) {
                TodoList.spanFromInput(itemText, editBtn, input);
                this.updateItemData(id, input.value);
                window.removeEventListener('click', listener);
            }
        };

        // Here I needed named function to be able to remove the listener.
        window.addEventListener('click', listener);
    }

    completeItem(item, itemText, btn) {
        item.classList.toggle('completed-item');
        itemText.classList.toggle('completed-text');

        const id = Number(item.id.match(/\d+/g)[0]);
        const itemData = this.data.find(item => item.id === id);
        itemData.isActive = !itemData.isActive;
        storage.setItem('data', JSON.stringify(todo.data));

        item.classList.contains('completed-item') ?
            btn.firstElementChild.setAttribute('class', 'fad fa-check-double') :
            btn.firstElementChild.setAttribute('class', 'fad fa-check');
    }

    addButtonEvents(id) {
        const currentItem = document.querySelector(`#item-${id}`);
        const currentItemText = currentItem.children[0].firstElementChild;

        const currentItemCompleteBtn = currentItem.children[1].children[0];
        const currentItemEditBtn = currentItem.children[1].children[1];
        const currentItemDeleteBtn = currentItem.children[1].children[2];

        currentItemDeleteBtn.addEventListener('click', () => {
            this.deleteItem(currentItem);
        });

        currentItemEditBtn.addEventListener('click', (event) => {
            this.editItem(currentItemText, currentItemEditBtn);
            currentItemEditBtn.disabled = true;
        });

        currentItemCompleteBtn.addEventListener('click', (event) => {
            this.completeItem(currentItem, currentItemText, currentItemCompleteBtn);
        });
    }

    updateItemData(id, text) {
        const itemData = this.data.find(item => item.id === id);
        itemData.description = text;
        storage.setItem('data', JSON.stringify(todo.data));
    }

    addItemData(description) {
        const item = {};

        item.id = TodoList.idCounter;
        item.description = description;
        item.isActive = false;

        this.data.push(item);
        TodoList.idCounter++;

        storage.setItem('data', JSON.stringify(todo.data));
        storage.setItem('idCounter', `${TodoList.idCounter}`);
        storage.setItem('itemCount', `${this.itemCount}`);
    }

}

const todo = new TodoList();

addBtn.addEventListener('click', () => {
    todo.addItem();
});

window.addEventListener('load', () => {
    todo.init();
});

