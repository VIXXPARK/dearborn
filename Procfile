migrations: python backend/manage.py makemigrations usermanagement post messanger contest comment bid assess

release: python backend/manage.py migrate

web: gunicorn --pythonpath backend backend.wsgi --log-file - --log-level debug