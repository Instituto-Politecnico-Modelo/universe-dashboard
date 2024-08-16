// perdon :(
export function calculateGradientFromValue(value: number, min: number, max: number, colors: number[]):  number {
    // this function should blend the colors in the colors array based on the value
    // the value should be between min and max
    // the colors array should have at least 2 colors
    // the colors should be in hex format
    // the function should return a hex color
    // the color should be a gradient between the colors in the colors array
    // the gradient should be based on the value

    const range = max - min;
    const valueRange = value - min;
    const colorRange = colors.length - 1;
    const colorIndex = valueRange / range * colorRange;
    const colorIndexFloor = Math.floor(colorIndex);
    const colorIndexCeil = Math.ceil(colorIndex);
    const colorIndexDecimal = colorIndex - colorIndexFloor;
    const colorFloor = colors[colorIndexFloor];
    const colorCeil = colors[colorIndexCeil];
    const colorFloorR = colorFloor >> 16;
    const colorFloorG = (colorFloor >> 8) & 0xff;
    const colorFloorB = colorFloor & 0xff;
    const colorCeilR = colorCeil >> 16;
    const colorCeilG = (colorCeil >> 8) & 0xff;
    const colorCeilB = colorCeil & 0xff;
    const colorR = colorFloorR + (colorCeilR - colorFloorR) * colorIndexDecimal;
    const colorG = colorFloorG + (colorCeilG - colorFloorG) * colorIndexDecimal;
    const colorB = colorFloorB + (colorCeilB - colorFloorB) * colorIndexDecimal;
    return (colorR << 16) + (colorG << 8) + colorB;
}