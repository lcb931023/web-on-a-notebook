// https://www.shadertoy.com/view/Mlj3Dw#

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float i = iGlobalTime;
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 c = texture(iChannel0,uv)*2.0;
    uv.xy+=c.bg*(iMouse.x/iResolution.x-.5);
    uv-=.5;
    float a = atan(uv.y,uv.x);
    float d = length(uv);
    a+=c.r*(iMouse.y/iResolution.y-.5)*12.0;
    uv.x = cos(a)*d;
    uv.y = sin(a)*d;
    uv+=.5;
    c = texture(iChannel0,uv)*2.0;
	fragColor = c;
}
