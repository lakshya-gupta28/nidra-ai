export type Stage = "Awake" | "N1" | "N2" | "N3" | "REM";

export const STAGE_ORDER: Stage[] = ["Awake", "REM", "N1", "N2", "N3"];

export const STAGE_COLOR: Record<Stage, string> = {
  Awake: "var(--stage-awake)",
  N1: "var(--stage-n1)",
  N2: "var(--stage-n2)",
  N3: "var(--stage-n3)",
  REM: "var(--stage-rem)",
};

export const STAGE_LABEL: Record<Stage, string> = {
  Awake: "Awake",
  N1: "N1 – Transition",
  N2: "N2 – Light Sleep",
  N3: "N3 – Deep Sleep",
  REM: "REM Sleep",
};

/** Realistic simulated hypnogram: 30-min epochs from 22:45 to 06:15 */
function buildHypnogram() {
  const pattern: Stage[] = [
    "Awake",
    "N1",
    "N2",
    "N3",
    "N3",
    "N2",
    "REM",
    "N2",
    "N3",
    "N3",
    "N2",
    "REM",
    "N2",
    "Awake",
    "N2",
    "N3",
    "N2",
    "REM",
    "N2",
    "N1",
    "REM",
    "N2",
    "Awake",
    "N1",
    "REM",
    "N2",
    "N2",
    "REM",
    "N1",
    "Awake",
  ];
  const start = 22 * 60 + 45;
  return pattern.map((stage, i) => {
    const mins = (start + i * 15) % (24 * 60);
    const time = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
    return { index: i, time, stage, level: STAGE_ORDER.indexOf(stage) };
  });
}

export const hypnogram = buildHypnogram();

export const stageDistribution = [
  { stage: "Awake" as Stage, percent: 6, minutes: 27 },
  { stage: "N1" as Stage, percent: 9, minutes: 40 },
  { stage: "N2" as Stage, percent: 48, minutes: 213 },
  { stage: "N3" as Stage, percent: 21, minutes: 93 },
  { stage: "REM" as Stage, percent: 16, minutes: 71 },
];

export const weeklySleep = [
  { day: "Mon", hours: 6.8, quality: 74, bedtime: 23.6 },
  { day: "Tue", hours: 7.2, quality: 79, bedtime: 23.2 },
  { day: "Wed", hours: 6.1, quality: 66, bedtime: 24.1 },
  { day: "Thu", hours: 7.6, quality: 84, bedtime: 22.9 },
  { day: "Fri", hours: 7.9, quality: 88, bedtime: 22.8 },
  { day: "Sat", hours: 8.3, quality: 91, bedtime: 23.4 },
  { day: "Sun", hours: 7.4, quality: 87, bedtime: 22.75 },
];

export const stageConfidence = [
  { stage: "N2" as Stage, confidence: 94 },
  { stage: "N3" as Stage, confidence: 63 },
  { stage: "N1" as Stage, confidence: 41 },
  { stage: "REM" as Stage, confidence: 22 },
  { stage: "Awake" as Stage, confidence: 7 },
];

export const signalQuality = [
  { label: "SNR Score", value: "24.6 dB", status: "Excellent", detail: "Target > 18 dB" },
  { label: "Noise Level", value: "3.2 µV", status: "Good", detail: "Baseline drift low" },
  { label: "Artefact Status", value: "2 detected", status: "Moderate", detail: "Motion artefacts" },
  { label: "Signal Reliability", value: "96%", status: "Excellent", detail: "Epochs retained" },
];

export const pipelineSteps = [
  { title: "Raw Physiological Signals", detail: "EEG · EOG · EMG @ 256 Hz", icon: "waves" },
  { title: "Signal Quality Check", detail: "Channel integrity, SNR estimation", icon: "gauge" },
  { title: "Noise & Artefact Detection", detail: "Motion, blink & line-noise flags", icon: "alert" },
  { title: "Digital Filtering", detail: "0.3–35 Hz band-pass, 50 Hz notch", icon: "filter" },
  { title: "Segmentation", detail: "30-second epoch windowing", icon: "grid" },
  { title: "Normalization", detail: "Per-channel z-score scaling", icon: "scale" },
  { title: "Feature Extraction", detail: "Spectral band power, entropy, RMS", icon: "sparkles" },
  { title: "AI Classification", detail: "Sequence model → sleep stage", icon: "brain" },
];

export type Severity = "Low" | "Medium" | "High";

export const events: {
  time: string;
  type: string;
  signal: string;
  severity: Severity;
  description: string;
}[] = [
  {
    time: "23:12",
    type: "Signal Artefact",
    signal: "EEG · C4-A1",
    severity: "Low",
    description: "Brief electrode impedance spike, epoch auto-corrected.",
  },
  {
    time: "00:41",
    type: "Movement Event",
    signal: "EMG · Chin",
    severity: "Medium",
    description: "Sustained muscle burst lasting 22 seconds.",
  },
  {
    time: "01:58",
    type: "Sleep Interruption",
    signal: "Multimodal",
    severity: "High",
    description: "Transition N3 → Awake with elevated EOG activity.",
  },
  {
    time: "02:35",
    type: "Signal Quality Drop",
    signal: "EOG · Right",
    severity: "Medium",
    description: "SNR fell to 11.4 dB for 3 consecutive epochs.",
  },
  {
    time: "03:47",
    type: "Movement Event",
    signal: "EMG · Chin",
    severity: "Low",
    description: "Minor postural shift detected, staging unaffected.",
  },
  {
    time: "05:06",
    type: "Sleep Interruption",
    signal: "Multimodal",
    severity: "Medium",
    description: "Short awakening of 4 minutes before REM re-entry.",
  },
];

export const insights = [
  {
    title: "Deep sleep above weekly average",
    body: "Your deep sleep duration was higher than your weekly average by 18 minutes.",
    tone: "positive" as const,
  },
  {
    title: "Improved schedule consistency",
    body: "Your sleep schedule showed improved consistency across the last five nights.",
    tone: "positive" as const,
  },
  {
    title: "Interruptions detected",
    body: "Multiple interruptions were detected during the night, mainly between 01:00 and 03:00.",
    tone: "attention" as const,
  },
  {
    title: "REM proportion within typical range",
    body: "REM sleep accounted for 16% of total sleep time, within the typical observed range.",
    tone: "neutral" as const,
  },
];

export const summaryMetrics = [
  { label: "Total Sleep Duration", value: "7h 24m", sub: "Time in bed 8h 31m" },
  { label: "Sleep Efficiency", value: "87%", sub: "+4% vs. weekly average" },
  { label: "Deep Sleep Duration", value: "1h 33m", sub: "21% of total sleep" },
  { label: "REM Duration", value: "1h 11m", sub: "16% of total sleep" },
  { label: "Sleep Interruptions", value: "3", sub: "Longest 6m 12s" },
];

export const DISCLAIMER =
  "AI-assisted sleep monitoring and analysis. Not intended as a replacement for professional clinical diagnosis.";
