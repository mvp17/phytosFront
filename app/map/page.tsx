"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useInstallationStore } from "../installations/InstallationsStore";
import { useEffect } from "react";

const MapPage = () => {
    const installationId = useSearchParams().get('installationId');
    const currentInstallation = useInstallationStore((state) => state.currentInstallationForMap);
    const getInstallation = useInstallationStore((state) => state.getInstallation);
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/map');
        }
    });
    const Map = useMemo(() => dynamic(
        () => import('../../components/map/Map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false 
        }
    ), [])
    useEffect(() => {
        getInstallation(installationId!);
    }, []);
    return <Map installation = { currentInstallation }/>
}

export default MapPage;
