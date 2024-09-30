import React, { useState, useEffect } from 'react';

const TodolisAPI = () => {
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [newTask, setNewTask] = useState(''); // Nueva tarea que se está escribiendo
  const [error, setError] = useState(null); // Estado para manejar errores
  const apiUrlGet = "https://playground.4geeks.com/todo/users/alex_cordoba"; // URL base de la API
  const apiUrlPost = "https://playground.4geeks.com/todo/todos/alex_cordoba";
  const apiUrlDelete = "https://playground.4geeks.com/todo/todos";
  // Función para obtener la lista de tareas (GET request)
  const fetchTasks = () => {
    fetch(apiUrlGet)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching tasks');
        }
        return response.json();
      })
      .then((data) => {
        // Asignar un id único si la API no lo provee
        const tasksWithIds = data.todos.map((task, index) => ({
          ...task,
          id: task.id || index, // Si no tiene id, asignamos uno temporalmente basado en el índice
        }));
        setTasks(Array.isArray(tasksWithIds) ? tasksWithIds : []); // Verifica que los datos sean un array
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks');
      });
  };
 

  // Función para agregar una nueva tarea
  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObject = {  label: newTask, is_done: false }; // Generamos un id usando Date.now()
      const updatedTasks = [...tasks, newTaskObject]; // Crear la nueva lista de tareas con la nueva tarea
     
      fetch(apiUrlPost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskObject),
        
      })
        .then((response) => {
          setTasks([...tasks, newTaskObject])
          setNewTask("")
          
          }
         
        )
        .catch((error) => {
          console.error('Error tasks:', error);
          setError('Failed to update tasks');
        });
        console.log(updatedTasks)
    };
  };

  // Función para eliminar una tarea por id
  
    //hacemos una peticion delete a la aip usando id
  // Función para eliminar una tarea por id
const deleteTask = (id) => {
  // Hacemos la petición DELETE a la API usando el ID de la tarea
  
  fetch(`${apiUrlDelete}/${id}`, {
    method: 'DELETE',
    headers:{
      'Content-Type':'application/json'
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error deleting task');
      }
      // Si la tarea se eliminó correctamente en la API, la eliminamos localmente también
      const updatedTasks = tasks.filter((task) => task.id !== id);                                                       // Filtrar la tarea que queremos eliminar
      setTasks(updatedTasks); // Actualizamos el estado con las tareas restantes
    })
    .catch((error) => {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    });
};



  // Detectar la tecla Enter y agregar tarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita que el formulario se recargue si estuviera dentro de un form
      addTask();
    }
  };

  // useEffect para cargar las tareas cuando el componente se monte
  useEffect(() => {
    fetchTasks(); // Llamar la función para obtener las tareas cuando se cargue el componente
  }, []);

  // Renderizar todo en un solo return
  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="Enter a task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={addTask}>Add Task</button>

      {error && <p>{error}</p>} {/* Mostrar error si hay problemas al obtener o actualizar las tareas */}

      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              {task.label}
              <button onClick={() => deleteTask(task.id)}>X</button>
            </li>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </ul>

      <footer>
        <p>Total tasks: {tasks.length}</p>
      </footer>
    </div>
  );
};

export default TodolisAPI;



