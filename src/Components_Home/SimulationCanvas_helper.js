import { useState, useEffect } from 'react';
export const useFDTDInput = (SimulationData) => {
  const [FDTD_Input, setFDTDInput] = useState({});
  useEffect(() => {
    if (!checker_SIMULATIONDATA(SimulationData)) return;
    const object = makeFDTDInput(SimulationData);
    setFDTDInput(object)
  }, [SimulationData])
  return FDTD_Input;
}

export function makeFDTDInput(data) {
  let c = 3.0e8;
  let lpml = 20;
  let setting = data.setting;
  let inputbitmap = data.bitmap;
  let feedPoint = data.feedPoint;
  let medium = data.medium;
  let colorThreshold = data.colorThreshold;
  let amplitudeScaler = data.amplitudeScaler;
  let lattice_width = setting.fieldX / setting.split;
  let nx_pec = Math.floor(setting.split);
  let ny_pec = Math.ceil(setting.fieldY / lattice_width);
  let nx = nx_pec + 2 * lpml;
  let ny = ny_pec + 2 * lpml;
  let feq = c / setting.lambda;
  let MediumsClass = [];
  let FeedPointsClass = [];
  let order = 4;
  let M = 8;
  let numbers = new Set();
  let mint = -1;
  let minv = -1;
  let bitmap = makeBitmap();
  medium.forEach((item, index) => {
    if (!numbers.has(index)) return;
    let root = Math.sqrt(item.DielectricConstant * item.MagneticConstant);
    if (root > 10 || root < 0.1) { return; }
    let v_candidate = c / root;
    let dt_candidate = (lattice_width / (v_candidate * Math.sqrt(2))) * 0.9;
    if (mint > dt_candidate) {
      mint = dt_candidate;
      minv = v_candidate;
    }
  });
  if (mint == -1) {
    mint = (lattice_width / (c * Math.sqrt(2))) * 0.9;
    minv = c / Math.sqrt(1.0);
  }
  medium.forEach((m) => {
    MediumsClass.push(makeMedium(m, feq, mint, lattice_width, lpml, order, M));
  });
  let dt = mint;
  let v = minv;


  feedPoint.forEach((f) => {
    FeedPointsClass.push({ x: f.x + lpml, y: f.y + lpml, phase: f.phase });
  })

  const obj = {
    nx: nx,
    ny: ny,
    lpml: lpml,
    lattice_width: lattice_width,
    bitmap: bitmap,
    dt: dt,
    v: v,
    order: order,
    feq: feq,
    FeedPoints: FeedPointsClass,
    Mediums: MediumsClass,
    colorThreshold: colorThreshold,
    amplitudeScaler, amplitudeScaler
  };
  return obj;

  function makeBitmap() {
    var x = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    for (let i = 0; i < nx_pec; i++) {
      for (let n = 0; n < ny_pec; n++) {
        x[i + lpml][n + lpml] = inputbitmap[i][n];
        numbers.add(inputbitmap[i][n]);
      }
    }
    return x;
  }
  function makeMedium(m, feq, dt, lattice_width, lpml, order, M) {
    let E0 = 8.8541878128e-12;  //真空中の誘電率[F/m]
    let M0 = 1.2566370621e-6; //真空中の透磁率 [H/m]

    let pml_conductivty_max = -((E0 * m.DielectricConstant) / (2.0 * dt)) * (-M) * (order + 1.0) / lpml;
    let pml_magnetic_max = (M0 * m.MagneticConstant) / (E0 * m.DielectricConstant) * pml_conductivty_max;
    let Permittivity = m.DielectricConstant * E0;//誘電率
    let Conductivity = m.DielectricLoss * 2 * Math.PI * feq * E0;//導電率
    let Permeability = m.MagneticConstant * M0;//透磁率
    let MagneticConductivity = m.MagneticLoss * 2 * Math.PI * feq * M0;//導磁率

    let ae = (2 * Permittivity - Conductivity * dt) / (2 * Permittivity + Conductivity * dt);
    let be = ((2 * dt) / (2 * Permittivity + Conductivity * dt)) / lattice_width;
    let am = (2 * Permeability - MagneticConductivity * dt) / (2 * Permeability + MagneticConductivity * dt);
    let bm = ((2 * dt) / (2 * Permeability + MagneticConductivity * dt)) / lattice_width;

    const obj = {
      ae: ae,
      be: be,
      am: am,
      bm: bm,
      Permittivity: Permittivity,
      Permeability: Permeability,
      pml_conductivty_max: pml_conductivty_max,
      pml_magnetic_max: pml_magnetic_max
    }
    return obj;
  }
}

export function checker_FDTDINPUT(obj1) {
  if (!obj1) return false;
  const fields = ['nx', 'ny', 'lpml', 'lattice_width', 'bitmap', 'dt', 'v', 'order', 'feq', 'FeedPoints', 'Mediums', 'colorThreshold', 'amplitudeScaler'];
  if (!fields.every(field => obj1.hasOwnProperty(field))) {
    return false;
  }
  return true;
}
export function checker_SIMULATIONDATA(obj) {
  if (!obj) return false;

  const settingFields = ['fieldX', 'fieldY', 'split', 'lambda'];
  // Before checking bitmap, make sure that the necessary setting fields exist
  if (!obj.setting || !settingFields.every(field => typeof obj.setting[field] === 'number')) {
    return false;
  }
  const xnum = obj.setting.split;
  const ynum = Math.ceil(obj.setting.fieldY / (obj.setting.fieldX / xnum));

  const requiredFields = {
    bitmap: (data) => {
      if (!Array.isArray(data)) return false;
      if (data.length !== xnum) return false;
      return data.every(subArray => Array.isArray(subArray) && subArray.length === ynum);
    },
    setting: (data) => {
      const settingFields = ['fieldX', 'fieldY', 'split', 'lambda'];
      return settingFields.every(field => typeof data[field] === 'number');
    },
    feedPoint: (data) => Array.isArray(data) && data.length > 0 && data.every(Item => {
      const feedPointFields = ['x', 'y', 'color', 'phase'];
      return feedPointFields.every(field => Item[field] !== undefined);
    }),
    medium: (data) => Array.isArray(data) && data.length > 0 && data.every(mediumItem => {
      const mediumFields = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];
      return mediumFields.every(field => typeof mediumItem[field] === 'number');
    }),
    colorThreshold: (data) => typeof data === 'number' && data >= 0,
    amplitudeScaler: (data) => {
      if (data === undefined) return false;
      const requiredAmplitudeScalerFields = ['Select', 'simulationNum', 'Rise', 'Pulse'];
      if (!requiredAmplitudeScalerFields.every(field => data[field] !== undefined)) return false;
      const { Rise, Pulse } = data;
      const riseFields = ['slope', 'shift']; const pulseFields = ['peakPosition', 'widthFactor'];
      if (!riseFields.every(field => typeof Rise[field] === 'number')) return false;
      if (!pulseFields.every(field => typeof Pulse[field] === 'number')) return false;
      return true;
    },
  };


  // Check if each required property exists and is valid
  for (const [key, validator] of Object.entries(requiredFields)) {
    if (!validator(obj[key])) return false;
  }

  return true;
}
export class ColorCode {
  m;
  colormap;
  constructor() {
    this.m = 0.1;
    this.colormap = new Array(200);
    this.calculateColors();
  }
  setM(max) {
    this.m = max;
  }
  calculateColors() {
    let r, g, b;
    for (let i = 0; i < 100; i++) {
      b = 255;
      r = Math.round(255.0 - 255.0 / (1 + Math.exp(-0.15 * (i - 30.0))));
      g = Math.round(255.0 - 255.0 / (1 + Math.exp(-0.1 * (i - 75.0))));
      this.colormap[100 - i] = `rgb(${r},${g},${b})`;
    }
    for (let i = 0; i < 100; i++) {
      r = 255;
      b = Math.round(255.0 - 255.0 / (1 + Math.exp(-0.15 * (i - 30.0))));
      g = Math.round(255.0 - 255.0 / (1 + Math.exp(-0.1 * (i - 75.0))));
      this.colormap[100 + i] = `rgb(${r},${g},${b})`;
    }
  }

  give(value) {
    let v = value / this.m;
    if (v >= 1.0) v = 1.0;
    if (v <= -1.0) v = -1.0;
    const intv = Math.round(v * 99.0) + 100;
    return !isNaN(value) ? this.colormap[intv] : 'rgb(0,0,0)';
  }
}
export class FDTD2D_PML {
  dt;
  t;
  nx;
  ny;
  lattice_width;
  lpml;
  order;
  bitmap;
  simulationNum;
  Ez; Ezx; Ezy;
  Hx; Hy;
  ae; be; am; bm;
  aexpml; aeypml; bexpml; beypml;
  amxpml; amypml; bmxpml; bmypml;

  pmlBlocks;
  Mediums;
  FeedPoints;
  feq;
  amplitudeScaler;
  constructor(fdtd_input) {
    if (!checker_FDTDINPUT(fdtd_input)) {
      console.error("AT FDTD2D_PML　無効なFDTD_INPUTの入力がありました");
      console.error(fdtd_input);
    }

    this.nx = fdtd_input.nx;
    this.ny = fdtd_input.ny;
    this.lattice_width = fdtd_input.lattice_width;
    this.lpml = fdtd_input.lpml;
    this.feq = fdtd_input.feq;
    this.bitmap = fdtd_input.bitmap;
    this.Mediums = fdtd_input.Mediums;
    this.FeedPoints = fdtd_input.FeedPoints;
    this.dt = fdtd_input.dt;
    this.order = fdtd_input.order;
    this.amplitudeScaler = fdtd_input.amplitudeScaler;
    var nx = this.nx;
    var ny = this.ny;
    var lpml = this.lpml;
    var lattice_width = this.lattice_width;
    var order = this.order;
    var dt = this.dt;
    var order = this.order;
    var bitmap = this.bitmap;
    this.Ez = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Ezx = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Ezy = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Hx = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Hy = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));

    this.ae = new Array(nx);
    this.be = new Array(nx);
    this.am = new Array(nx);
    this.bm = new Array(nx);
    for (let i = 0; i < nx; i++) {
      this.ae[i] = new Array(ny);
      this.be[i] = new Array(ny);
      this.am[i] = new Array(ny);
      this.bm[i] = new Array(ny);
      for (let j = 0; j < ny; j++) {
        const m = this.Mediums[bitmap[i][j]];
        this.ae[i][j] = m.ae;
        this.be[i][j] = m.be;
        this.am[i][j] = m.am;
        this.bm[i][j] = m.bm;
      }
    }
    this.aexpml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.bexpml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.amxpml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.bmxpml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.aeypml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.beypml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.amypml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.bmypml = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.t = 0;
    this.simulationNum = 0;

    this.pmlBlocks = [];
    this.pmlBlocks.push({ sx: 0, sy: 0, ex: lpml, ey: ny });
    this.pmlBlocks.push({ sx: nx - lpml, sy: 0, ex: nx, ey: ny });
    this.pmlBlocks.push({ sx: lpml, sy: 0, ex: nx - lpml, ey: lpml });
    this.pmlBlocks.push({ sx: lpml, sy: ny - lpml, ex: nx - lpml, ey: ny });
    const set_pml = () => {

      const oneKado = (dirX, dirY) => {
        for (let i = 1; i <= lpml; i++) {
          let t_aexpml = this.aexpml[xpoint + i * dirX][ypoint];
          let t_bexpml = this.bexpml[xpoint + i * dirX][ypoint];
          let t_amxpml = this.amxpml[xpoint + i * dirX][ypoint];
          let t_bmxpml = this.bmxpml[xpoint + i * dirX][ypoint];

          for (let n = 1; n <= lpml; n++) {
            this.aexpml[xpoint + i * dirX][ypoint + n * dirY] = t_aexpml;
            this.bexpml[xpoint + i * dirX][ypoint + n * dirY] = t_bexpml;
            this.amxpml[xpoint + i * dirX][ypoint + n * dirY] = t_amxpml;
            this.bmxpml[xpoint + i * dirX][ypoint + n * dirY] = t_bmxpml;
          }
        }

        for (let i = 1; i <= lpml; i++) {
          let t_aeypml = this.aeypml[xpoint][ypoint + i * dirY];
          let t_beypml = this.beypml[xpoint][ypoint + i * dirY];
          let t_amypml = this.amypml[xpoint][ypoint + i * dirY];
          let t_bmypml = this.bmypml[xpoint][ypoint + i * dirY];

          for (let n = 1; n <= lpml; n++) {
            this.aeypml[xpoint + n * dirX][ypoint + i * dirY] = t_aeypml;
            this.beypml[xpoint + n * dirX][ypoint + i * dirY] = t_beypml;
            this.amypml[xpoint + n * dirX][ypoint + i * dirY] = t_amypml;
            this.bmypml[xpoint + n * dirX][ypoint + i * dirY] = t_bmypml;
          }
        }
      }
      const onedirection = (rad, length) => {
        class Vector {
          constructor(x, y) {
            this.X = x;
            this.Y = y;
          }
        }
        const onepmlline = () => {
          let pml_conductivty_max = this.Mediums[bitmap[xpoint][ypoint]].pml_conductivty_max;
          let pml_magnetic_max = this.Mediums[bitmap[xpoint][ypoint]].pml_magnetic_max;
          let e = this.Mediums[bitmap[xpoint][ypoint]].Permittivity;
          let m = this.Mediums[bitmap[xpoint][ypoint]].Permeability;

          if (pmlV.X === 0) {
            let l = 0;
            for (let i = 1; i <= lpml; i++, l += 1.0) {
              this.aexpml[xpoint][ypoint + pmlV.Y * i] = this.ae[xpoint][ypoint];
              this.bexpml[xpoint][ypoint + pmlV.Y * i] = this.be[xpoint][ypoint];
              this.amxpml[xpoint][ypoint + pmlV.Y * i] = this.am[xpoint][ypoint];
              this.bmxpml[xpoint][ypoint + pmlV.Y * i] = this.bm[xpoint][ypoint];
              let te = (l + 1.0) / lpml;
              let tm = (l + 0.5) / lpml;
              let sigxe = pml_conductivty_max * Math.pow(te, order);
              let sigxm = pml_magnetic_max * Math.pow(tm, order);
              let a = (2.0 * e - sigxe * dt) / (2.0 * e + sigxe * dt);
              let b = ((2.0 * dt) / (2.0 * e + sigxe * dt)) / lattice_width;
              let c = (2.0 * m - sigxm * dt) / (2.0 * m + sigxm * dt);
              let d = ((2.0 * dt) / (2.0 * m + sigxm * dt)) / lattice_width;
              this.aeypml[xpoint][ypoint + pmlV.Y * i] = a;
              this.beypml[xpoint][ypoint + pmlV.Y * i] = b;
              this.amypml[xpoint][ypoint + pmlV.Y * i] = c;
              this.bmypml[xpoint][ypoint + pmlV.Y * i] = d;
            }
          } else {
            let l = 0;
            for (let i = 1; i <= lpml; i++, l += 1.0) {
              this.aeypml[xpoint + pmlV.X * i][ypoint] = this.ae[xpoint][ypoint];
              this.beypml[xpoint + pmlV.X * i][ypoint] = this.be[xpoint][ypoint];
              this.amypml[xpoint + pmlV.X * i][ypoint] = this.am[xpoint][ypoint];
              this.bmypml[xpoint + pmlV.X * i][ypoint] = this.bm[xpoint][ypoint];

              let te = (l + 1.0) / lpml;
              let tm = (l + 0.5) / lpml;

              let sigxe = pml_conductivty_max * Math.pow(te, order);
              let sigxm = pml_magnetic_max * Math.pow(tm, order);
              let a = (2.0 * e - sigxe * dt) / (2.0 * e + sigxe * dt);
              let b = ((2.0 * dt) / (2.0 * e + sigxe * dt)) / lattice_width;
              let c = (2.0 * m - sigxm * dt) / (2.0 * m + sigxm * dt);
              let d = ((2.0 * dt) / (2.0 * m + sigxm * dt)) / lattice_width;
              this.aexpml[xpoint + pmlV.X * i][ypoint] = a;
              this.bexpml[xpoint + pmlV.X * i][ypoint] = b;
              this.amxpml[xpoint + pmlV.X * i][ypoint] = c;
              this.bmxpml[xpoint + pmlV.X * i][ypoint] = d;
            }
          }
        }
        let moveV = new Vector(Math.round(Math.cos(rad)), Math.round(Math.sin(rad)));
        let pmlV = new Vector(Math.round(Math.cos(rad - Math.PI / 2)), Math.round(Math.sin(rad - Math.PI / 2)));
        onepmlline();
        for (let i = 0; i < length; i++) {
          xpoint += moveV.X;
          ypoint += moveV.Y;
          onepmlline();
        }
      }
      var xpoint = lpml;
      var ypoint = lpml;
      let lengths = [nx - 2 * lpml - 1, ny - 2 * lpml - 1, nx - 2 * lpml - 1, ny - 2 * lpml - 1];
      var radian = 0;

      for (let i = 0; i < 4; i++) {
        onedirection(radian, lengths[i]);
        radian += Math.PI / 2;
      }
      xpoint = lpml;
      ypoint = lpml;
      let switchpointX = [0, 1, 0, -1];
      let switchpointY = [0, 0, 1, 0];
      let KadoPMLdirectionX = [-1, 1, 1, -1];
      let KadoPMLdirectionY = [-1, -1, 1, 1];
      for (let i = 0; i < 4; i++) {
        if (i !== 0) {
          xpoint += lengths[i - 1] * switchpointX[i];
          ypoint += lengths[i - 1] * switchpointY[i];
        }
        oneKado(KadoPMLdirectionX[i], KadoPMLdirectionY[i]);
      }
    }
    set_pml();
  }

  get_Ez() {
    return this.Ez;
  }
  cal_E() {
    for (var i = this.lpml; i < this.nx - this.lpml; i++) {
      for (var n = this.lpml; n < this.ny - this.lpml; n++) {
        this.Ez[i][n] = this.ae[i][n] * this.Ez[i][n] + this.be[i][n] * (this.Hy[i][n] - this.Hy[i - 1][n])
          - this.be[i][n] * (this.Hx[i][n] - this.Hx[i][n - 1]);
      }
    }
  }
  cal_H() {
    for (var i = this.lpml; i < this.nx - this.lpml; i++) {
      for (var n = this.lpml; n < this.ny - this.lpml; n++) {
        this.Hx[i][n] = this.am[i][n] * this.Hx[i][n] - this.bm[i][n] * (this.Ez[i][n + 1] - this.Ez[i][n]);
      }
    }
    for (var i = this.lpml; i < this.nx - this.lpml; i++) {
      for (var n = this.lpml; n < this.ny - this.lpml; n++) {
        this.Hy[i][n] = this.am[i][n] * this.Hy[i][n] + this.bm[i][n] * (this.Ez[i + 1][n] - this.Ez[i][n]);
      }
    }
  }
  cal_Epml() {
    var addi;
    var addn;
    addi = 0; addn = 0;
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];
      if (x == 0) { addi = 1; } else { addi = 0; }
      if (x == 0 || x == 1 || x == 2) { addn = 1; } else { addn = 0; }
      for (var i = p_b.sx + addi; i < p_b.ex; i++) {
        for (var n = p_b.sy + addn; n < p_b.ey; n++) {
          this.Ezx[i][n] = this.aexpml[i][n] * this.Ezx[i][n] + this.bexpml[i][n] * (this.Hy[i][n] - this.Hy[i - 1][n]);
          this.Ezy[i][n] = this.aeypml[i][n] * this.Ezy[i][n] - this.beypml[i][n] * (this.Hx[i][n] - this.Hx[i][n - 1]);
          this.Ez[i][n] = this.Ezx[i][n] + this.Ezy[i][n];
        }
      }
    }
  }
  cal_Hpml() {
    var limiti;
    var limitn;
    limiti = 0; limitn = 0;
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];

      if (x == 0 || x == 1 || x == 3) { limitn = 1; } else { limitn = 0; }
      for (var i = p_b.sx; i < p_b.ex; i++) {
        for (var n = p_b.sy; n < p_b.ey - limitn; n++) {
          this.Hx[i][n] = this.amypml[i][n] * this.Hx[i][n] - this.bmypml[i][n] * (this.Ez[i][n + 1] - this.Ez[i][n]);
        }
      }
    }
    limiti = 0; limitn = 0;
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];
      if (x == 1) { limiti = 1; } else { limiti = 0; }
      for (var i = p_b.sx; i < p_b.ex - limiti; i++) {
        for (var n = p_b.sy; n < p_b.ey; n++) {
          this.Hy[i][n] = this.amxpml[i][n] * this.Hy[i][n] + this.bmxpml[i][n] * (this.Ez[i + 1][n] - this.Ez[i][n]);
        }
      }
    }
    limiti = 0; limitn = 0;
  }

  func_AmplitudeScaler(simulationnum) {
    if (this.amplitudeScaler.Select === "Rise") {
      return 1 / (1 + Math.exp(this.amplitudeScaler.Rise.slope * (simulationnum - this.amplitudeScaler.Rise.shift)));
    }
    if (this.amplitudeScaler.Select === "Pulse") {
      return Math.exp(-Math.pow((simulationnum - this.amplitudeScaler.Pulse.peakPosition), 2) / (this.amplitudeScaler.Pulse.widthFactor * 400));
    }
    return 100000;
  }
  feed() {
    this.FeedPoints.forEach((f) => {
      this.Ez[f.x][f.y] += 1.0 * Math.sin(2.0 * Math.PI * this.feq * this.t + Math.PI * f.phase / 180) * this.func_AmplitudeScaler(this.simulationNum);
    })
  }
  cal() {
    this.cal_E();
    this.feed();
    this.cal_Epml();
    this.t += this.dt / 2.0;
    this.cal_H();
    this.cal_Hpml();
    this.t += this.dt / 2.0;
    this.simulationNum++;
  }
}