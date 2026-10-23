// A site-made sound/image study. Sample provenance: audio/README.md.
(() => {
  const study = document.querySelector("[data-interaction-study]");
  if (!study) return;
  const stage = study.querySelector(".instrument-stage");
  const canvas = study.querySelector("canvas");
  const paint = canvas.getContext("2d");
  const toggle = study.querySelector("#sound-toggle");
  const volume = study.querySelector("#sound-volume");
  const feedback = study.querySelector("#study-feedback");
  const reading = study.querySelector("#gesture-reading");
  const noteReading = study.querySelector("#note-reading");
  const buttons = [...study.querySelectorAll("[data-note]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const names = ["D", "E", "F♯", "A", "B"];
  const frequencies = [146.8324, 164.8138, 184.9972, 220, 246.9417];
  const colours = ["#c4c8ff", "#abbfff", "#e5c3ff", "#f3d3a4", "#f7dcae"];
  let context, sample, master, bus, reverb, analyser;
  let enabled = false,
    loading = false,
    frame = 0,
    width = 0,
    height = 0;
  let rowCenters = [],
    stringStart = 0,
    stringEnd = 0;
  let pointer = null,
    lastVoice = null,
    quietTimer = 0,
    epoch = 0;
  let traces = [],
    voices = [];
  const samples = new Float32Array(256);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const setFeedback = (text) => {
    feedback.textContent = text;
  };

  // Canvas and pointer hit-testing use the live button rows, so their visual and interactive strings cannot drift apart.
  const stringY = (index) => rowCenters[index] ?? height * (0.262 + index * 0.124);
  function draw(now = performance.now()) {
    frame = 0;
    if (!paint) return;
    paint.clearRect(0, 0, width, height);
    traces = traces.filter((trace) => now - trace.time < 4500);
    let rms = 0;
    if (enabled && analyser) {
      analyser.getFloatTimeDomainData(samples);
      rms = Math.sqrt(
        samples.reduce((sum, value) => sum + value * value, 0) / samples.length,
      );
    }
    stage.style.setProperty(
      "--resonance",
      String(Math.min(0.44, 0.12 + rms * 1.8)),
    );
    for (let i = 0; i < 5; i++) {
      const y = stringY(i);
      const recent = traces.filter((trace) => trace.index === i);
      const active = recent[recent.length - 1];
      const age = active ? Math.max(0, (now - active.time) / 1000) : 10;
      const energy = active ? Math.exp(-age * 0.9) * active.strength : 0;
      const bend = active ? active.bend : 0;
      paint.strokeStyle = colours[i];
      paint.lineWidth = 1 + energy * 1.4;
      paint.globalAlpha = 0.3 + energy * 0.6;
      paint.beginPath();
      const leftEnd = stringStart || width * 0.13;
      const rightEnd = stringEnd || width * 0.87;
      for (let x = leftEnd; x <= rightEnd; x += 3) {
        const t = (x - leftEnd) / Math.max(1, rightEnd - leftEnd);
        const wave = reduced.matches
          ? 0
          : Math.sin(t * Math.PI * (6 + i) - age * 12) * energy * 8;
        const offset = Math.sin(t * Math.PI) * (bend * 17 + wave);
        if (x === leftEnd) paint.moveTo(x, y + offset);
        else paint.lineTo(x, y + offset);
      }
      paint.stroke();
    }
    if (!reduced.matches)
      for (const trace of traces) {
        const age = Math.max(0, (now - trace.time) / 1000);
        const fade = Math.exp(-age * 0.85) * trace.strength;
        const x = width * trace.x;
        const y = stringY(trace.index);
        paint.strokeStyle = colours[trace.index];
        for (let strand = 0; strand < 6; strand++) {
          paint.globalAlpha = fade * (0.34 - strand * 0.035);
          paint.lineWidth = strand === 0 ? 1.6 : 0.7;
          paint.beginPath();
          const spread = 12 + age * 58 + strand * 9;
          paint.ellipse(
            x,
            y + trace.bend * 12,
            6 + spread * 0.3,
            spread * (1 + Math.abs(trace.bend) * 0.15),
            0.35 + trace.bend * 0.2,
            0,
            Math.PI * 2,
          );
          paint.stroke();
        }
      }
    paint.globalAlpha = 1;
    if (traces.length && !reduced.matches) frame = requestAnimationFrame(draw);
    else if (!traces.length)
      reading.textContent = "A space waiting for your touch.";
  }
  function render() {
    if (!frame) frame = requestAnimationFrame(draw);
    clearTimeout(quietTimer);
    if (reduced.matches)
      quietTimer = setTimeout(() => {
        traces = [];
        draw();
      }, 1300);
  }
  function resize() {
    const box = stage.getBoundingClientRect();
    width = box.width;
    height = box.height;
    rowCenters = buttons.map((button) => {
      const row = button.getBoundingClientRect();
      return row.top + row.height / 2 - box.top;
    });
    const ends = [...stage.querySelectorAll(".guzheng-end")];
    if (ends.length === 2) {
      const left = ends[0].getBoundingClientRect();
      const right = ends[1].getBoundingClientRect();
      stringStart = left.right - box.left;
      stringEnd = right.left - box.left;
    }
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    if (paint) paint.setTransform(scale, 0, 0, scale, 0, 0);
    render();
  }
  async function prepareAudio() {
    if (!context) {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) throw new Error("unsupported");
      context = new AudioEngine();
      bus = context.createGain();
      master = context.createGain();
      master.gain.value = (Number(volume.value) / 100) * 0.6;
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -12;
      compressor.knee.value = 12;
      compressor.ratio.value = 8;
      analyser = context.createAnalyser();
      analyser.fftSize = 512;
      bus.connect(compressor);
      compressor.connect(master);
      master.connect(analyser);
      analyser.connect(context.destination);
      reverb = context.createConvolver();
      const impulse = context.createBuffer(
        2,
        context.sampleRate * 1.8,
        context.sampleRate,
      );
      let seed = 37;
      for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          seed = (seed * 16807) % 2147483647;
          data[i] =
            (seed / 1073741823.5 - 1) * Math.pow(1 - i / data.length, 3);
        }
      }
      reverb.buffer = impulse;
      const wet = context.createGain();
      wet.gain.value = 0.16;
      reverb.connect(wet);
      wet.connect(compressor);
    }
    await context.resume();
    if (!sample) {
      const response = await fetch("audio/guzheng-a3.mp3");
      if (!response.ok) throw new Error("sample");
      sample = await context.decodeAudioData(await response.arrayBuffer());
    }
    if (context.state !== "running") await context.resume();
  }
  function stopVoice(voice) {
    if (!voice.source) return;
    const now = context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0, now, 0.015);
    voice.source.stop(now + 0.08);
  }
  function quiet() {
    epoch++;
    voices.forEach(stopVoice);
    voices = [];
    traces = [];
    pointer = null;
    lastVoice = null;
    // Clear the convolution tail too; no old phrase should return after unmute.
    if (reverb) {
      const impulse = reverb.buffer;
      reverb.buffer = null;
      reverb.buffer = impulse;
    }
    cancelAnimationFrame(frame);
    frame = 0;
    clearTimeout(quietTimer);
    buttons.forEach((button) => button.removeAttribute("data-active"));
    reading.textContent = "A space waiting for your touch.";
    noteReading.textContent = "D pentatonic";
    draw();
  }
  function pluck(index, strength = 0.7, x = 0.52, delay = 0) {
    const trace = {
      index,
      strength,
      x: clamp(x, 0.12, 0.88),
      bend: 0,
      time: performance.now() + delay * 1000,
    };
    traces.push(trace);
    traces = traces.slice(-24);
    const voice = { trace, source: null };
    if (enabled && sample && context.state === "running") {
      while (voices.length >= 8) stopVoice(voices.shift());
      const source = context.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = frequencies[index] / 218.6;
      const gain = context.createGain();
      const pan = context.createStereoPanner();
      pan.pan.value = (index - 2) * 0.23;
      const start = context.currentTime + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(strength * 0.48, start + 0.004);
      source.connect(gain);
      gain.connect(pan);
      pan.connect(bus);
      pan.connect(reverb);
      Object.assign(voice, { source, gain, pan });
      voices.push(voice);
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        pan.disconnect();
        voices = voices.filter((item) => item !== voice);
      };
      source.start(start);
    }
    lastVoice = voice;
    buttons.forEach((button, i) =>
      button.toggleAttribute("data-active", i === index),
    );
    reading.textContent = "Pluck · a sound becomes a trace";
    noteReading.textContent = names[index];
    render();
    return voice;
  }
  function bend(amount) {
    if (!lastVoice) return;
    const value = clamp(amount, -2, 2);
    lastVoice.trace.bend = value;
    if (lastVoice.source)
      lastVoice.source.detune.setTargetAtTime(
        value * 100,
        context.currentTime,
        0.025,
      );
    reading.textContent =
      Math.abs(value) > 0.02
        ? "Bend · a note curves into light"
        : "Release · listen to the space between";
    noteReading.textContent = `${names[lastVoice.trace.index]}${Math.abs(value) > 0.02 ? ` ${value > 0 ? "+" : ""}${value.toFixed(1)}` : ""}`;
    render();
  }
  toggle.addEventListener("click", async () => {
    if (loading) return;
    if (enabled) {
      quiet();
      enabled = false;
      master.gain.setTargetAtTime(0, context.currentTime, 0.015);
      toggle.textContent = "Enable sound";
      toggle.setAttribute("aria-pressed", "false");
      setFeedback("Sound is off. You can still play with the image.");
      return;
    }
    loading = true;
    toggle.disabled = true;
    toggle.textContent = "Loading sound…";
    const requestEpoch = epoch;
    try {
      await prepareAudio();
      if (requestEpoch !== epoch || document.hidden) {
        toggle.textContent = "Enable sound";
        return;
      }
      enabled = true;
      master.gain.setTargetAtTime(
        (Number(volume.value) / 100) * 0.6,
        context.currentTime,
        0.015,
      );
      toggle.textContent = "Sound on · mute";
      toggle.setAttribute("aria-pressed", "true");
      setFeedback(
        "Sound is on. Touch a string, hold and move sideways, or sweep up and down.",
      );
    } catch {
      enabled = false;
      toggle.textContent = "Try sound again";
      setFeedback(
        "Sound could not start in this browser. The visual instrument still works; you can try sound again.",
      );
    } finally {
      loading = false;
      toggle.disabled = false;
    }
  });
  volume.addEventListener("input", () => {
    if (master && enabled)
      master.gain.setTargetAtTime(
        (Number(volume.value) / 100) * 0.6,
        context.currentTime,
        0.015,
      );
  });
  study.querySelector("#study-clear").addEventListener("click", () => {
    quiet();
    setFeedback("Quiet again. Touch a string to begin a new phrase.");
  });
  const position = (event) => {
    const box = stage.getBoundingClientRect();
    const x = clamp((event.clientX - box.left) / box.width, 0, 1);
    const y = clamp(event.clientY - box.top, 0, box.height);
    let index = 0;
    while (
      index < rowCenters.length - 1 &&
      y > (rowCenters[index] + rowCenters[index + 1]) / 2
    )
      index++;
    return {
      index,
      x,
    };
  };
  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || pointer) return;
    const point = position(event);
    stage.setPointerCapture(event.pointerId);
    buttons[point.index].focus({ preventScroll: true });
    pointer = { id: event.pointerId, index: point.index, x: point.x };
    pluck(point.index, 0.8, point.x);
  });
  stage.addEventListener("pointermove", (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const point = position(event);
    if (point.index !== pointer.index) {
      const direction = Math.sign(point.index - pointer.index);
      let step = 0;
      for (
        let i = pointer.index + direction;
        i !== point.index + direction;
        i += direction
      )
        pluck(i, 0.66, point.x, step++ * 0.025);
      pointer.index = point.index;
      pointer.x = point.x;
      reading.textContent = "Sweep · a phrase gathers light";
    } else bend((point.x - pointer.x) * 5);
  });
  const release = (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (stage.hasPointerCapture(event.pointerId))
      stage.releasePointerCapture(event.pointerId);
    pointer = null;
    bend(0);
    buttons.forEach((button) => button.removeAttribute("data-active"));
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("lostpointercapture", release);
  buttons.forEach((button, i) =>
    button.addEventListener("click", (event) => {
      if (event.detail === 0) pluck(i); // Native keyboard/assistive activation only; pointerdown already plucked.
    }),
  );
  stage.addEventListener("keydown", (event) => {
    if (/^[1-5]$/.test(event.key) && !event.repeat) {
      event.preventDefault();
      pluck(Number(event.key) - 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      bend(
        (lastVoice?.trace.bend || 0) + (event.key === "ArrowUp" || event.key === "ArrowRight" ? 0.25 : -0.25),
      );
    }
  });
  stage.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") bend(0);
  });
  study.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      quiet();
      setFeedback("Quiet again. Touch a string to begin a new phrase.");
    }
  });
  function leave() {
    quiet();
    enabled = false;
    if (master) master.gain.value = 0;
    if (context && context.state === "running")
      context.suspend().catch(() => {});
    toggle.textContent = "Enable sound";
    toggle.setAttribute("aria-pressed", "false");
    setFeedback("Sound is off. Enable it when you are ready.");
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) leave();
  });
  window.addEventListener("pagehide", leave);
  window.addEventListener("blur", () => {
    if (pointer) {
      pointer = null;
      bend(0);
    }
  });
  reduced.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    render();
  });
  study.querySelector(".listening-instrument").hidden = false;
  study.querySelector(".study-fallback").hidden = true;
  new ResizeObserver(resize).observe(stage);
  resize();
})();
