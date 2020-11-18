import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

function SvgComponent(props) {
    const { focused, color } = props;
    console.log('props = ', props);

    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={30}
            {...props}
        >
            <Path fill="none" d="M-1-1h32v32H-1z" />
            <Rect
                width={24.095}
                height={26.351}
                x={2.779}
                y={1.543}
                fill={color}
                rx={2}
            />
            {/* Plate */}
            <Path
                fill={
                    color === '#8E8E8F'
                        ? 'white'
                        : color === '#2f95dc'
                        ? 'white'
                        : 'black'
                }
                d="M16.138 7.103v-.554a1.111 1.111 0 00-2.223 0v.554c-3.423.47-6.091 3.073-6.334 6.278h-.497a1.111 1.111 0 000 2.222h15.885a1.111 1.111 0 000-2.222h-.498c-.242-3.205-2.91-5.809-6.333-6.278zm-1.112 2.146c2.708 0 4.943 1.814 5.215 4.131H9.811c.272-2.317 2.507-4.13 5.215-4.13z"
            />
            <Path fill="none" d="M3.521 24.274l8.69.778" />
            {/* Lines */}
            <Path
                fill={
                    color === '#8E8E8F'
                        ? 'white'
                        : color === '#2f95dc'
                        ? 'white'
                        : 'black'
                }
                d="M6.13 18.351h17.806v1.545H6.13zM6.13 22.059h17.806v1.545H6.13z"
            />
        </Svg>
    );
}

export default SvgComponent;
