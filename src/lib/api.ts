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
        startDate: new Date(readings.map(reading => reading.date).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0]),
        endDate: new Date(readings.map(reading => reading.date).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0]),
        days: 0,
        data: []
    };

    // Increment start date by one day as meter readings are assumed to be end of day
    data.startDate.setDate(data.startDate.getDate() + 1);

    data.days = Math.floor((data.endDate.getTime() - data.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

    // Ensure there are valid dates in the data
    if(!data.startDate || !data.endDate || (data.endDate.getTime() < data.startDate.getTime())) {
        return {} as ChartData
    }

    // Discover types of observations in the data
    let types: string[] = [];
    for(const r of readings) {
        if(!types.includes(r.type)) types.push(r.type);
    }

    for(const type of types) {
        // Discover all consumers in the data
        let consumers: string[] = [];
        for(const r of readings) {
            if(!consumers.includes(r.consumer)) consumers.push(r.consumer);
        }

        // Calculate daily averages by consumer and type
        for(const consumer of consumers) {
            data.data.push({
                type: type,
                consumer: consumer,
                values: new Array(data.days).fill(0),
                observations: new Array(data.days).fill(0),
                readingsDates: readings.filter((r) => {
                                    return (r.consumer == consumer) && (r.type == type)
                                }).map((r) => new Date(r.date))
            });
    
            let sortedData = readings.filter((r) => {
                    return (r.consumer == consumer) && (r.type == type)
                }).sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));

            // Calculate daily consumption based on individual meter readings and insert it into the arrays at the right places
            for(let i = 1; i < sortedData.length; i++) {
                let period = Math.floor((new Date(sortedData[i].date).getTime() - new Date(sortedData[i - 1].date).getTime()) / (24 * 60 * 60 * 1000));
                let startIndex = Math.floor((new Date(sortedData[i - 1].date).getTime() - data.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

                for(let j = 0; j < period; j++) {
                    data.data[data.data.length - 1].values[startIndex + j] = (sortedData[i].value - sortedData[i - 1].value) / period;
                    data.data[data.data.length - 1].observations[startIndex + j]++;
                }
            }
        }
    }

    if(by == "population") {
        let tempData = [];

        for(const type of types) {
            tempData.push({
                type: type,
                consumer: "",
                values: new Array(data.days).fill(0),
                observations: new Array(data.days).fill(0),
                readingsDates: []
            });

            for(let i = 0; i < data.days; i++) {
                for(const consumer of data.data) {
                    if(consumer.observations[i] > 0 && consumer.type == type) {
                        tempData[tempData.length - 1].values[i] += consumer.values[i];
                        tempData[tempData.length - 1].observations[i]++;
                    }
                }
            }
        }
        
        data.data = tempData;
    }

    return data;
}