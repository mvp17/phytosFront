'use client'

import { Card, DonutChart } from "@tremor/react";

type dataChart = {
    name: string,
    value: number
}[];

interface IProps {
    data: dataChart
}

export const PieChart = ({data}: IProps) => {    
    //@ts-ignore
    let colors = [];

    const valueFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()}`;
    let totalOfColors = ["red",
                         "stone",
                         "orange",
                         "slate", 
                         "gray", 
                         "zinc", 
                         "amber",
                         "cyan",
                         "sky",
                         "blue",
                         "yellow", 
                         "lime", 
                         "green",
                         "emerald",
                         "teal",
                         "purple",
                         "fuchsia",
                         "pink",
                         "indigo",
                         "violet",
                         "rose"
                    ];
    let j = 0;
    for (let i = 0; i < data.length; i++){
        if (j === totalOfColors.length){
            j = 0;
            colors.push(totalOfColors[j]);
            j++;
        }
        else {
            colors.push(totalOfColors[j]);
            j++;
        }
    }
    return (
        <Card className="max-w-lg">
            <DonutChart
                className="mt-6"
                valueFormatter={valueFormatter}
                variant="pie"
                data={data}
                category="value"
                index="name"
                // @ts-ignore
                colors={colors}
            />
        </Card>
    );
}
