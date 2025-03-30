uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

void main()
{
    // vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec2 normalizedMousePosition = uMouse.xy / uResolution.xy;
    float bTime = sin(uTime * 10.0);
    
    gl_FragColor = vec4(normalizedMousePosition.x, normalizedMousePosition.y, bTime, 1.0);
}
