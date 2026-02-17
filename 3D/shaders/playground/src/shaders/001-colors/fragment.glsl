uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec2 normalizedMousePosition = u_mouse.xy / u_resolution.xy;
    // float bTime = sin(u_time * 10.0);
    
    gl_FragColor = vec4(st.x, st.y, 1.0, 1.0);
    // gl_FragColor = vec4(normalizedMousePosition.x, normalizedMousePosition.y, bTime, 1.0);
}
