'use server';

import Dashboard from '@/components/Dashboard';

export default async function Page() {
    const outputUrl = process.env.OUTPUT_URL;
    const prefix = process.env.LOCATION_REGEX;
    return <Dashboard outputUrl={outputUrl} prefix={prefix} />;
}
