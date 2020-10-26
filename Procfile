release: python backend/manage.py migrate
workder : python backend/manage.py process_tasks
web: gunicorn --pythonpath backend backend.wsgi --log-file - --log-level debug