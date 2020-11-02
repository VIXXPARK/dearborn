release: python backend/manage.py migrate
worker: python backend/manage.py process_tasks
web: gunicorn --pythonpath backend dearbornConfig.wsgi --log-file - --log-level debug