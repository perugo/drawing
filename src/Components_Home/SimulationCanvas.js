import styled from "styled-components";
import { useRef, useState, useEffect, useLayoutEffect } from 'react';

import {
  useFDTDInput,
  checker_FDTDINPUT,
  ColorCode,
  FDTD2D_PML
} from './SimulationCanvas_helper';
const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1.0;
    
`;
const Container = styled.div`
    position: relative;
    width:100%;
    height:100%;
    margin:0px 10px 0px 0px;
`;
const Layout_Wrapper = styled.div`
  border: 1px solid rgb(180, 180, 180); // Border line
  box-shadow: 2px 2px 2px rgb(100, 100, 100); // Shadow effect
  position:relative;
  width:100%;
  height:100%;
`;
let lastTimestamp = 0;

var nx;
var ny;
var lpml;
var dx;
const interval = 110;
const drawcanvasrate = 4;
var filmnum = 100;
var filmcounter = 0;
const MEDIUM_COLOR = ['rgb(255,255,255)', 'rgb(0,0,0)', 'rgb(0,0,200)', 'rgb(0,255,0)', 'rgb(255,180,0)'];

export const SimulationCanvas = ({ simulationData, showSimulation, setShowSimulation, moveVideo, setMoveVideo, rect }) => {
  const canvas1Ref = useRef(null);
  const ctxRef = useRef(null);
  const canvasbackgroundRef = useRef(null);
  const ctxbackgroundRef = useRef(null);
  const FDTD_Input = useFDTDInput(simulationData);
  const colorCodeRef = useRef(null);
  const FDTD2D_PMLRef = useRef(null);
  const layoutWrapperRef = useRef(null);
  const [RECT, setRECT] = useState({ width: 0, height: 0 });
  const movevideoRef = useRef(true);
  const showSimulationRef = useRef(false);

  useEffect(() => {
    movevideoRef.current = true;
    if (!checker_FDTDINPUT(FDTD_Input) || RECT.width === 0) return;
    FDTD2D_PMLRef.current = new FDTD2D_PML(FDTD_Input);
    showSimulationRef.current = true;
    filmcounter = 0;
    nx = FDTD_Input.nx;
    ny = FDTD_Input.ny;
    lpml = FDTD_Input.lpml;
    dx = RECT.width / (FDTD_Input.nx - FDTD_Input.lpml * 2);
    colorCodeRef.current.setM(FDTD_Input.colorThreshold);
    let amplitudeScaler = FDTD_Input.amplitudeScaler;
    filmnum = amplitudeScaler.simulationNum / drawcanvasrate;
    requestAnimationFrame(Program);
    drawbackground(ctxbackgroundRef.current, simulationData.bitmap);
  }, [FDTD_Input]);

  useEffect(() => {
    const delay = 300; // set the delay time as needed
    if (layoutWrapperRef.current) {
      const timer = setTimeout(() => {
        const Rect = layoutWrapperRef.current.getBoundingClientRect();
        setRECT(Rect);
        ctxRef.current = canvas1Ref.current.getContext('2d');
        ctxbackgroundRef.current = canvasbackgroundRef.current.getContext('2d');
        canvas1Ref.current.width = Rect.width; canvas1Ref.current.height = Rect.height;
        canvasbackgroundRef.current.width = Rect.width; canvasbackgroundRef.current.height = Rect.height;
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [layoutWrapperRef, rect])

  useEffect(() => {
    setMoveVideo(true);
    if (!showSimulation) FDTD2D_PMLRef.current = null;
    showSimulationRef.current = showSimulation;
  }, [showSimulation]);
  useEffect(() => {
    movevideoRef.current = moveVideo;
    requestAnimationFrame(Program);
  }, [moveVideo])
  useEffect(() => {
    colorCodeRef.current = new ColorCode();
  }, [])

  const Program = (timestamp) => {
    if (timestamp - lastTimestamp >= interval && filmcounter < filmnum && showSimulationRef.current && movevideoRef.current) {
      for (let i = 0; i < drawcanvasrate; i++) {
        FDTD2D_PMLRef.current.cal();
      }
      canvas(ctxRef.current);
      requestAnimationFrame(Program);
      lastTimestamp = timestamp;
      filmcounter += 1;
    }
    if (filmcounter >= filmnum) setShowSimulation(false);
    if (showSimulationRef.current && movevideoRef.current) {
      requestAnimationFrame(Program);
    }
  };


  const stopvideo = () => {
    setMoveVideo(!moveVideo);
  }
  const canvas = (ctx) => {
    var Ez = FDTD2D_PMLRef.current.get_Ez();
    for (var i = lpml; i < nx - lpml; i++) {
      for (var n = lpml; n < ny - lpml; n++) {
        ctx.fillStyle = colorCodeRef.current.give(Ez[i][n]);
        ctx.fillRect((i - lpml) * dx, (n - lpml) * dx, dx + 1, dx + 1);
      }
    }
  }
  const drawbackground = (ctx, bitmap) => {
    for (var i = 0; i < nx - lpml * 2; i++) {
      for (var n = 0; n < ny - lpml * 2; n++) {
        ctx.fillStyle = MEDIUM_COLOR[bitmap[i][n]];
        ctx.fillRect(i * dx, n * dx, dx + 1, dx + 1);
      }
    }
  }
  return (
    <Container>
      <Layout_Wrapper onClick={stopvideo} ref={layoutWrapperRef}>
        <Canvas ref={canvas1Ref} />
        <Canvas ref={canvasbackgroundRef} style={{ opacity: "0.2" }} />
      </Layout_Wrapper>
    </Container>
  )
};