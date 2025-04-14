const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    done: { type: Boolean, default: false, },
}, { _id: false });

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    done: { type: Boolean, default: false, },
    description: { type: String, },
    deadline: { type: Date, },
    priority: {
        type: Number,
        min: 1,
        max: 3,
        default: 2,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} must be an integer',
        }
    },
    subtasks: { type: [subtaskSchema], },
}, { timestamps: true, });

taskSchema.virtual('overdue').get(function() {
    return !this.done && this.deadline > Date.now();
});

module.exports = mongoose.model("Task", taskSchema);