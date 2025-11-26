from django.core.management.commands.createsuperuser import Command as BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    """
    Custom createsuperuser command that works with email-based User model.
    """

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            '--email',
            dest='email',
            help='Specifies the email for the superuser.',
        )
        parser.add_argument(
            '--first_name',
            dest='first_name',
            help='Specifies the first name for the superuser.',
        )
        parser.add_argument(
            '--last_name',
            dest='last_name',
            help='Specifies the last name for the superuser.',
        )
        parser.add_argument(
            '--password',
            dest='password',
            help='Specifies the password for the superuser.',
        )

    def handle(self, *args, **options):
        email = options.get('email')
        password = options.get('password')
        first_name = options.get('first_name', 'Admin')
        last_name = options.get('last_name', 'User')

        if not email:
            email = self.get_input_data(
                'Email',
                input_msg='Email: ',
                default=None,
                validate=lambda x: x and '@' in x,
            )

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.ERROR(f'Error: User with email "{email}" already exists.')
            )
            return

        if not password:
            password = self.get_input_data(
                'Password',
                input_msg='Password: ',
                default=None,
                validate=lambda x: len(x) >= 8 if x else False,
                input_type=self.PASSWORD_INPUT,
            )

        if not first_name:
            first_name = self.get_input_data(
                'First name',
                input_msg='First name [Admin]: ',
                default='Admin',
            )

        if not last_name:
            last_name = self.get_input_data(
                'Last name',
                input_msg='Last name [User]: ',
                default='User',
            )

        User.objects.create_superuser(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Superuser created successfully. Email: {email}'
            )
        )
