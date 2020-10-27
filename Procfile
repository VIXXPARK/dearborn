release: python backend/manage.py migrate
worker : python backend/manage.py migrate background_task
worker : python backend/manage.py process_tasks
web: gunicorn --pythonpath backend backend.wsgi --log-file - --log-level debug