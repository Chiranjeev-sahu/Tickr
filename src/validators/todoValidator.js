const { z } = require('zod');

const todoSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    // category: z.string().min(1).max(50).optional(), 
    priority: z.enum(['high', 'medium', 'low']).optional(),
    completed: z.boolean().default(false),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }).optional().transform((val) => (val ? new Date(val) : undefined)),
    status: z.enum(['todo', 'inprogress', 'completed', 'overdue']).optional().default('todo'),
});

const validateTodo = (req, res, next) => {
    const result = todoSchema.safeParse(req.body);
    if (result.success) {
        next();
    } else {
        return res.status(400).json({ message: 'Validation Error', errors: result.error.errors });
    }
};

module.exports = { validateTodo };
