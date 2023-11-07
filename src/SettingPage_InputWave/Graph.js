import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph({ setting:{lambda,split,fieldX} ,amplitudeScaler: { Rise: { slope, shift }, Pulse: { peakPosition, widthFactor }, simulationNum } }) {
  const {width,height}=maker_RECT();
// y=sin(2\pi f\Delta tx)*\frac{1}{1+e^{(slope*(x-shift))}}
// y=sin(2\pi f\Delta tx)*e^\frac{-(x-peakposition)^2{}}{400*widthfactor}{}
  const trace1 = {
    type: 'line',
    x: Array.from({ length: simulationNum+1 }, (_, i) => i),
    y: Array.from({ length: simulationNum+1 }, (_, i) => Math.sin(1.27279 * 3.141 * i * fieldX / (lambda*split))*
    (1/(1+Math.exp(slope*(i-shift))))),
    mode: 'lines',
    line: { color: 'rgba(0,0,255,0.4)', width: 2 },
    name:"正弦波"
  };
  const trace2 = {
    type: 'line', 
    x: Array.from({ length: simulationNum+1 }, (_, i) => i),
    y: Array.from({ length: simulationNum+1 }, (_, i) => Math.sin(1.27279 * 3.141 * i * fieldX / (lambda*split))*
    Math.exp(-Math.pow((i - peakPosition), 2) / (widthFactor * 400))),
    mode: 'lines',
    line: { color: 'rgba(255,0,0,0.4)', width: 2 },
    name:"ガウシアンパルス"
  };
  const markerTrace = {
    type: 'scatter',
    x: [shift],
    y: [1 *(1 / (1 + Math.exp(0)))],
    mode: 'markers',
    marker: { size: 10, color: 'rgba(0,0,255,1)' },
    showlegend:false,
  };
  const markerTrace2 = {
    type: 'scatter',
    x: [peakPosition],
    y: [1],
    mode: 'markers',
    marker: { size: 10, color: 'rgba(255,0,0,1)' },
    showlegend:false,
  };
  return (
    <Plot
      data={[trace1,trace2,markerTrace,markerTrace2]}
      layout={{
        width: width,
        height: height,
        title: '入力波',
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 0 },  // Adjusted margins
        xaxis: {
          title: 'シュミレーション回数',
          range: [0, simulationNum],  // Adjust domain as needed
        },
        yaxis: {
          title: '波形',
          range: [-1.2, 1.2],  // Adjust domain as needed
        },
        annotations: [
          {
            x: shift+45,
            y: 1 *(1 / (1 + Math.exp(0))),
            xref: 'x',
            yref: 'y',
            text: '対称点',
            font: {
              color: 'blue',
              size: 16,
            },
            showarrow: false,
          },
          {
            x: peakPosition+110,
            y: 1,
            xref: 'x',
            yref: 'y',
            text: 'ガウスパルスの最高点',
            font: {
              color: 'red',
              size: 16,
            },
            showarrow: false,
          },
        ],
      }}
      config={{ displayModeBar: false, staticPlot: true }}  // Disabled toolbar and interactivity
    />
  );
}

export function maker_RECT() {

  const availableWidth = window.innerWidth - 580<400 ? 600 : window.innerWidth - 540;
  const availableHeight = window.innerHeight*0.9<500? 500:window.innerHeight*0.9;

  // Calculate the maximum canvasDx that satisfies both conditions

  const RECT = {
    width: availableWidth,
    height: availableHeight,
  };

  return RECT;
}
export default Graph;