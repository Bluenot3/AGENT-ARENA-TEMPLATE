import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const legacyRoutes = [
  ['Bot Builder', '/labs/legacy/create'],
  ['Knowledge Vault', '/labs/legacy/knowledge'],
  ['Image Studio', '/labs/legacy/studio/image'],
  ['Image Agents', '/labs/legacy/studio/image-agents'],
  ['App Forge', '/labs/legacy/studio/app'],
  ['Game Lab', '/labs/legacy/studio/game'],
  ['Arena Designer', '/labs/legacy/arena/new'],
  ['Analytics', '/labs/legacy/analytics'],
  ['Keys Vault', '/labs/legacy/keys'],
  ['Subscription', '/labs/legacy/subscription']
];

export default function LabsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Labs Toolkit</h1>
      <Card className="p-4">
        <div className="grid gap-2 md:grid-cols-2">
          {legacyRoutes.map(([label, path]) => (
            <Link key={path} to={path} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">{label}</Link>
          ))}
        </div>
      </Card>
      <Outlet />
    </div>
  );
}
