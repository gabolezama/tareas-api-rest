describe('Task List Component', () => {
    const FRONTEND_URL = 'http://localhost:3000';
    const BACKEND_API_URL = 'http://localhost:8888';
  
    beforeEach(() => {
      // Intercepta las peticiones GET de tareas
      cy.intercept('GET', `${BACKEND_API_URL}/tasks`, {
        statusCode: 200,
        body: [
          {
            id: 1,
            title: 'Tarea Inicial Test 1',
            description: 'Esta es la primera tarea cargada por el test.',
            completed: false,
            priority: 2,
            created_at: '2025-07-20T10:00:00Z',
            updated_at: '2025-07-20T10:00:00Z',
          },
          {
            id: 2,
            title: 'Tarea Inicial Test 2',
            description: 'Esta es la segunda tarea cargada por el test.',
            completed: true,
            priority: 1,
            created_at: '2025-07-20T11:00:00Z',
            updated_at: '2025-07-20T11:00:00Z',
          },
        ],
      }).as('getTasks');
  
      // Visita la aplicación frontend
      cy.visit(FRONTEND_URL);
      // Espera a que las tareas se carguen antes de continuar con los tests
      cy.wait('@getTasks');
    });
  
    it('should display the main title and loaded tasks', () => {
      // Verifica que el título principal de la lista de tareas sea visible
      cy.contains('h1', 'Lista de Tareas').should('be.visible');
  
      // Verifica que el botón para añadir tareas esté presente
      cy.contains('button', 'Añadir Nueva Tarea').should('be.visible');
  
      // Verifica que las tareas cargadas inicialmente sean visibles
      cy.contains('Tarea Inicial Test 1').should('be.visible');
      cy.contains('Tarea Inicial Test 2').should('be.visible');
  
      // Verifica el estilo de la tarea completada
      cy.contains('Tarea Inicial Test 2').should('have.css', 'text-decoration', 'line-through solid rgb(0, 0, 0)');
    });
  
    it('should add a new task through the form and display it', () => {
      // Intercepta la petición POST antes de que se dispare
      cy.intercept('POST', `${BACKEND_API_URL}/tasks`, {
        statusCode: 201,
        body: {
          id: 99,
          title: 'Nueva Tarea de Prueba Cypress',
          description: 'Descripción de la tarea de prueba.',
          completed: false,
          priority: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }).as('createTask');

      cy.contains('button', 'Añadir Nueva Tarea').click();

      cy.get('input[id="title"]').type('Nueva Tarea de Prueba Cypress');
      cy.get('textarea[id="description"]').type('Descripción de la tarea de prueba.');

      cy.get('select[id="priority"]').select('2');

      cy.contains('button', 'Añadir Tarea').click();

      cy.wait('@createTask').its('response.statusCode').should('eq', 201);

      cy.contains('Nueva Tarea de Prueba Cypress').should('be.visible');
      cy.contains('Nueva Tarea de Prueba Cypress').should('not.have.css', 'text-decoration', 'line-through solid rgb(0, 0, 0)');
    });
  
    it('should toggle task completion status', () => {
      const taskIdToUpdate = 1;
      const taskTitleToUpdate = 'Tarea Inicial Test 1'; // Esta tarea está inicialmente NO completada

      cy.intercept('PUT', `${BACKEND_API_URL}/tasks/${taskIdToUpdate}`, (req) => {
        // Verifica que la petición PUT contenga completed: true
        expect(req.body.completed).to.be.true;
        req.reply({
          statusCode: 200,
          body: {
            id: taskIdToUpdate,
            title: taskTitleToUpdate,
            description: 'Esta es la primera tarea cargada por el test.',
            completed: true,
            priority: 2,
            created_at: '2025-07-20T10:00:00Z',
            updated_at: new Date().toISOString(),
          },
        });
      }).as('completeTask');
  
      cy.contains(taskTitleToUpdate)
        .parents('li')
        .find('button')
        .contains('Completar')
        .click();

      cy.wait('@completeTask').its('response.statusCode').should('eq', 200);

      cy.contains(taskTitleToUpdate).should('have.css', 'text-decoration-line', 'line-through');
      cy.contains(taskTitleToUpdate).should('have.css', 'opacity', '0.6');
  
      cy.intercept('PUT', `${BACKEND_API_URL}/tasks/${taskIdToUpdate}`, (req) => {
        // Verifica que la petición PUT contenga completed: false
        expect(req.body.completed).to.be.false;
        req.reply({
          statusCode: 200,
          body: {
            id: taskIdToUpdate,
            title: taskTitleToUpdate,
            description: 'Esta es la primera tarea cargada por el test.',
            completed: false,
            priority: 2,
            created_at: '2025-07-20T10:00:00Z',
            updated_at: new Date().toISOString(),
          },
        });
      }).as('uncompleteTask');
  
      // Clic de nuevo en el botón "Desmarcar"
      cy.contains(taskTitleToUpdate)
        .parents('li')
        .find('button')
        .contains('Desmarcar')
        .click();
  
      // Espera la petición PUT de "Desmarcar"
      cy.wait('@uncompleteTask').its('response.statusCode').should('eq', 200);
  
      // Verifica que la tarea ya NO esté "tachada" y con opacidad normal
      cy.contains(taskTitleToUpdate).should('not.have.css', 'text-decoration-line', 'line-through');
      cy.contains(taskTitleToUpdate).should('have.css', 'opacity', '1');
    });  
  
    it('should delete a task', () => {
      const taskIdToDelete = 1;
      const taskTitleToDelete = 'Tarea Inicial Test 1';
  
      // Intercepta la petición DELETE para la tarea con ID 1
      cy.intercept('DELETE', `${BACKEND_API_URL}/tasks/${taskIdToDelete}`, {
        statusCode: 204,
      }).as('deleteTask');
  
      // Encuentra la tarea y el botón "Eliminar"
      cy.contains(taskTitleToDelete)
        .parents('li')
        .find('button')
        .contains('Eliminar')
        .click();

      cy.wait('@deleteTask').its('response.statusCode').should('eq', 204);

      cy.contains(taskTitleToDelete).should('not.exist');
    });
  });