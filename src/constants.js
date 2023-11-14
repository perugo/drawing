export const DEFAULT = {
  MEDIUM: [
    { "DielectricConstant": 1, "DielectricLoss": 0, "MagneticConstant": 1, "MagneticLoss": 0 },
    { "DielectricConstant": 1, "DielectricLoss": 100000000, "MagneticConstant": 1, "MagneticLoss": 0 }
  ],
  SETTING: { fieldX: 0.048, fieldY: 0.036, split: 200, freq: 7.14e9 },
  BITMAP:[],
  FEEDPOINT: [{ x: 0, y: 0, color: 'rgb(255, 0, 0)', phase: 0 }],
  COLORTHRESHOLD:0.08,
  AMPLITUDESCALER: {
    "Select": "Rise", "simulationNum": 700,
    "Rise": { "slope": -0.08, "shift": 70 },
    "Pulse": { "peakPosition": 100, "widthFactor": 2.5 }
  },
  COLOR:{
    colorThreshold:0.08,
    colorTransitionIndex:0
  }
}

export const BREAD = {
  HOME: [{ title: "FDTDsimulation", link: "home" }],
  SETTING: {
    MEDIUM: [
      { title: "FDTDsimulation", link: "home" },
      { title: "Add medium", link: "settingMedium" }
    ],
    DOMAINGRID: [
      { title: "FDTDsimulation", link: "home" },
      { title: "Configure Analysis Area", link: "settingDomainGrid" }
    ],
    INPUTWAVE: [
      { title: "FDTDsimulation", link: "home" },
      { title: "Input Wave Custom Setting", link: "settingInputWave" }
    ]
  }
}