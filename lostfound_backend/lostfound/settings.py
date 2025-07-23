import os
from pathlib import Path
import dj_database_url
from datetime import timedelta
import logging

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Security Settings ---
# It's crucial to keep the secret key secure in production.
# We fetch it from an environment variable.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# DEBUG is set to 'False' in production for security.
# The check `os.getenv('DEBUG', 'False') == 'True'` correctly handles this.
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# --- Allowed Hosts Configuration ---
# This setting defines which domains can serve the Django site.
ALLOWED_HOSTS = []
if DEBUG:
    # For local development, allow localhost and 127.0.0.1
    ALLOWED_HOSTS.extend(['localhost', '127.0.0.1'])
else:
    # For production on Railway, get the allowed hosts from an environment variable.
    # You should set this to 'your-app-name.up.railway.app' or '*.up.railway.app'
    # in your Railway variables.
    prod_hosts = os.getenv('ALLOWED_HOSTS')
    if prod_hosts:
        ALLOWED_HOSTS.extend(prod_hosts.split(','))

# --- Application Definition ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',  # WhiteNoise for static files
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    'django_extensions',
    'corsheaders',  # For handling Cross-Origin Resource Sharing
    'api',
    'chatbot',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # WhiteNoise middleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # CORS middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'lostfound.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'lostfound.wsgi.application'


# --- Database Configuration (Corrected and Simplified) ---
# https://docs.djangoproject.com/en/stable/ref/settings/#databases
if DEBUG:
    # In local development (DEBUG=True), use a simple SQLite database.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    # In production (on Railway), configure the database using the DATABASE_URL env var.
    # dj_database_url.config() will automatically read the DATABASE_URL.
    DATABASES = {
        'default': dj_database_url.config(
            conn_max_age=600,
            conn_health_checks=True,
        )
    }


# --- Authentication ---
AUTH_USER_MODEL = 'api.CustomUser'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- Internationalization ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- Static and Media Files ---
# URL to use when referring to static files located in STATIC_ROOT.
STATIC_URL = '/static/'
# The absolute path to the directory where collectstatic will collect static files.
STATIC_ROOT = BASE_DIR / 'staticfiles'
# Use WhiteNoise to serve static files efficiently in production.
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# --- CORS (Cross-Origin Resource Sharing) Settings ---
# This controls which frontend domains can make requests to your backend.
if DEBUG:
    # For local development, allow requests from the typical Vite/React dev server port.
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]
else:
    # In production, get the allowed origin from the PROD_CORS_ORIGIN env variable.
    # This should be your frontend's public URL (e.g., https://your-frontend.up.railway.app)
    prod_origin = os.getenv('PROD_CORS_ORIGIN')
    if prod_origin:
        CORS_ALLOWED_ORIGINS = [prod_origin]

# Allows cookies to be sent with cross-origin requests.
CORS_ALLOW_CREDENTIALS = True

# --- Email Configuration ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# --- Site URL Configuration ---
# Used for creating absolute URLs, for example in notification emails.
# In production, this should be your backend's public URL.
SITE_URL = os.getenv('SITE_URL', 'http://127.0.0.1:8000')

# --- REST Framework and JWT Settings ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '500/hour',
        'user': '5000/hour',
    },
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'TOKEN_OBTAIN_SERIALIZER': 'api.serializers.CustomTokenObtainPairSerializer',
}

# --- Default primary key field type ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Logging Configuration ---
LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': LOGS_DIR / 'debug.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
        'api': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        # Add other app loggers as needed
    },
}
