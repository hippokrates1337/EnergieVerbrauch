<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        // Load all observations (to be passed into props)
        const res = await fetch("/protected/observations");
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                observations: obs.data
            }
        };
    }

</script>

<script lang="ts">
    export let observations: SummaryObservation[];
    let summaryData: Map<string, Map<string, object>>;

    const summarizeData = (observations: SummaryObservation[]) => {
        let data = new Map();

        for(const obs of observations) {
            let start = new Date(obs.startDate);
            let end = new Date(obs.endDate);
            let avgConsumption = obs.value / ((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
            
            while(start <= end) {
                if(data.has(start.toString())) {
                    if(data.get(start.toString()).has(obs.type)) {
                        data.get(start.toString()).get(obs.type)["obsCount"]++;
                        data.get(start.toString()).get(obs.type)["totalValue"] += avgConsumption;
                    } else {
                        data.get(start.toString()).set(obs.type, {
                            obsCount: 1,
                            totalValue: avgConsumption
                        });
                    }
                } else {
                    data.set(start.toString(), new Map());
                    data.get(start.toString()).set(obs.type, {
                        obsCount: 1,
                        totalValue: avgConsumption
                    });
                }

                start.setDate(start.getDate() + 1);
            }
        }

        return data;
    }

    $: summaryData = summarizeData(observations);
</script>

<div class="container">
    <ul class="list-group">
        {#each observations as obs}
            <li class="list-item">
                {JSON.stringify(obs)}
            </li>
        {/each}
    </ul>
</div>
