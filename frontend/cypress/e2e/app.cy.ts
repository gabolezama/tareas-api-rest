describe('Theme Toggle Functionality', () => {
    const FRONTEND_URL = 'http://localhost:3000';
  
    const lightThemeColors = {
      background: 'rgb(240, 242, 245)',
      text: 'rgb(0, 0, 0)',
      primary: 'rgb(0, 123, 255)',
    };
  
    const darkThemeColors = {
      background: 'rgb(26, 26, 46)',
      text: 'rgb(255, 255, 255)',
      primary: 'rgb(224, 224, 224)',
    };
  
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:8888/tasks', (req) => {
        req.reply({
          statusCode: 200,
          body: [],
          delay: 500,
        });
      }).as('getTasksSlowly');
  
      cy.visit(FRONTEND_URL);
    });
  
    it('should toggle between light and dark themes based on button clicks, verifying loading text color', () => { 
      cy.get('body').should('have.css', 'background-color', lightThemeColors.background);

      cy.contains('div', 'Cargando tareas...').should('have.css', 'color', lightThemeColors.text);
      cy.contains('button', 'Cambiar a Modo Oscuro 🌙').should('be.visible');
      cy.contains('button', 'Cambiar a Modo Oscuro 🌙').click();
  
      cy.get('body').should('have.css', 'background-color', darkThemeColors.background);

      cy.contains('div', 'Análisis de Tareas').should('have.css', 'color', darkThemeColors.text);
      cy.contains('button', 'Cambiar a Modo Claro ☀️').should('be.visible');
      cy.contains('button', 'Cambiar a Modo Claro ☀️').click();
  
      cy.get('body').should('have.css', 'background-color', lightThemeColors.background);
      cy.contains('div', 'Análisis de Tareas').should('have.css', 'color', lightThemeColors.text);
      cy.contains('button', 'Cambiar a Modo Oscuro 🌙').should('be.visible');

      cy.wait('@getTasksSlowly');
    });
  });