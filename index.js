const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const itemContainer = document.querySelector('#container');

class TodoList {
    constructor() {
        this.itemCount = 0;
    }

    addItem() {
        if (input.value === '') {
            return;
        }

        const html = `
            <div class="todo-item">
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
    }
}

const todo = new TodoList();

addBtn.addEventListener('click', todo.addItem);
