const Todo=require('../models/Todo');
const {ZodError}=require('zod');

const handleError = (res, error,defaultMessage = 'Internal Server Error') => {
    if (error instanceof ZodError) {
        return res.status(400).json({message: 'Validation Error', errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({message:defaultMessage});
};


const createTodo= async (req,res)=>{
    try{
        const {title,description,category,priority,dueDate}=req.body;
        const userId=req.user.userId;

        const newTodo=new Todo({
            title,
            description,
            category,
            priority,
            dueDate,
            userId,
        });

        const savedTodo=await newTodo.save();

        res.status(201).json({
            message:'Todo created successfully',
            todo:savedTodo,
        })
    }catch(e){
        handleError(res,e,"failed to create todo");
    }
}


const getAllTodos=async(req,res)=>{
    try{
        const userId=req.user.userId;
        const todos= await Todo.find({userId})
              .sort({createdAt:-1})
              .populate('userId','username email')
            res.status(200).json({
                message: 'Todos retrieved successfully',
                todos,
            });
        } catch (error) {
            handleError(res, error, 'Failed to retrieve todos');
    }
};


const getTodoById=async(req,res)=>{
    try{
        const todoId=req.params.id;
        const todo=await Todo.findById(todoId).populate('userId','username email');

        if(!todo){
            return res.status(403).json({message:'Todo not found'});
        }

        // Checking if todo belongs to the loggedin user
        if (todo.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only access your own todos' }); 
        }

        res.status(200).json({
            message:'Todo retrieved successfully',
            todo,
        })
    }catch(error){
        handleError(res,req,'Failed to retrieve todo');
    }
};


const updateTodo= async (req,res)=>{
    try{
        const todoId = req.params.id;
        const { title, description, category, priority, completed, dueDate } = req.body;

        const todo=await Todo.findById(todoId);

        if(!todo){
            return res.status(404).json({message:'Todo not found'});
        }

        if(todo.userId.toString()!==req.user.userId){
            return res.status(403).json({message: 'Unauthorized: You can only update your own todos'});
        }

        const updatedTodo=await Todo.findByIdAndUpdate(
            todoId,
            {title,description,category,priority,completed,dueDate},
            {new:true, runValidators:true}
        ).populate('userId','username email');
        res.status(200).json({
            message:'Todo  updated successfully',
            todo:updatedTodo,
        });
    }catch(error){
        handleError(res,error,'Failed to update todo');
    }
}


const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (todo.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own todos' });
        }

        await Todo.findByIdAndDelete(todoId);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to delete todo');
    }
};

module.exports = {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
};