import tornado.ioloop
import tornado.web
import os
from app.presentation.handlers import TaskListHandler, TaskDetailHandler

def make_app():
    return tornado.web.Application([
        (r"/tasks", TaskListHandler), # Ruta para GET y POST /tasks
        (r"/tasks/([0-9]+)", TaskDetailHandler), # Ruta para GET, PUT, DELETE /tasks/{id}
    ])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8888))
    app = make_app()
    app.listen(port)
    print(f"Servidor Tornado escuchando en http://localhost:{port}")
    tornado.ioloop.IOLoop.current().start()