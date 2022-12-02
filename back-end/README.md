# Run Locally
- In a terminal, navigate to `./back-end`
- Install all Python modules: `pip install requirements.txt`
- Insert your Air Now API Key into airnow.py `API_KEY = "KEY_HERE"`
- Insert your AQS API Key into airnow.py `EMAIL = "EMAIL_HERE" AQS_KEY = "KEY_HERE"`
- Run airnow.py `gunicorn --bind 127.0.0.1:8000 airnow:gunicorn_app`
- Run wildfire.py `gunicorn --bind 127.0.0.1:8001 WildFire:gunicorn_app`