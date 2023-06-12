"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const MapPage = () => {
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
    return <Map installationId="" productName=""/>
}

export default MapPage;
