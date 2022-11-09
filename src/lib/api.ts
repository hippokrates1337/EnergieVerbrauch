type Send = Promise<{
    error?: string,
    success?: string,
    user?: {
        userName: string,
        uid: string
    },
    data?: any
}>

export const send = async (form: HTMLFormElement, method?: string): Send => {
    const response = await fetch(form.action, {
        method: method ? method : form.method,
        body: new FormData(form),
        headers: {
            accept: "application/json"
        }
    });

    return await response.json();
}

export const generateDailyData: ChartData = (readings: Reading[], consumers: Consumer[]) => {
    // There must be at least 2 meter readings in order to calculate consumption
    if(readings.length < 2) {
        return {}
    }

    let data: ChartData = {
        startDate: readings.map(reading => reading.date).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0],
        endDate: readings.map(reading => reading.date).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0],
        data: []
    };

    let days = Math.floor((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (24 * 60 * 60 * 1000));

    for(const consumer of consumers) {
        data.data.push({
            consumer: consumer.name,
            values: new Array(days).fill(0)
        });

        let sortedData = readings.filter(r => r.consumer == consumer.uid).sort((a, b) => (new Date(a) as any) - (new Date(b) as any));
        if(sortedData.length < 2) {
            continue;
        }

        for(let i = 1; i < sortedData.length; i++) {

        }
    }
}