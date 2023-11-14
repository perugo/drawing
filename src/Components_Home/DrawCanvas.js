import styled from "styled-components";
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { React } from 'react';

import {
  checker_DRAWDATA,
  checker_NOCHANGE,
  compare_ONLYFREQCHANGE,
  compare_ONLYMEDIUMCHANGE,
  compare_ONLYFEEDPOINTCHANGE,
  compare_RectNOCHANGE,
  maker_FEEDPOINT,
  confirm_FEEDPOINT,
  maker_BITMAP,
  useCanvasAndWidthHeight,
  checker_CLEARBITMAP,
  maker_clearBitmap
} from './DrawCanvas_helper';

const Canvas = styled.canvas`
  position:absolute;
  top:0;
  left:0;
  opacity:1.0;
`
const Container = styled.div`
  position:relative;
  width:100%;
  height:100%;
`
const Layout_Wrapper = styled.div`
  position:relative;
  width:100%;
  height:100%;
`
var drag; //ユーザーがマウスを押している状態かを取得する
var drag_source;//ユーザーが赤い点をドラッグ操作しているかを取得する
var drag_source_index = -1;
var start_x; //ユーザーがマウスを押し始めたx座標
var start_y; //ユーザーがマウスを押し始めたy座標
var end_x; //ユーザーが現在マウスを押しているx座標
var end_y; //ユーザーが現在マウスを押しているy座標
var canvasDx;
var canvasDy;
var object_index;
var feedPoint; //an Array of feedPoints
var bitmap;
var xnum;
var ynum;
var fieldX;
var freq;
let medium;
const MEDIUM_COLOR = ['rgb(255,255,255)', 'rgb(0,0,0)', 'rgb(0,0,200)', 'rgb(0,255,0)', 'rgb(255,2250,0)'];

export const DrawCanvas = ({ drawData, setBitmap, setFeedPoint, selectedIndex,rect }) => {
  const timeoutIdRef = useRef(); //draw_canvasはonMousemoveをして0.8秒経ってから実行する遅延用
  const layoutWrapperRef = useRef(null); //canvasの親<div>Ref
  const prevDrawDataRef = useRef(null); //一つ前のdrawData
  const prevRect = useRef(null);
  const ctx1Ref = useRef(null); const canvas1Ref = useRef(null);
  const ctx2Ref = useRef(null); const canvas2Ref = useRef(null);
  const ctx3Ref = useRef(null); const canvas3Ref = useRef(null);
  const ctx4Ref = useRef(null); const canvas4Ref = useRef(null);
  const timeronMousemoveRef = useRef(null); //onMousemoveを0.1秒ごとに実行する遅延用
  const timerbitmapRef = useRef(); //set_bitmapはbitmapを変えてから、0.5秒後に実行する遅延用
  const timerfeedPointRef = useRef(); //setFeedPointはfeedPointを変えてから、0.3秒後に実行する遅延用
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const canvasRefs = useMemo(() => ({
    canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref
  }), [canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref]);
  const ctxRefs = useMemo(() => ({
    ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref
  }), [ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref]);
  useCanvasAndWidthHeight(layoutWrapperRef, setWidth, setHeight,rect);

  useEffect(() => {
    if (!checker_DRAWDATA(drawData) || width === 0) return;
    if (checker_CLEARBITMAP(drawData, prevDrawDataRef.current) && compare_RectNOCHANGE(prevRect, width, height)) {
      console.log("clear bitmap");
      bitmap = maker_clearBitmap(setBitmap, xnum, ynum);
      everyBitmapDraw();
      draw_canvas();
    } else if (checker_NOCHANGE(drawData, prevDrawDataRef.current) && compare_RectNOCHANGE(prevRect, width, height)) {
      console.log("no change");
      return;
    } else if (compare_ONLYFREQCHANGE(prevDrawDataRef.current, drawData) && compare_RectNOCHANGE(prevRect, width, height)) {
      console.log("only lambda");
      freq = drawData.setting.freq;
      draw_canvas();
    } else if (compare_ONLYMEDIUMCHANGE(prevDrawDataRef.current, drawData) && compare_RectNOCHANGE(prevRect, width, height)) {
      console.log("only medium");
      medium = drawData.medium;
      everyBitmapDraw();
    } else if (compare_ONLYFEEDPOINTCHANGE(prevDrawDataRef.current, drawData) && compare_RectNOCHANGE(prevRect, width, height)) {
      console.log("only feedPoint");
      feedPoint = confirm_FEEDPOINT(drawData.feedPoint,setFeedPoint,xnum,ynum);
      draw_canvas();
      draw_feedPoint();
    } else {
      const { canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref } = canvasRefs;
      const { ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref } = ctxRefs;
      ctx1Ref.current = canvas1Ref.current.getContext('2d');
      ctx2Ref.current = canvas2Ref.current.getContext('2d');
      ctx3Ref.current = canvas3Ref.current.getContext('2d');
      ctx4Ref.current = canvas4Ref.current.getContext('2d');
      const Rect = layoutWrapperRef.current.getBoundingClientRect();
      [canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref].forEach(canvasRef => {
        canvasRef.current.width = Rect.width;
        canvasRef.current.height = Rect.height;
      });
      setWidth(Rect.width); setHeight(Rect.height);

      const {setting,feedPoint:inputFeedPoint,bitmap:inputBitmap,medium:inputMedium}=drawData;
      const {fieldX:inputFieldX,fieldY:inputFieldY,split,freq:inputFreq}=setting;
      freq=inputFreq;
      fieldX = inputFieldX;
      xnum = split;
      let dx = fieldX / xnum;
      ynum = Math.ceil(inputFieldY / dx);
      canvasDx = width / xnum;
      canvasDy = width / xnum;
      feedPoint = maker_FEEDPOINT(inputFeedPoint, setFeedPoint, xnum, ynum);
      bitmap = maker_BITMAP(inputBitmap, setBitmap, xnum, ynum);
      medium = inputMedium;
      drag = false;
      drag_source = false;
      draw_canvas_background();
      startTimer();
      draw_feedPoint();
      draw_canvas();
      everyBitmapDraw();
    }
    prevDrawDataRef.current = drawData;
    prevRect.current = { width: width, height: height };
  }, [drawData, width,height]);
  useEffect(() => {
    const { canvas1Ref } = canvasRefs;
    canvas1Ref.current.addEventListener('mousedown', onMousedown, false); //canvas内でマウスを押した際、on_mousedown()メソッドを実行するアクションリスナーを作る
    canvas1Ref.current.addEventListener('mousemove', onMousemove, false); //canvas内でマウスを動かした際、on_mousemove()メソッドを実行するアクションリスナーを作る
    canvas1Ref.current.addEventListener('mouseup', onMouseup, false); //canvas内でマウスを離した際、on_mouseup()メソッドを実行するアクションリスナーを作る
    return () => {
      if (canvas1Ref.current) {
        canvas1Ref.current.removeEventListener('mousedown', onMousedown);
        canvas1Ref.current.removeEventListener('mousemove', onMousemove);
        canvas1Ref.current.removeEventListener('mouseup', onMouseup);
      }
    };
  }, [canvasRefs, width,height]);

  useEffect(() => {
    object_index = selectedIndex;
  }, [selectedIndex])

  const startTimer = () => {
    timeoutIdRef.current = setTimeout(handleTimeout, 300);
  };
  const handleTimeout = () => {
    draw_canvas();
  };
  const startBitmapTimer = () => {
    timerbitmapRef.current = setTimeout(handleBitmapTimeout, 500);
  }
  const handleBitmapTimeout = () => {
    const obj = bitmap;
    setBitmap(obj);
  };

  const startFeedPointTimer = () => {
    timerfeedPointRef.current = setTimeout(handleFeedpointTimeout, 200);
  }
  const handleUpdatefeedPoint = (newX, newY, feedPointIndex) => {
    clearTimeout(timerfeedPointRef.current);
    if (feedPointIndex >= 0 && feedPointIndex < feedPoint.length) {
      feedPoint[feedPointIndex].x = newX;
      feedPoint[feedPointIndex].y = newY;
    }
    startFeedPointTimer();
  }
  const handleFeedpointTimeout = () => {
    const obj = [...feedPoint];
    setFeedPoint(obj);
  }

  function onMousedown(e) {
    if (!drag && !drag_source) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var xCIE = Math.floor(x / canvasDx);
      var yCIE = Math.floor(y / canvasDy);
      if (!drag_source && getSourceIndex(xCIE, yCIE) !== -1) {
        drag_source = true;
        drag_source_index = getSourceIndex(xCIE, yCIE);
      } else if (x <= width && y <= height) {
        start_x = x; start_y = y;
        end_x = start_x; end_y = start_y;
        bitmap_set(start_x / canvasDx, start_y / canvasDy, object_index);
        draw();
        drag = true;
      }
    }
    function getSourceIndex(xCIE, yCIE) {
      if (feedPoint[0].x === undefined) return -1;
      let foundIndex = -1;
      feedPoint.forEach((fPoint, index) => {
        if ((xCIE == fPoint.x - 1 || xCIE == fPoint.x || xCIE == fPoint.x + 1) &&
          (yCIE == fPoint.y - 1 || yCIE == fPoint.y || yCIE == fPoint.y + 1)) {
          foundIndex = index;
        }
      });
      return foundIndex;
    }
  };

  function onMousemove(e) {
    if (!timeronMousemoveRef.current) {
      if (drag_source) {
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left);
        var y = (e.clientY - rect.top);
        var xCIE = Math.floor(x / canvasDx);
        var yCIE = Math.floor(y / canvasDy);
        if (xCIE >= 0 && xCIE < xnum && yCIE >= 0 && yCIE < ynum) {
          handleUpdatefeedPoint(xCIE, yCIE, drag_source_index);
          draw_feedPoint();
        }
      } else if (drag) {
        var rect = e.target.getBoundingClientRect();
        end_x = e.clientX - rect.left;
        end_y = e.clientY - rect.top;
        draw();
      }
      timeronMousemoveRef.current = setTimeout(() => {
        timeronMousemoveRef.current = null;
      }, 100);
    }
  }
  function onMouseup(e) {
    drag = false;
    drag_source = false;
    drag_source_index = -1;
    draw();
  }

  function everyBitmapDraw() {
    if (medium.length <= 1 || width === 0) return;
    for (var i = 0; i < xnum; i++) {
      for (var n = 0; n < ynum; n++) {
        var c = bitmap[i][n];
        if (c === 0 || c >= medium.length) {
          ctx2Ref.current.clearRect(i * canvasDx, n * canvasDy, canvasDx + 1, canvasDy + 1)
          bitmap[i][n] = 0;
        } else {
          ctx2Ref.current.fillStyle = MEDIUM_COLOR[c];
          ctx2Ref.current.fillRect(i * canvasDx, n * canvasDy, canvasDx + 1, canvasDy + 1);
        }
      }
    }
    draw_canvas();
    startBitmapTimer();
  }


  function draw_canvas_background() {
    const WIDTH=canvasDx*xnum; const HEIGHT=canvasDx*ynum;
    ctx4Ref.current.clearRect(0, 0, WIDTH, HEIGHT);
    line(0, 1, WIDTH, 1, 2, "black");
    line(1, 0, 1, HEIGHT, 2, "black");
    line(0, HEIGHT - 1, WIDTH, HEIGHT - 1, 2, "black");
    line(WIDTH - 1, 0, WIDTH - 1, HEIGHT, 2, "black");
    for (var i = 0; i < xnum; i++) {
      line(canvasDx * i, 0, canvasDx * i, HEIGHT, 1, "rgba(0,0,0,0.2)");
    }
    for (var i = 0; i < ynum; i++) {
      line(0, canvasDy * i, WIDTH, canvasDy * i, 1, "rgba(0,0,0,0.2)");
    }
    function line(x1, y1, x2, y2, w, col) {
      ctx4Ref.current.strokeStyle = col;
      ctx4Ref.current.lineWidth = w;
      ctx4Ref.current.beginPath();
      ctx4Ref.current.moveTo(x1, y1);
      ctx4Ref.current.lineTo(x2, y2);
      ctx4Ref.current.stroke();
    }
  }

  function bitmap_set(x, y, i) {
    clearTimeout(timerbitmapRef.current);
    var xCIE = Math.floor(x);
    var yCIE = Math.floor(y);
    if ((xCIE - 1) > xnum || (yCIE - 1) > ynum || xCIE < 0 || yCIE < 0) {
    } else {
      bitmap[xCIE][yCIE] = object_index;
    }
    startBitmapTimer();
    if (i === 0) {
      ctx2Ref.current.clearRect(xCIE * canvasDx, yCIE * canvasDy, canvasDx + 1, canvasDy + 1)
    } else {
      ctx2Ref.current.fillStyle = MEDIUM_COLOR[i];
      ctx2Ref.current.fillRect(xCIE * canvasDx, yCIE * canvasDy, canvasDx + 1, canvasDy + 1);
    }
  }

  function draw_feedPoint() {
    if (feedPoint[0].x === undefined) return;
    ctx1Ref.current.clearRect(0, 0, width, height);
    feedPoint.forEach((fPoint, i) => {
      ctx1Ref.current.fillStyle = fPoint.color;
      ctx1Ref.current.fillRect(fPoint.x * canvasDx - 4, fPoint.y * canvasDy - 4, canvasDx + 8, canvasDy + 8);
    });
  }
  function draw() {
    clearTimeout(timeoutIdRef.current);
    startTimer();
    if (drag) {
      var disp_x;
      var disp_y;
      var w;
      var h;
      if (start_x < end_x) {
        disp_x = start_x;
        w = end_x - start_x;
      } else {
        disp_x = end_x;
        w = start_x - end_x;
      }
      if (start_y < end_y) {
        disp_y = start_y;
        h = end_y - start_y;
      } else {
        disp_y = end_y;
        h = start_y - end_y;
      }
      for (var i = Math.floor(disp_x / canvasDx); (disp_x + w) / canvasDx >= i; i++) {
        for (var n = Math.floor(disp_y / canvasDy); (disp_y + h) / canvasDy >= n; n++) {
          bitmap_set(i, n, object_index);
        }
      }
    }
  }

  function draw_canvas() {
    ctx3Ref.current.clearRect(0, 0, width, height);

    feedPoint.forEach((fPoint, index) => {
      const scaleFactor = width / xnum;
      const mediumIndex = bitmap[fPoint.x][fPoint.y];
      const m = medium[mediumIndex];
      if (m.DielectricLoss !== 0 || m.MagneticLoss !== 0) return;

      let realRadius = 3e8/freq * width / fieldX;
      realRadius = realRadius / Math.sqrt(m.DielectricConstant * m.MagneticConstant);
      const numm = (height / realRadius) > (width / realRadius) ? height / realRadius : width / realRadius;
      let numCircles = (numm > 40) ? 40 : numm;
      ctx3Ref.current.save();

      let numbers = new Set();
      const mediumFields = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];
      medium.forEach((mediumitem, index) => {
        const mediumMatch = mediumFields.every(field => m[field] === mediumitem[field]);
        if (mediumMatch) numbers.add(index)
      });

      var clippoint = [];
      var stepSize = 0.5;
      for (var deg = 0; deg < 2 * Math.PI; deg += 2 * Math.PI / 100) {
        var x = fPoint.x;
        var y = fPoint.y;
        var v = mediumIndex;
        while (numbers.has(v) && (x > 0 && x < xnum - 1) && (y > 0 && y < ynum - 1)) {
          x += stepSize * (Math.cos(deg));
          y += stepSize * (Math.sin(deg));
          v = bitmap[Math.round(x)][Math.round(y)];
        }
        clippoint.push([Math.round(x), Math.round(y)]);
      }
      ctx3Ref.current.beginPath();
      ctx3Ref.current.moveTo(clippoint[0][0] * scaleFactor, clippoint[0][1] * scaleFactor);
      for (var i = 1; i < clippoint.length; i++) {
        ctx3Ref.current.lineTo(clippoint[i][0] * scaleFactor, clippoint[i][1] * scaleFactor);
      }
      ctx3Ref.current.closePath();
      ctx3Ref.current.clip();

      const circleStrokeOpacity = feedPoint.length > 2 ? 0.2 : 0.4;

      const phasediff = (1 - fPoint.phase / 360);
      for (let i = 0; i < numCircles; i++) {
        ctx3Ref.current.beginPath();
        ctx3Ref.current.arc((fPoint.x + 0.5) * scaleFactor, (fPoint.y + 0.5) * scaleFactor, realRadius * phasediff + i * (realRadius), 0, 2 * Math.PI);
        ctx3Ref.current.strokeStyle = `rgba(0,0,255,${circleStrokeOpacity})`;
        ctx3Ref.current.lineWidth = 1;
        ctx3Ref.current.stroke();
      }
      ctx3Ref.current.restore();
    });
  }

  //格子線
  //青い円
  //障害物
  //赤い点
  return (
    <Container>
      <Layout_Wrapper ref={layoutWrapperRef}>
        <Canvas ref={canvas4Ref} />
        <Canvas ref={canvas3Ref} />
        <Canvas ref={canvas2Ref} style={{ opacity: 0.6 }} />
        <Canvas ref={canvas1Ref} />
      </Layout_Wrapper>
    </Container>
  )
};
