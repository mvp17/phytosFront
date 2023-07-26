"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { IInstallation } from "../installations/Installation";

const MapPage = () => {
    const installation: IInstallation = {
        _id: "",
        name: "",
        productName: "",
        seasonYear: 0,
        clientName: "",
        plantationName: "",
        plotName: "",
        installationDate: "",
        activationDate: "",
        province: "",
        municipality: "",
        features: "",
        projectionObservations: "",
        installationObservations: "",
        revisionObservations: "",
        retreatObservations: "",
        contacts: [],
        key: "",
        index: 0
    }
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
    return <Map installation = { installation }/>
}

export default MapPage;
