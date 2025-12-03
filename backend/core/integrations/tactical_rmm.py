import requests
import logging
from typing import Dict, List, Any
from django.conf import settings
from datetime import datetime

logger = logging.getLogger(__name__)


class TacticalRMMClient:
    """Client for Tactical RMM API integration"""

    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": api_key,
        }

    def get_all_agents(self) -> List[Dict[str, Any]]:
        """Fetch all agents from Tactical RMM"""
        try:
            url = f"{self.base_url}/agents/"
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch agents from Tactical RMM: {e}")
            return []

    def parse_agent_data(self, agent: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Tactical RMM agent data into TechVault format"""
        try:
            # Parse RAM (convert from KB to GB if needed)
            ram = agent.get('total_ram', 0)
            if ram > 10000:  # Likely in KB
                ram_gb = ram / (1024 * 1024)
            else:  # Likely in GB
                ram_gb = ram
            
            # Parse disk info
            disks = agent.get('disks', {})
            disk_0 = disks.get('0', {}) if isinstance(disks, dict) else {}
            
            disk_total = disk_0.get('size', 0)
            disk_free = disk_0.get('free', 0)
            
            # Convert bytes to GB
            disk_total_gb = disk_total / (1024**3) if disk_total > 0 else 0
            disk_free_gb = disk_free / (1024**3) if disk_free > 0 else 0
            
            # Parse last seen
            last_seen_str = agent.get('last_seen')
            last_seen = None
            if last_seen_str:
                try:
                    last_seen = datetime.fromisoformat(last_seen_str.replace('Z', '+00:00'))
                except:
                    pass
            
            return {
                'agent_id': agent.get('agent_id', ''),
                'name': agent.get('hostname', 'Unknown'),
                'operating_system': agent.get('operating_system', 'Unknown'),
                'cpu_model': agent.get('cpu_model', ''),
                'cpu_cores': agent.get('cpus', 0),
                'ram_gb': round(ram_gb, 2),
                'disk_total_gb': round(disk_total_gb, 2),
                'disk_free_gb': round(disk_free_gb, 2),
                'serial_number': agent.get('serial_number', ''),
                'logged_in_user': agent.get('logged_in_user', ''),
                'last_seen': last_seen,
                'status': agent.get('status', 'unknown'),
                'raw_rmm_data': agent,
            }
        except Exception as e:
            logger.error(f"Error parsing agent data: {e}")
            return {}

    def sync_all_agents(self) -> Dict[str, Any]:
        """Fetch and parse all agents"""
        agents = self.get_all_agents()
        parsed_agents = []

        for agent in agents:
            if isinstance(agent, dict):
                parsed = self.parse_agent_data(agent)
                if parsed:
                    parsed_agents.append(parsed)

        return {
            'success': True,
            'total_agents': len(parsed_agents),
            'agents': parsed_agents,
        }
    