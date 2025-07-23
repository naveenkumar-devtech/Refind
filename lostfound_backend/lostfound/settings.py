import os
from pathlib import Path
import dj_database_url
from datetime import timedelta
import logging

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Security Settings ---
# It's crucial to keep the secret key secure in production.
# We fetch it from an environment variable. For the build process, where env vars
# are not available, we provide a dummy key to allow the build to succeed.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dummy-insecure-secret-key-for-build-only')

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

# --- Database Configuration ---
# Check if we're in a build environment (Railway sets RAILWAY_ENVIRONMENT)
is_railway_build = os.getenv('RAILWAY_ENVIRONMENT') and not os.getenv('DATABASE_URL')
database_url = os.getenv('DATABASE_URL')

if DEBUG:
    # For local development, use SQLite.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
elif is_railway_build:
    # During Railway build phase, use SQLite in memory for collectstatic
    # This prevents database connection errors during build
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
elif database_url:
    # Production runtime with DATABASE_URL available
    DATABASES = {
        'default': dj_database_url.config(
            default=database_url,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Final fallback for production
    DATABASES = {
        'default': dj_database_url.parse(
            os.environ.get('DATABASE_URL', 'sqlite:///:memory:'),
            conn_max_age=600,
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
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# --- CORS (Cross-Origin Resource Sharing) Settings ---
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]
else:
    prod_origin = os.getenv('PROD_CORS_ORIGIN')
    CORS_ALLOWED_ORIGINS = [prod_origin] if prod_origin else []

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
    },
}
