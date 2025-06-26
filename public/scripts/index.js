document.addEventListener('DOMContentLoaded', function () {
    toggleSubtasks();
    subtasksFormGroup();
});

function toggleSubtasks() {
    const taskToggleBtns = document.querySelectorAll('.toggle-subtasks-btn');
    if (taskToggleBtns.length == 0) {
        return;
    }

    taskToggleBtns.forEach((button) => {
        button.addEventListener('click', function (e) {
            const taskId = this.getAttribute('data-task-id');
            const subtasksList = document.getElementById('subtasks-' + taskId);
            const icon = this.querySelector('i');
            subtasksList.classList.toggle('d-none');
            icon.classList.toggle('bi-chevron-compact-down');
            icon.classList.toggle('bi-chevron-compact-up');
        });
    });
}

function subtasksFormGroup() {
    const container = document.getElementById('subtasks-container');
    const addBtn = document.getElementById('add-subtask-btn');
    if (!container || !addBtn) {
        return;
    }

    function getNextIndex() {
        const rows = container.querySelectorAll('.subtask-row');
        return rows.length;
    }

    function renumberSubtasks() {
        const rows = container.querySelectorAll('.subtask-row');
        rows.forEach((row, index) => {
            const title = row.querySelector('input[name$="[title]"]');
            const done = row.querySelector('input[name$="[done]"]');

            title.name = `subtasks[${index}][title]`;
            done.name = `subtasks[${index}][done]`;
        });
    }

    addBtn.addEventListener('click', () => {
        const index = getNextIndex();

        const row = document.createElement('div');
        row.className = 'subtask-row input-group mb-1';
        row.innerHTML = `
            <input type="text" name="subtasks[${index}][title]" class="form-control" required placeholder="Subtask title" />
            <input type="hidden" name="subtasks[${index}][done]" value="false" />
            <button type="button" class="btn btn-outline-danger remove-subtask-btn">
                <i class="bi bi-x"></i>
            </button>
        `;
        container.appendChild(row);
    });

    container.addEventListener('click', (e) => {
        if (e.target.closest('.remove-subtask-btn')) {
            const row = e.target.closest('.subtask-row');
            row.remove();
            renumberSubtasks();
        }
    });
}
