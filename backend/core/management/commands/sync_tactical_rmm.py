from django.core.management.base import BaseCommand
from decouple import config
from core.integrations.tactical_rmm import TacticalRMMClient
from core.models import RMMEndpoint, Organization
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Sync endpoints from Tactical RMM to a specific organization'

    def add_arguments(self, parser):
        parser.add_argument(
            'organization_id',
            type=str,
            help='UUID of the organization to sync to'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be synced without saving'
        )

    def handle(self, *args, **options):
        org_id = options['organization_id']
        dry_run = options.get('dry_run', False)

        try:
            org = Organization.objects.get(id=org_id)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Organization {org_id} not found'))
            return

        api_key = config('TACTICAL_RMM_API_KEY', default='')
        base_url = config('TACTICAL_RMM_BASE_URL', default='')

        if not api_key or not base_url:
            self.stdout.write(
                self.style.ERROR('TACTICAL_RMM_API_KEY and TACTICAL_RMM_BASE_URL must be set in .env')
            )
            return

        self.stdout.write(self.style.SUCCESS(f'Connecting to RMM at {base_url}...'))

        client = TacticalRMMClient(api_key, base_url)
        result = client.sync_all_agents()

        if not result.get('success'):
            self.stdout.write(self.style.ERROR('Failed to sync agents'))
            return

        agents = result.get('agents', [])
        self.stdout.write(
            self.style.SUCCESS(f'Found {len(agents)} agents to sync to {org.name}')
        )

        created = 0
        updated = 0

        for agent_data in agents:
            if dry_run:
                self.stdout.write(f"  [DRY RUN] Would sync: {agent_data['name']}")
                continue

            _, created_flag = RMMEndpoint.objects.update_or_create(
                agent_id=agent_data['agent_id'],
                defaults={
                    'organization': org,
                    'name': agent_data['name'],
                    'operating_system': agent_data['operating_system'],
                    'cpu_model': agent_data['cpu_model'],
                    'cpu_cores': agent_data['cpu_cores'],
                    'ram_gb': agent_data['ram_gb'],
                    'disk_total_gb': agent_data['disk_total_gb'],
                    'disk_free_gb': agent_data['disk_free_gb'],
                    'serial_number': agent_data['serial_number'],
                    'logged_in_user': agent_data['logged_in_user'],
                    'status': agent_data['status'],
                    'last_seen': agent_data['last_seen'],
                    'raw_rmm_data': agent_data['raw_rmm_data'],
                }
            )

            if created_flag:
                created += 1
                self.stdout.write(f"  ✓ Created: {agent_data['name']}")
            else:
                updated += 1
                self.stdout.write(f"  ✓ Updated: {agent_data['name']}")

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSync complete! Created: {created}, Updated: {updated}'
            )
        )