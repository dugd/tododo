document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.toggle-subtasks-btn').forEach((button) => {
        button.addEventListener('click', function (e) {
            const taskId = this.getAttribute('data-task-id');
            const subtasksList = document.getElementById('subtasks-' + taskId);
            const icon = this.querySelector('i');
            subtasksList.classList.toggle('d-none');
            icon.classList.toggle('bi-chevron-compact-down');
            icon.classList.toggle('bi-chevron-compact-up');
        });
    });
});
