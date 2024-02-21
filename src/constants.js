export const DEFAULT = {
  MEDIUM: [
    { "DielectricConstant": 1, "DielectricLoss": 0, "MagneticConstant": 1, "MagneticLoss": 0 },
    { "DielectricConstant": 1, "DielectricLoss": 100000000, "MagneticConstant": 1, "MagneticLoss": 0 }
  ],
  SETTING: { fieldX: 0.48, fieldY: 0.36, split: 350, freq: 12e9 },
  BITMAP:[],
  FEEDPOINT: [{ x: 0, y: 0, color: 'rgb(255, 0, 0)', phase: 0 }],
  COLORTHRESHOLD:0.08,
  AMPLITUDESCALER: {
    "Select": "SineWave", "simulationNum": 700,
    "SineWave": { "slope": -0.08, "shift": 70 },
    "Pulse": { "peakPosition": 100, "widthFactor": 2.5 }
  },
  COLOR:{
    colorThreshold:0.08,
    colorTransitionIndex:0
  }
}

export const BREAD = {
  HOME: [{ title: "FDTDシミュレーション", link: "home" }],
  SETTING: {
    MEDIUM: [
      { title: "FDTDシミュレーション", link: "home" },
      { title: "媒質を追加", link: "settingMedium" }
    ],
    DOMAINGRID: [
      { title: "FDTDシミュレーション", link: "home" },
      { title: "解析領域の設定", link: "settingDomainGrid" }
    ],
    INPUTWAVE: [
      { title: "FDTDシミュレーション", link: "home" },
      { title: "波形の設定", link: "settingInputWave" }
    ]
  }
}