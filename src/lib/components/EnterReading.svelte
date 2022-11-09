<script lang="ts">
    export let consumers: Consumer[];
    export let defaultConsumer: string = "";
    export let defaultType: string = "electricity";
    export let defaultDate: string = "";
    export let defaultValue: number = 0;
</script>

<div class="d-flex flex-row align-items-center mb-4">
    <i class="fa fa-home fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <select value={defaultConsumer != "" ? defaultConsumer : (consumers.length > 0 ? consumers[0].uid : "")} class="form-select" name="consumer" id="consumer" aria-label="Auswahl des Verbrauchers" required>
            {#each consumers as consumer}
                <option value={consumer.uid}>{consumer.name}</option>
            {/each}
        </select>
    </div>
    <i class="fa fa-bolt ms-3 fa-fw"></i><i class="fa fa-tint me-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <select bind:value={defaultType} class="form-select" name="type" id="type" aria-label="Zähler" required>
            <option value="electricity">Strom</option>
            <option value="coldWater">Kaltwasser</option>
            <option value="warmWater">Warmwasser</option>
        </select>
    </div>
</div>
<div class="d-flex flex-row align-items-center mb-4">
    <i class="fa fa-calendar fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <input value={defaultDate} class="form-control" type="date" id="date" name="date" aria-label="Ablesedatum" required/>
    </div> 
    <i class="fa fa-calculator fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <input value={defaultValue? defaultValue : ""} class="form-control" type="text" id="value" name="value" aria-label="Zählerstand" required />
    </div>
    {defaultType == "electricity" ? "kWh" : "m3"}
    <button class="btn btn-lg btn-shadow-none" type="submit" aria-label="Änderungen speichern"><i class="fa fa-lg fa-floppy-o"></i></button>
</div>