import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { networkDeviceAPI, endpointUserAPI, serverAPI, peripheralAPI } from '@/services/core';
import type { NetworkDevice, EndpointUser, Server, Peripheral } from '@/types/core';
import { Plus, Network, Monitor, HardDrive, Printer, Loader2 } from 'lucide-react';

export function Endpoints() {
  const { selectedOrg } = useOrganization();
  const [activeTab, setActiveTab] = useState<'network' | 'users' | 'servers' | 'peripherals'>('network');
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([]);
  const [endpointUsers, setEndpointUsers] = useState<EndpointUser[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEndpoints();
  }, [selectedOrg]);

  const loadEndpoints = async () => {
    if (!selectedOrg) return;

    try {
      setLoading(true);
      const [networkRes, usersRes, serversRes, peripheralsRes] = await Promise.all([
        networkDeviceAPI.byOrganization(selectedOrg.id),
        endpointUserAPI.byOrganization(selectedOrg.id),
        serverAPI.byOrganization(selectedOrg.id),
        peripheralAPI.byOrganization(selectedOrg.id),
      ]);

      setNetworkDevices(networkRes.data);
      setEndpointUsers(usersRes.data);
      setServers(serversRes.data);
      setPeripherals(peripheralsRes.data);
    } catch (error) {
      console.error('Failed to load endpoints:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'network' as const, label: 'Network', icon: Network, count: networkDevices.length },
    { id: 'users' as const, label: 'Users', icon: Monitor, count: endpointUsers.length },
    { id: 'servers' as const, label: 'Servers', icon: HardDrive, count: servers.length },
    { id: 'peripherals' as const, label: 'Peripherals', icon: Printer, count: peripherals.length },
  ];

  if (!selectedOrg) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please select an organization to view endpoints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Endpoints</h1>
          <p className="text-muted-foreground mt-1">
            Manage your network infrastructure and devices
          </p>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-accent">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {activeTab === 'network' && <NetworkDevicesList devices={networkDevices} />}
          {activeTab === 'users' && <EndpointUsersList users={endpointUsers} />}
          {activeTab === 'servers' && <ServersList servers={servers} />}
          {activeTab === 'peripherals' && <PeripheralsList peripherals={peripherals} />}
        </>
      )}
    </div>
  );
}

function NetworkDevicesList({ devices }: { devices: NetworkDevice[] }) {
  return (
    <div className="space-y-4">
      {devices.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No network devices found</p>
          <p className="text-sm text-muted-foreground">
            Add your first network device to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{device.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-accent">
                  {device.device_type}
                </span>
              </div>
              {device.manufacturer && (
                <p className="text-sm text-muted-foreground">
                  {device.manufacturer} {device.model}
                </p>
              )}
              {device.ip_address && (
                <p className="text-sm text-muted-foreground mt-1">IP: {device.ip_address}</p>
              )}
              {device.internet_provider && (
                <p className="text-sm text-muted-foreground mt-1">
                  Provider: {device.internet_provider} ({device.internet_speed})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EndpointUsersList({ users }: { users: EndpointUser[] }) {
  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No user endpoints found</p>
          <p className="text-sm text-muted-foreground">
            Add your first desktop or laptop to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{user.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-accent">
                  {user.device_type}
                </span>
              </div>
              {user.assigned_to_name && (
                <p className="text-sm text-muted-foreground">User: {user.assigned_to_name}</p>
              )}
              {user.cpu && (
                <p className="text-sm text-muted-foreground mt-1">
                  {user.cpu} • {user.ram}
                </p>
              )}
              {user.operating_system && (
                <p className="text-sm text-muted-foreground mt-1">{user.operating_system}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServersList({ servers }: { servers: Server[] }) {
  return (
    <div className="space-y-4">
      {servers.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No servers found</p>
          <p className="text-sm text-muted-foreground">
            Add your first server to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <div
              key={server.id}
              className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{server.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-accent">
                  {server.server_type}
                </span>
              </div>
              {server.role && (
                <p className="text-sm text-muted-foreground">Role: {server.role}</p>
              )}
              {server.cpu && (
                <p className="text-sm text-muted-foreground mt-1">
                  {server.cpu} • {server.ram}
                </p>
              )}
              {server.operating_system && (
                <p className="text-sm text-muted-foreground mt-1">{server.operating_system}</p>
              )}
              {server.ip_address && (
                <p className="text-sm text-muted-foreground mt-1">IP: {server.ip_address}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PeripheralsList({ peripherals }: { peripherals: Peripheral[] }) {
  return (
    <div className="space-y-4">
      {peripherals.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Printer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No peripherals found</p>
          <p className="text-sm text-muted-foreground">
            Add your first printer or peripheral to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {peripherals.map((peripheral) => (
            <div
              key={peripheral.id}
              className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{peripheral.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-accent">
                  {peripheral.device_type}
                </span>
              </div>
              {peripheral.manufacturer && (
                <p className="text-sm text-muted-foreground">
                  {peripheral.manufacturer} {peripheral.model}
                </p>
              )}
              {peripheral.ip_address && (
                <p className="text-sm text-muted-foreground mt-1">IP: {peripheral.ip_address}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
