import storage from "./util/storage.js"
const init = {
    todos: storage.get(),
    filter: 'all',
    filters: {
        all: () => true,
        active: todo => !todo.isCompleted,
        completed: todo => todo.isCompleted
    },
    editIndex: null
}

const actions = {
    add({ todos }, title) {
        title = title.trim()
        todos.push({title, isCompleted: false})
        storage.set(todos)
    },
    delete({ todos }, index) {
        todos.splice(index, 1)
        storage.set(todos)
    },
    toggle({ todos }, index) {
        todos[index].isCompleted = !todos[index].isCompleted
        storage.set(todos)
    },
    switchFilter(state, newType) {
        state.filter = newType
    },
    clearCompleted(state) {
        state.todos = state.todos.filter(state.filters.active)
        storage.set(state.todos)
    },
    startEdit(state, index) {
        state.editIndex = index
    },
    endEdit(state, index, newValue) {
        if (newValue.trim() !== '') {
            state.todos[index].title = newValue.trim()
        } else {
            actions.delete(state, index)
        }
        state.editIndex = null
        storage.set(state.todos)
    },
    cancelEdit(state) {
        state.editIndex = null
    }
}

export default function reducer(state = init, action, args) {
    actions[action] && actions[action](state, ...args)
    return state
}