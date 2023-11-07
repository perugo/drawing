export const DEFAULT = {
  MEDIUM: [
    { "DielectricConstant": 1, "DielectricLoss": 0, "MagneticConstant": 1, "MagneticLoss": 0 },
    { "DielectricConstant": 1, "DielectricLoss": 100000000, "MagneticConstant": 1, "MagneticLoss": 0 }
  ],
  SETTING: { fieldX: 0.048, fieldY: 0.036, split: 200, lambda: 0.00408 },
  BITMAP:[],
  FEEDPOINT: [{ x: 0, y: 0, color: 'rgb(255, 0, 0)', phase: 0 }],
  COLORTHRESHOLD:0.085,
  AMPLITUDESCALER: {
    "Select": "Rise", "simulationNum": 700,
    "Rise": { "slope": -0.03, "shift": 100 },
    "Pulse": { "peakPosition": 100, "widthFactor": 2.5 }
  }
}

export const BREAD = {
  HOME: [{ title: "FDTDシュミレーション", link: "home" }],
  SETTING: {
    MEDIUM: [
      { title: "FDTDシュミレーション", link: "home" },
      { title: "媒質の追加", link: "settingMedium" }
    ],
    DOMAINGRID: [
      { title: "FDTDシュミレーション", link: "home" },
      { title: "解析領域の設定", link: "settingDomainGrid" }
    ],
    INPUTWAVE: [
      { title: "FDTDシュミレーション", link: "home" },
      { title: "入力波カスタム設定", link: "settingInputWave" }
    ]
  }
}