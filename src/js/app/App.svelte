<script lang="typescript">
  import * as csInterface from "cep-interface";
  import { derived } from "svelte/store";
  import { slide } from "svelte/transition";

  import { time, start, prefix } from "./store";
  import Say from "../components/Say.svelte";

  import Config from "../../config";
  import Log from "../utils/log";

  export let name;

  let animate = false;
  let foo: number;

  let aeData = {};
  $: aeDataText = JSON.stringify(aeData);
  $: console.log("AE Data", aeData);

  const move = () => (animate = !animate);
  $: elapsed = derived(time, ($time) =>
    Math.round((Number($time) - Number(start)) / 1000)
  );

  const formatter = new Intl.DateTimeFormat("en", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  function helloExtendscript() {
    const host = `$.global["${Config.id}"]`;
    // csInterface
    //   .evalExtendscript(`${host}.appName()`)
    //   .then((id) => alert(`The host app is "${id}"`));

    csInterface
      .evalExtendscript(`${host}.runCommand()`)
      .then((data: ESStatus) => {
        if (data.err) {
          throw data.err;
        }

        console.log("back from ae!");
        Log.log(data);
      })
      .catch((err: ZLError) => {
        console.error("oh no from ae!");
        Log.error(err);
      });
  }

  function helloNode() {
    const os = require("os");
    const user = os.userInfo().username;

    alert(`Hello from Node, ${user}`);
  }

  function helloSpectrum() {
    alert("Spectrum with icons \\o/");
  }
</script>

<style>
  h1 {
    color: white;
    margin-bottom: 20px;
  }

  main {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 50px;
  }

  input,
  p {
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
    height: 100px;
  }

  #slider {
    position: absolute;
    top: 0;
    width: 100%;
    height: 25px;
    margin: 0 -50px;
    background: darkslategray;
    text-align: center;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="./node_modules/@adobe/spectrum-css/dist/spectrum-core.css" />
  <link
    rel="stylesheet"
    href="./node_modules/@adobe/spectrum-css/dist/spectrum-darkest.css" />
  <link rel="stylesheet" href="./global.css" />
</svelte:head>
<main class="spectrum spectrum--darkest">
  <Say value="Oh" />
  <h1>Hello {$prefix} {name}!</h1>
  <input
    type="text"
    placeholder="Prefix"
    name="field"
    bind:value={$prefix}
    class="spectrum-Textfield spectrum-Textfield--quiet" />
  <input
    type="text"
    placeholder="Enter your name"
    name="field"
    bind:value={name}
    class="spectrum-Textfield spectrum-Textfield--quiet" />

  <h3>The time is {formatter.format($time)}</h3>

  <textarea
    class="spectrum-Textfield spectrum-Textfield--multiline"
    bind:value={aeDataText} />

  <p>
    The panel has been open for {$elapsed} {$elapsed === 1 ? 'second' : 'seconds'}
  </p>

  <button
    class="spectrum-ActionButton spectrum-ActionButton--quiet"
    on:click={helloSpectrum}>
    <svg
      class="spectrum-Icon spectrum-Icon--sizeS"
      focusable="false"
      aria-hidden="true"
      aria-label="Info">
      <use xlink:href="#spectrum-css-icon-InfoMedium" />
      <span class="spectrum-ActionButton-label">Info</span>
    </svg>
  </button>

  <button class="spectrum-ActionButton" on:click={helloExtendscript}>
    <span class="spectrum-ActionButton-label">Hello Extendscript</span>
  </button>

  <button class="spectrum-ActionButton" on:click={helloNode}>
    <span class="spectrum-ActionButton-label">Hello Node</span>
  </button>

  <button class="spectrum-ActionButton" on:click={move}>
    <span class="spectrum-ActionButton-label">Animate</span>
  </button>

  {#if animate}
    <div id="slider" transition:slide>¯\_(ツ)_/¯</div>
  {/if}
</main>
