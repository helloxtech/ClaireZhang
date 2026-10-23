// A site-made sound/image study. Sample provenance: audio/README.md.
(() => {
  const study = document.querySelector("[data-interaction-study]");
  if (!study) return;
  const stage = study.querySelector(".instrument-stage");
  const canvas = stage.querySelector("canvas");
  const paint = canvas.getContext("2d");
  const toggle = study.querySelector("#sound-toggle");
  const volume = study.querySelector("#sound-volume");
  const feedback = study.querySelector("#study-feedback");
  const reading = study.querySelector("#gesture-reading");
  const noteReading = study.querySelector("#note-reading");
  const buttons = [...study.querySelectorAll("[data-note]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const noteNames = ["D", "E", "F♯", "A", "B"];
  const octaveColours = ["#8fa5ff", "#b8a2ff", "#dfb2ff", "#f0c49b", "#ffe0ae"];
  const frequencies = Array.from({ length: 21 }, (_, index) => {
    const octave = 2 + Math.floor(index / 5);
    const degree = index === 20 ? 0 : index % 5;
    const semitones =
      { D: -7, E: -5, "F♯": -3, A: 0, B: 2 }[noteNames[degree]] +
      (octave - 4) * 12;
    return 440 * Math.pow(2, semitones / 12);
  });
  const note = (index) => {
    const octave = index === 20 ? 6 : 2 + Math.floor(index / 5);
    return `${noteNames[index === 20 ? 0 : index % 5]}${octave}`;
  };
  const stringNumber = (index) => 21 - index;
  let context, sample, master, bus, reverb, analyser;
  let enabled = false,
    loading = false,
    frame = 0,
    width = 0,
    height = 0;
  let geometry = { top: 0, bottom: 0, left: 0, right: 0 };
  let pointer = null,
    lastVoice = null,
    quietTimer = 0,
    epoch = 0;
  let traces = [],
    voices = [];
  const samples = new Float32Array(256);
  const maxVoices = 32;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const setFeedback = (text) => {
    feedback.textContent = text;
  };
  const stringY = (index) =>
    geometry.top + ((geometry.bottom - geometry.top) * index) / 20;
  const colour = (index) => octaveColours[Math.min(4, Math.floor(index / 5))];
  const label = (index) => `String ${stringNumber(index)} · ${note(index)}`;

  function drawBridge(index, x, y) {
    const angle = (-0.13 + index * 0.013) * Math.PI;
    const scale = clamp(width / 700, 0.48, 1);
    paint.save();
    paint.translate(x, y);
    paint.scale(scale, scale);
    paint.rotate(angle);
    paint.shadowColor = "#130b10b8";
    paint.shadowBlur = 5;
    paint.shadowOffsetY = 4;
    paint.fillStyle = "#3a1d18";
    for (const side of [-1, 1]) {
      paint.beginPath();
      paint.moveTo(side * 8, 12);
      paint.lineTo(side * 2, 2);
      paint.lineTo(0, 2);
      paint.lineTo(side, 12);
      paint.closePath();
      paint.fill();
    }
    paint.shadowColor = "transparent";
    paint.fillStyle = "#6a3925";
    paint.beginPath();
    paint.moveTo(-4, -1);
    paint.lineTo(4, -1);
    paint.lineTo(2, 3);
    paint.lineTo(-2, 3);
    paint.closePath();
    paint.fill();
    paint.fillStyle = "#f2dfbd";
    paint.fillRect(-3.2, -0.9, 6.4, 1.8);
    paint.restore();
  }
  function drawStringPin(x, y) {
    paint.save();
    paint.globalAlpha = 0.82;
    paint.shadowColor = "#130b10a8";
    paint.shadowBlur = 2;
    paint.shadowOffsetY = 1.5;
    paint.fillStyle = "#3b201c";
    paint.beginPath();
    paint.arc(x, y, 1.85, 0, Math.PI * 2);
    paint.fill();
    paint.shadowColor = "transparent";
    paint.fillStyle = "#f0c98b";
    paint.beginPath();
    paint.arc(x - 0.35, y - 0.35, 0.58, 0, Math.PI * 2);
    paint.fill();
    paint.restore();
  }
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
    for (let i = 0; i < 21; i++) {
      const y = stringY(i);
      const recent = traces.filter(
        (trace) => trace.index === i && trace.time <= now,
      );
      const active = recent.at(-1);
      const age = active ? Math.max(0, (now - active.time) / 1000) : 10;
      const energy = active ? Math.exp(-age * 0.88) * active.strength : 0;
      const bend = active ? active.bend : 0;
      paint.strokeStyle = energy ? colour(i) : "#e9c98b";
      paint.lineWidth = 0.45 + Math.min(1.8, energy * 1.5);
      paint.globalAlpha = energy ? 0.35 + energy * 0.65 : 0.31;
      paint.beginPath();
      for (let x = geometry.left; x <= geometry.right; x += 3) {
        const t =
          (x - geometry.left) / Math.max(1, geometry.right - geometry.left);
        const wave = reduced.matches
          ? 0
          : Math.sin(t * Math.PI * (5 + i * 0.42) - age * (7 + i * 0.16)) *
            energy *
            (4 + Math.min(7, i * 0.28));
        const offset = Math.sin(t * Math.PI) * (bend * 15 + wave);
        if (x === geometry.left) paint.moveTo(x, y + offset);
        else paint.lineTo(x, y + offset);
      }
      paint.stroke();
    }
    for (const trace of traces) {
      if (now < trace.time || reduced.matches) continue;
      const age = Math.max(0, (now - trace.time) / 1000);
      const fade = Math.exp(-age * 0.85) * trace.strength;
      for (let strand = 0; strand < 5; strand++) {
        paint.globalAlpha = fade * (0.32 - strand * 0.04);
        paint.lineWidth = strand === 0 ? 1.5 : 0.65;
        paint.strokeStyle = colour(trace.index);
        paint.beginPath();
        const spread = 11 + age * 56 + strand * 9;
        paint.ellipse(
          width * trace.x,
          stringY(trace.index) + trace.bend * 12,
          6 + spread * 0.3,
          spread * (1 + Math.abs(trace.bend) * 0.14),
          0.35 + trace.bend * 0.2,
          0,
          Math.PI * 2,
        );
        paint.stroke();
      }
    }
    paint.globalAlpha = 1;
    for (let i = 0; i < 21; i++) {
      const y = stringY(i);
      drawStringPin(geometry.left, y);
      drawStringPin(geometry.right, y);
      drawBridge(i, width * (0.425 + i * 0.0105), y);
    }
    if (traces.length && !reduced.matches) frame = requestAnimationFrame(draw);
    else if (!traces.length)
      reading.textContent = "A space waiting for your touch.";
  }
  function render() {
    if (!frame) frame = requestAnimationFrame(draw);
    clearTimeout(quietTimer);
  }
  function resize() {
    const box = stage.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const ends = [...stage.querySelectorAll(".guzheng-end")];
    const left = ends[0]?.getBoundingClientRect();
    const right = ends[1]?.getBoundingClientRect();
    geometry = {
      top: height * 0.2,
      bottom: height * 0.82,
      left: left ? left.right - box.left : width * 0.13,
      right: right ? right.left - box.left : width * 0.87,
    };
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
    noteReading.textContent = "String 21 · D2";
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
    traces = traces.slice(-48);
    const voice = { trace, source: null };
    if (enabled && sample && context.state === "running") {
      while (voices.length >= maxVoices) stopVoice(voices.shift());
      const source = context.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = frequencies[index] / 218.6;
      const gain = context.createGain();
      const pan = context.createStereoPanner();
      pan.pan.value = (index - 10) / 12;
      const start = context.currentTime + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(strength * 0.43, start + 0.004);
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
    noteReading.textContent = label(index);
    render();
    if (delay && reduced.matches) setTimeout(render, delay * 1000);
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
    noteReading.textContent = `${label(lastVoice.trace.index)}${Math.abs(value) > 0.02 ? ` ${value > 0 ? "+" : ""}${value.toFixed(1)}` : ""}`;
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
        "Sound is on. Touch any string, hold and move sideways, or sweep up and down.",
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
  function position(event) {
    const box = stage.getBoundingClientRect();
    const x = clamp((event.clientX - box.left) / box.width, 0, 1);
    const y = clamp(event.clientY - box.top, geometry.top, geometry.bottom);
    const index = clamp(
      Math.round(
        ((y - geometry.top) / Math.max(1, geometry.bottom - geometry.top)) * 20,
      ),
      0,
      20,
    );
    return { index, x };
  }
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
  buttons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      if (event.detail === 0 || !stage.contains(button)) pluck(index);
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        buttons[
          clamp(index + (event.key === "ArrowUp" ? -1 : 1), 0, 20)
        ].focus();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        bend(
          (lastVoice?.trace.bend || 0) +
            (event.key === "ArrowRight" ? 0.25 : -0.25),
        );
      }
    });
    button.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") bend(0);
    });
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
