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

export const generateDailyData = (readings: Reading[], by: string): ChartData => {
    let data: ChartData = {
        startDate: readings.map(reading => reading.date).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0],
        endDate: readings.map(reading => reading.date).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0],
        days: 0,
        data: []
    };

    data.days = Math.floor((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (24 * 60 * 60 * 1000));

    // Ensure there are valid dates in the data
    if(!data.startDate || !data.endDate || (data.endDate.getTime() < data.startDate.getTime())) {
        return {}
    }

    // Discover types of observations in the data
    let types: string[] = [];
    for(const r of readings) {
        if(!types.includes(r.type)) types.push(r.type);
    }

    console.log(types);
    console.log(data);

    for(const type of types) {
        if(by == "consumer") {
            // Discover all consumers in the data
            let consumers: string[] = [];
            for(const r of readings) {
                if(!consumers.includes(r.consumer)) consumers.push(r.consumer);
            }

            console.log(consumers);
    
            // Calculate daily averages by consumer and type
            for(const consumer of consumers) {
                data.data.push({
                    type: type,
                    consumer: consumer,
                    values: new Array(data.days).fill(0),
                    observations: []
                });
        
                let sortedData = readings.filter((r) => {
                        return (r.consumer == consumer) && (r.type == type)
                    }).sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));

                // There need to be at least 2 observations to calculate any consumption
                if(sortedData.length < 2) {
                    continue;
                }
        
                console.log(sortedData);
                /*
                for(let i = 1; i < sortedData.length; i++) {
                    
                }
                */
            }
        }
    }

    return data;
}