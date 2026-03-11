#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    // Each result will return 1.0 (white) or 0.0 (black)
    float left = step(0.1, st.x);       // x greater than 0.1
    float bottom = step(0.1, st.y);     // y greater than 0.1

    float right = step(st.x, 0.9);      // x less than 0.9
    float top = step(st.y, 0.9);        // y less than 0.9

    color = vec3(left * bottom * right * top); // Only white if all are true

    // Alternatively, you could use the min function to achieve the same result:
    // vec2 bottom_left = step(vec2(0.1), st);
    // vec2 top_right = step(st, vec2(0.9));

    // float pct = min(bottom_left.x, bottom_left.y) * min(top_right.x, top_right.y);

    // color = vec3(pct);

    gl_FragColor = vec4(color, 1.0);
}