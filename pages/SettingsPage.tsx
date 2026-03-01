import React from 'react';
import { Card } from '../components/ui/Card';

export default function SettingsPage() {
  return (
    <Card className="p-6">
      <h1 className="mb-2 text-2xl font-semibold">Settings</h1>
      <p className="text-slate-400">Provider configuration and policy controls are scaffolded for backend integration.</p>
    </Card>
  );
}
