# TechVault Setup Guide

Complete guide for setting up and running the TechVault IT Documentation Platform.

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Git
- SQLite (included with Python) for development
- PostgreSQL 12+ (optional, for production)

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser --email admin@example.com --first_name Admin --last_name User --password yourpassword
```

Or interactively:
```bash
python manage.py createsuperuser
```

### 5. Create Sample Data (Optional)

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
from core.models import Organization, Location, Contact, Documentation, PasswordEntry, Configuration

User = get_user_model()
user = User.objects.first()  # Get the superuser you just created

# Create a sample organization
org = Organization.objects.create(
    name="Tech Corp Inc",
    description="Sample technology company",
    email="contact@techcorp.com",
    created_by=user
)

# Create a sample location
Location.objects.create(
    organization=org,
    name="Main Office",
    address="123 Tech Street",
    city="San Francisco",
    postal_code="94105",
    country="USA",
    created_by=user
)

# Create a sample contact
Contact.objects.create(
    organization=org,
    first_name="John",
    last_name="Doe",
    email="john@techcorp.com",
    title="IT Manager",
    created_by=user
)

print("Sample data created!")
exit()
```

### 6. Run Backend Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

Create `.env.local` in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Accessing the Application

1. **Frontend**: Open `http://localhost:5173` in your browser
2. **Login**: Use the email and password you created for the superuser
3. **Admin Panel**: Visit `http://localhost:8000/admin` to manage data directly

## API Endpoints

All endpoints require authentication via JWT token. Base URL: `http://localhost:8000/api`

### Authentication
- `POST /auth/registration/` - Register new user
- `POST /auth/login/` - Login (returns access & refresh tokens)
- `POST /auth/logout/` - Logout
- `POST /token/refresh/` - Refresh access token
- `POST /token/verify/` - Verify token validity

### User
- `GET /user/profile/` - Get current user profile
- `PATCH /user/profile/` - Update user profile

### Organizations
- `GET /organizations/` - List all organizations
- `POST /organizations/` - Create new organization
- `GET /organizations/{id}/` - Get organization details
- `PATCH /organizations/{id}/` - Update organization
- `DELETE /organizations/{id}/` - Delete organization
- `GET /organizations/{id}/stats/` - Get organization statistics
- `GET /organizations/search/?q=query` - Search organizations

### Locations
- `GET /locations/` - List all locations
- `POST /locations/` - Create new location
- `GET /locations/{id}/` - Get location details
- `PATCH /locations/{id}/` - Update location
- `DELETE /locations/{id}/` - Delete location
- `GET /locations/by_organization/?organization_id={org_id}` - Get locations by organization

### Contacts
- `GET /contacts/` - List all contacts
- `POST /contacts/` - Create new contact
- `GET /contacts/{id}/` - Get contact details
- `PATCH /contacts/{id}/` - Update contact
- `DELETE /contacts/{id}/` - Delete contact
- `GET /contacts/by_organization/?organization_id={org_id}` - Get contacts by organization
- `GET /contacts/by_location/?location_id={location_id}` - Get contacts by location

### Documentation
- `GET /documentations/` - List all documentation
- `POST /documentations/` - Create new documentation
- `GET /documentations/{id}/` - Get documentation details
- `PATCH /documentations/{id}/` - Update documentation
- `DELETE /documentations/{id}/` - Delete documentation
- `POST /documentations/{id}/publish/` - Publish documentation
- `POST /documentations/{id}/unpublish/` - Unpublish documentation
- `GET /documentations/by_organization/?organization_id={org_id}` - Get docs by organization

### Passwords
- `GET /passwords/` - List all password entries
- `POST /passwords/` - Create new password entry
- `GET /passwords/{id}/` - Get password details
- `PATCH /passwords/{id}/` - Update password entry
- `DELETE /passwords/{id}/` - Delete password entry
- `GET /passwords/by_organization/?organization_id={org_id}` - Get passwords by organization

### Configurations
- `GET /configurations/` - List all configurations
- `POST /configurations/` - Create new configuration
- `GET /configurations/{id}/` - Get configuration details
- `PATCH /configurations/{id}/` - Update configuration
- `DELETE /configurations/{id}/` - Delete configuration
- `GET /configurations/by_organization/?organization_id={org_id}` - Get configurations by organization

## Query Parameters

### Filtering
```
GET /organizations/?is_active=true&country=USA
GET /documentations/?category=procedure&is_published=true
GET /passwords/?category=account
```

### Search
```
GET /organizations/?search=tech
GET /documentations/?search=backup
GET /contacts/?search=john
```

### Ordering
```
GET /organizations/?ordering=name
GET /documentations/?ordering=-created_at
GET /locations/?ordering=city,name
```

### Pagination
```
GET /organizations/?page=1&page_size=20
```

## Database Configuration

### Development (SQLite - Default)

The app automatically uses SQLite for local development:

```
db.sqlite3 is created automatically in the backend directory
```

### Production (PostgreSQL)

Set environment variables or create `.env` file:

```env
ENVIRONMENT=production
DEBUG=False
DB_NAME=techvault
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_SSLMODE=require
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## Troubleshooting

### Registration Not Working
- Ensure `DEBUG=True` or `ENVIRONMENT=development` in settings
- Check that `dj-rest-auth` and `django-allauth` are installed
- Review error message in Django console

### Migrations Failing
- Delete `db.sqlite3` and try again:
  ```bash
  rm db.sqlite3
  python manage.py migrate
  ```

### Frontend Cannot Connect to Backend
- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_URL` environment variable
- Check CORS settings in `backend/settings.py`

### Port Already in Use
- Backend: `python manage.py runserver 8001`
- Frontend: `npm run dev -- --port 5174`

## Production Deployment

See `backend/README.md` and `frontend/README.md` for deployment instructions.

## Features Implemented

### Core Features
✅ User authentication (email-based)
✅ Organizations management
✅ Locations management
✅ Contacts management
✅ Documentation management with versioning
✅ Password vault
✅ Configuration management
✅ Search and filtering
✅ JWT token authentication
✅ Admin panel

### Planned Features
⏳ File attachments for documents
⏳ Team/group access control
⏳ Encryption for sensitive data
⏳ Audit logging
⏳ Two-factor authentication
⏳ API rate limiting
⏳ Activity feed

## Support

For issues or questions, please refer to the main README.md or contact the development team.
