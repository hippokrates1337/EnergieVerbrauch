<script lang="ts">
    export let obsUnits: ObservationUnit[];
    let obsType = "electricity";
</script>

<div class="d-flex flex-row align-items-center mb-4">
    <i class="fa fa-home fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <select class="form-select" name="obsunit" id="obsunit" aria-label="Auswahl des Verbrauchers" required>
            {#each obsUnits as unit}
                <option>{unit.name}</option>
            {/each}
        </select>
    </div>
    <i class="fa fa-bolt ms-3 fa-fw"></i><i class="fa fa-tint me-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <select bind:value={obsType} class="form-select" name="obstype" id="obstype" aria-label="Art des Verbrauchs" required>
            <option value="electricity">Strom</option>
            <option value="coldWater">Kaltwasser</option>
            <option value="warmWater">Warmwasser</option>
        </select>
    </div>
</div>
<div class="d-flex flex-row align-items-center mb-4">
    <i class="fa fa-play fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <input class="form-control" type="date" id="startdate" name="startdate" aria-label="Beginn des Verbrauchs" required/>
    </div>
    <i class="fa fa-stop fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <input class="form-control" type="date" id="enddate" name="enddate" aria-label="Ende des Verbrauchs" required/>
    </div> 
    <i class="fa fa-calculator fa-lg ms-3 fa-fw"></i>
    <div class="form-outline flex-fill mb-0">
        <input class="form-control" type="text" id="obsvalue" name="obsvalue" aria-label="Verbrauchswert" required />
    </div>
    {obsType == "electricity" ? "kWh" : "m3"}
    <button class="btn btn-lg btn-shadow-none" type="submit" aria-label="Änderungen speichern"><i class="fa fa-lg fa-floppy-o"></i></button>
</div>