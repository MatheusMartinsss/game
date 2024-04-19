import React from 'react';
import PropTypes from 'prop-types';

const Canvas = ({ draw, height, width }) => {
    const canvasRef = React.useRef();

    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            draw(context, canvas);
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);

    return (
        <canvas ref={canvasRef} height={height} width={width} />
    );
};

Canvas.propTypes = {
    draw: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
};

export default Canvas;