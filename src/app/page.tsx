'use server';

import Dashboard from '@/components/Dashboard';

export default async function Page() {
    const outputUrl = process.env.OUTPUT_URL || 'http://localhost:81/output';
    return <Dashboard outputUrl={outputUrl} />;
}
