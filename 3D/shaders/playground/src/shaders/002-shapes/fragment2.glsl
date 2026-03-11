# ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    float left = smoothstep(0.1, 0.2, st.x);
    float bottom = smoothstep(0.1, 0.2, st.y);
    float right = smoothstep(0.9, 0.8, st.x);
    float top = smoothstep(0.9, 0.8, st.y);

    color = vec3(left * bottom * right * top);

    gl_FragColor = vec4(color, 1.0);
}