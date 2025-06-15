const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        done: { type: Boolean, default: false },
    },
    { _id: false }
);

const taskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
        title: { type: String, required: true },
        done: { type: Boolean, default: false },
        description: { type: String },
        deadline: { type: Date },
        priority: {
            type: Number,
            min: 1,
            max: 3,
            default: 2,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer',
            },
        },
        subtasks: { type: [subtaskSchema] },
        completedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

async function updateCompletedAt(next) {
    const updated = this;
    updated.completedAt = updated.done ? new Date() : undefined;
    next();
}

taskSchema.virtual('overdue').get(function () {
    return !this.done && Date.now() > this.deadline;
});

taskSchema.pre('save', updateCompletedAt);
taskSchema.pre('findOneAndUpdate', updateCompletedAt);

module.exports = mongoose.model('Task', taskSchema);
