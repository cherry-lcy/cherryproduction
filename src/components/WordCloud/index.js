import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

const WordCloudComponent = ({ words, width = 600, height = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      const wordList = words.map(item => [item.text, item.weight]);

      const options = {
        list: wordList,
        gridSize: 16,
        weightFactor: function (w) {
          return Math.pow(w, 0.8) * 5;
        },
        fontFamily: 'Arial, sans-serif',
        color: function(word, weight) { 
            const colors = ['#6AECE1', '#26CCC2', '#FFB76C', '#3396D3', '#0BA6DF', '#FA5C5C', '#FD8A6B'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.5,
        minSize: 12,
        shape: 'diamond',   // 形状：'circle', 'cardioid', 'diamond', 'square'
        weightMode: 'size',
        shrinkToFit: true,
        backgroundColor: "#FFF8E1",
        padding: [40, 40],
        shrink: { 
            start: 20,
            end: 100,
        },
      };

      WordCloud(canvasRef.current, options);
    }
  }, [words]);

  return (
    <div
        style={{
            backgroundColor: "#FFF8E1",
            padding: "30px",
            borderRadius: '8px'
        }}
    >
        <canvas 
        ref={canvasRef} 
        width={width-90} 
        height={height-30}
        />
    </div>
  );
};

export default WordCloudComponent;