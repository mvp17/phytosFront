"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react"


const ReportPDF = dynamic(() => import("./pdf"), {
    ssr: false,
});


const ReportPage = () => {
    useEffect(() => {}, []);
    return(
        <ReportPDF/>
    )
}


export default ReportPage;
