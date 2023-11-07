import Graph from './Graph';
import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import { BoxDefault } from "./Box/BoxDefault";
import { BoxFormula } from "./Box/BoxForumula";
import { BoxSetting} from "./Box/BoxSetting";

const ContainerHome = styled.div`
  position:relative;
  display: inline-block;
  display:flex;
  flex-direction:row;
  height:100%;
  @media screen and (max-width: 1250px) {
    flex-direction: column;
  }
`

const SettingWrapper = styled.div`
  position:relative;
  flex-grow:1;
  min-width:520px;
  height:calc(100vh - 50px);
  display:flex;
  flex-direction:column;
  background-color:rgb(240,240,240);
  user-select: none;  /* 全てのブラウザでテキスト選択を無効にする */
  -webkit-user-select: none;  /* Safari 用 */
  -moz-user-select: none;  /* Firefox 用 */
  -ms-user-select: none;  /* Internet Explorer/Edge 用 */
`
const ToggleWrapper = styled.div`
  width:100%;
  flex-grow:1;
  overflow-y: scroll; // Always show vertical scrollbar
  max-height:100%;
  display: flex;  /* flex container */
  flex-direction: column;  /* column layout */

  /* Styling for the scrollbar */
  &::-webkit-scrollbar {
    width: 10px;  // Width of the scrollbar. Adjust as needed.
  }

  &::-webkit-scrollbar-track {
    background: rgb(230,230,230);  // Background of the track (part scrollbar moves in)
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(170,170,170);  // Color of the actual scrollbar
    border-radius: 4px;  // Optional: Makes the scrollbar rounded
    border: 2px solid transparent; // Prevents border from being offset on macOS browsers
    background-clip: padding-box;  // Makes the background color opaque (not transparent)
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(130,130,130);  // Darken scrollbar when hovered
  }
`
const ToggleInner = styled.div`
  width:100%;
  height:100%;
  background-color:rgb(240,240,240);
  display:flex;
  flex-direction:column;
  align-items: stretch;  /* 子要素を親の幅にストレッチさせる */
  `
const BoxWrapper = styled.div`
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:10px 10px 0px 10px;
`


const Label = styled.div`
  width:100%;
  text-align:right;
  font-size:13px;
`
export const Home = ({ setting, setSetting, amplitudeScaler, setAmplitudeScaler, defaultSetting, defaultAmplitudeScaler,setShowWindow }) => {
  const GraphProps = {
    setting,
    amplitudeScaler
  }
  const DefaultBoxProps={
    defaultSetting,
    defaultAmplitudeScaler
  }
  const SettingBox={
    setting, setSetting,
    amplitudeScaler, setAmplitudeScaler,
    defaultSetting,
    defaultAmplitudeScaler,
    setShowWindow
  }
  return (
    <ContainerHome>
      <Graph {...GraphProps} />
      <SettingWrapper>
        <ToggleWrapper>
          <ToggleInner>
            <BoxWrapper>
              <BoxFormula></BoxFormula>
              <BoxDefault {...DefaultBoxProps}></BoxDefault>
              <BoxSetting {...SettingBox}/>
              <div style={{height:"5px"}}></div>
            </BoxWrapper>
          </ToggleInner>
        </ToggleWrapper>
      </SettingWrapper>
    </ContainerHome>
  )
};