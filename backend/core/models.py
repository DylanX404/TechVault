from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


class BaseModel(models.Model):
    """Abstract base model with common fields for all entities."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='%(class)s_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Organization(BaseModel):
    """Organizations for grouping IT infrastructure."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state_province = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        db_table = 'organizations'

    def __str__(self):
        return self.name


class Location(BaseModel):
    """Physical locations within an organization."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='locations')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['organization', 'name']
        db_table = 'locations'
        unique_together = ('organization', 'name')

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class Contact(BaseModel):
    """Contacts for organizations and locations."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='contacts')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    title = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    mobile = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['organization', 'last_name', 'first_name']
        db_table = 'contacts'
        unique_together = ('organization', 'email')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Documentation(BaseModel):
    """Documentation for IT infrastructure, configurations, and procedures."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='documentations')
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ('procedure', 'Procedure'),
            ('configuration', 'Configuration'),
            ('guide', 'Guide'),
            ('troubleshooting', 'Troubleshooting'),
            ('policy', 'Policy'),
            ('other', 'Other'),
        ],
        default='other'
    )
    tags = models.CharField(max_length=500, blank=True, help_text='Comma-separated tags')
    is_published = models.BooleanField(default=False)
    version = models.IntegerField(default=1)

    class Meta:
        ordering = ['-created_at']
        db_table = 'documentations'

    def __str__(self):
        return self.title


class PasswordEntry(BaseModel):
    """Secure password vault entries."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='password_entries')
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, blank=True)
    password = models.TextField()  # Should be encrypted in production
    url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('account', 'Account'),
            ('service', 'Service'),
            ('device', 'Device'),
            ('other', 'Other'),
        ],
        default='other'
    )
    is_encrypted = models.BooleanField(default=False)

    class Meta:
        ordering = ['organization', 'name']
        db_table = 'password_entries'

    def __str__(self):
        return self.name


class Configuration(BaseModel):
    """System and service configurations."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='configurations')
    name = models.CharField(max_length=255)
    config_type = models.CharField(
        max_length=50,
        choices=[
            ('network', 'Network'),
            ('server', 'Server'),
            ('application', 'Application'),
            ('security', 'Security'),
            ('backup', 'Backup'),
            ('other', 'Other'),
        ],
        default='other'
    )
    content = models.TextField(help_text='Configuration details, code, or settings')
    description = models.TextField(blank=True)
    version = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['organization', 'config_type', 'name']
        db_table = 'configurations'
        unique_together = ('organization', 'name')

    def __str__(self):
        return self.name
