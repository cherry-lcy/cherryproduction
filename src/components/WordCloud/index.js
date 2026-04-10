import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

const WordCloudComponent = ({ words, width = "100%", height = "100%" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && words.length > 0 && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = containerHeight;
      
      const wordList = words.map(item => [item.text, item.weight]);

      const options = {
        list: wordList,
        gridSize: 16,
        weightFactor: function (w) {
          return Math.pow(w, 0.8) * (containerWidth / 200);
        },
        fontFamily: 'Arial, sans-serif',
        color: function(word, weight) { 
            const colors = ['#6AECE1', '#26CCC2', '#FFB76C', '#3396D3', '#0BA6DF', '#FA5C5C', '#FD8A6B'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.5,
        minSize: 12,
        shape: 'diamond',
        weightMode: 'size',
        shrinkToFit: true,
        backgroundColor: "#FFF8E1",
      };

      WordCloud(canvasRef.current, options);
    }
  }, [words]);

  return (
    <div
        ref={containerRef}
        style={{
            backgroundColor: "#FFF8E1",
            padding: "1rem",
            borderRadius: '8px',
            width: "100%",
            height: "100%",
            minHeight: "300px"
        }}
    >
        <canvas 
          ref={canvasRef} 
          style={{
            width: "100%",
            height: "100%",
            display: "block"
          }}
        />
    </div>
  );
};

export default WordCloudComponent;