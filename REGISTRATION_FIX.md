# Registration/User Creation Fix

## Problem
The registration endpoint (`POST /api/auth/registration/`) was returning a 500 error because the User model uses email-based authentication instead of username, but the default dj-rest-auth RegisterSerializer wasn't compatible.

## Solution Applied

### 1. Updated User Model (`users/models.py`)
Added a custom `CustomUserManager` that properly handles user creation with email:

```python
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, first_name='', last_name='', **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, first_name='', last_name='', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, first_name, last_name, **extra_fields)
```

### 2. Updated RegisterSerializer (`users/serializers.py`)
Rewrote the serializer to properly handle email-based registration:

```python
class RegisterSerializer(BaseRegisterSerializer):
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2', 'first_name', 'last_name')

    def save(self, request):
        cleaned_data = self.get_cleaned_data()
        user = User.objects.create_user(
            email=cleaned_data['email'],
            password=cleaned_data['password1'],
            first_name=cleaned_data['first_name'],
            last_name=cleaned_data['last_name'],
        )
        return user
```

### 3. Created Custom createsuperuser Command
Created `users/management/commands/createsuperuser.py` to allow creating superusers via CLI:

```bash
# Interactive
python manage.py createsuperuser

# Non-interactive (for automation)
python manage.py createsuperuser --email admin@example.com --first_name Admin --last_name User --password yourpassword
```

## Testing Registration

### Frontend Registration
1. Go to `http://localhost:5173/register`
2. Fill in:
   - Email: user@example.com
   - Password: SecurePassword123!
   - Confirm Password: SecurePassword123!
   - First Name: John
   - Last Name: Doe
3. Click Register
4. Should be logged in and redirected to dashboard

### API Registration
```bash
curl -X POST http://localhost:8000/api/auth/registration/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password1": "SecurePassword123!",
    "password2": "SecurePassword123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Creating Superuser
```bash
# Interactive (recommended)
cd backend
source venv/bin/activate
python manage.py createsuperuser

# Non-interactive
python manage.py createsuperuser \
  --email admin@example.com \
  --first_name Admin \
  --last_name User
```

## Expected Response

### Successful Registration (200 OK)
```json
{
  "key": "your_auth_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "is_active": true,
    "date_joined": "2025-11-26T12:00:00Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "email": ["This field may not be blank."],
  "password1": ["This field may not be blank."],
  "first_name": ["This field may not be blank."]
}
```

## Troubleshooting

### If registration still fails:

1. **Check database migrations are applied:**
   ```bash
   python manage.py migrate
   ```

2. **Check User model is being used:**
   ```bash
   python manage.py shell
   from django.contrib.auth import get_user_model
   User = get_user_model()
   print(User.USERNAME_FIELD)  # Should print: email
   ```

3. **Check dj-rest-auth is installed:**
   ```bash
   pip list | grep dj-rest-auth
   ```

4. **Check Django logs** for specific error messages in console output

### If createsuperuser command not found:

Make sure the management directory structure is correct:
```
users/
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── createsuperuser.py
```

## Database Reset (If Needed)

If you need to completely reset the database:

```bash
# Delete the SQLite database
rm db.sqlite3

# Recreate migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create new superuser
python manage.py createsuperuser --email admin@example.com --first_name Admin --last_name User
```

## Notes

- The custom UserManager is set as the default manager in the User model via `objects = CustomUserManager()`
- Password validation is enforced (at least 8 characters, not all numeric, etc.)
- Email uniqueness is enforced at the database level
- First name and last name are required for registration
- The `full_name` property combines first and last names, or falls back to email

This fix ensures compatibility between email-based authentication and the dj-rest-auth/django-allauth ecosystem.
