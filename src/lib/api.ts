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

export const generateDailyData: ChartData = (readings: Reading[], by: string) => {
    let data: ChartData = {
        startDate: readings.map(reading => reading.date).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0],
        endDate: readings.map(reading => reading.date).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0],
        data: []
    };

    // Ensure there are valid dates in the data
    if(!data.startDate || !data.endDate || (data.endDate.getTime() < data.startDate.getTime())) {
        return {}
    }

    let days = Math.floor((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (24 * 60 * 60 * 1000));

    // Discover types of observations in the data
    let types: string[] = [];
    for(const r of readings) {
        if(!types.includes(r.type)) types.push(r.type);
    }

    if(by == "consumer") {
        // Discover all consumers in the data
        let consumers: string[] = [];
        for(const r of readings) {
            if(!consumers.includes(r.consumer)) consumers.push(r.consumer);
        }

        // Calculate daily averages by consumer and type
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
}