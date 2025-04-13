document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');
    modal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const id = button.getAttribute('data-id');
        const title = button.getAttribute('data-title');

        document.getElementById('edit-id').value = id;
        document.getElementById('edit-title').value = title;

        document.getElementById('editForm').action = `/edit/${id}`;
    });
});