release: python backend/manage.py migrate

web: gunicorn --pythonpath backend backend.wsgi --log-file - --log-level debug