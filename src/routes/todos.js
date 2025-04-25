const express = require('express');
const {createTodo,getAllTodos,getTodoById,updateTodo,deleteTodo,} = require('../controllers/todoController'); 
const authMiddleware = require('../middleware/authMiddleware'); 
const { validateTodo } = require('../validators/todoValidator');
const router = express.Router();

router.use(authMiddleware);

router.post('/', validateTodo, createTodo);       

router.get('/', getAllTodos);  

router.get('/:id', getTodoById);

router.put('/:id', validateTodo, updateTodo);

router.delete('/:id', deleteTodo); 

module.exports = router;
