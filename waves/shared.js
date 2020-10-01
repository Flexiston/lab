"use strict";var INITIAL_SIZE=250,INITIAL_WIND=[10,10],INITIAL_CHOPPINESS=1.5,CLEAR_COLOR=[0,0,0,0],GEOMETRY_ORIGIN=[-1e3,-1e3],SUN_DIRECTION=[-1,1,1],OCEAN_COLOR=[.004,.016,.047],SKY_COLOR=[3.2,9.6,12.8],EXPOSURE=.35,GEOMETRY_RESOLUTION=256,GEOMETRY_SIZE=2e3,RESOLUTION=512,SIZE_OF_FLOAT=4,OCEAN_COORDINATES_UNIT=1,INITIAL_SPECTRUM_UNIT=0,SPECTRUM_UNIT=1,DISPLACEMENT_MAP_UNIT=2,NORMAL_MAP_UNIT=3,PING_PHASE_UNIT=4,PONG_PHASE_UNIT=5,PING_TRANSFORM_UNIT=6,PONG_TRANSFORM_UNIT=7,UI_COLOR="rgb(52, 137, 189)",PROFILE_AMPLITUDE=50,PROFILE_OMEGA=.05,PROFILE_PHI=-2.5,PROFILE_STEP=5,PROFILE_OFFSET=52,PROFILE_COLOR="rgb(52, 137, 189)",PROFILE_LINE_WIDTH=3,CHOPPINESS_SCALE=.15,ARROW_ORIGIN=[-1250,0,500],ARROW_SHAFT_WIDTH=80,ARROW_HEAD_WIDTH=160,ARROW_HEAD_HEIGHT=60,ARROW_OFFSET=40,WIND_SCALE=8,MIN_WIND_SPEED=5,MAX_WIND_SPEED=25,HANDLE_COLOR="#666666",SLIDER_LEFT_COLOR=UI_COLOR,SLIDER_RIGHT_COLOR="#999999",FOV=60/180*Math.PI,NEAR=1,FAR=1e4,MIN_ASPECT=16/9,WIND_SPEED_DECIMAL_PLACES=1,SIZE_DECIMAL_PLACES=0,CHOPPINESS_DECIMAL_PLACES=1,SENSITIVITY=1,WIND_SPEED_X=-1350,MIN_WIND_SPEED_Z=600,WIND_SPEED_OFFSET=30,OVERLAY_DIV_ID="overlay",PROFILE_CANVAS_ID="profile",SIMULATOR_CANVAS_ID="simulator",UI_DIV_ID="ui",CAMERA_DIV_ID="camera",WIND_SPEED_DIV_ID="wind",WIND_SPEED_SPAN_ID="wind-speed",CHOPPINESS_DIV_ID="choppiness",SIZE_SLIDER_X=-200,SIZE_SLIDER_Z=1100,SIZE_SLIDER_LENGTH=400,MIN_SIZE=100,MAX_SIZE=1e3,SIZE_SLIDER_BREADTH=3,SIZE_HANDLE_SIZE=24,CHOPPINESS_SLIDER_X=-1420,CHOPPINESS_SLIDER_Z=75,CHOPPINESS_SLIDER_LENGTH=300,MIN_CHOPPINESS=0,MAX_CHOPPINESS=2.5,CHOPPINESS_SLIDER_BREADTH=6,CHOPPINESS_HANDLE_SIZE=30,ARROW_TIP_RADIUS=100,SIZE_HANDLE_RADIUS=30,CHOPPINESS_HANDLE_RADIUS=100,NONE=0,ORBITING=1,ROTATING=2,SLIDING_SIZE=3,SLIDING_CHOPPINESS=4,CAMERA_DISTANCE=1500,ORBIT_POINT=[-200,0,600],INITIAL_AZIMUTH=.4,INITIAL_ELEVATION=.5,MIN_AZIMUTH=-.2,MAX_AZIMUTH=.5,MIN_ELEVATION=.4,MAX_ELEVATION=.8,addToVector=function(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t},subtractFromVector=function(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t},multiplyVectorByScalar=function(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t},makeIdentityMatrix=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},makeXRotationMatrix=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=Math.cos(e),t[6]=Math.sin(e),t[7]=0,t[8]=0,t[9]=-Math.sin(e),t[10]=Math.cos(e),t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},makeYRotationMatrix=function(t,e){return t[0]=Math.cos(e),t[1]=0,t[2]=-Math.sin(e),t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=Math.sin(e),t[9]=0,t[10]=Math.cos(e),t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},distanceBetweenVectors=function(t,e){var r=e[0]-t[0],n=e[1]-t[1],I=e[2]-t[2];return Math.sqrt(r*r+n*n+I*I)},lengthOfVector=function(t){var e=t[0],r=t[1],n=t[2];return Math.sqrt(e*e+r*r+n*n)},setVector4=function(t,e,r,n,I){return t[0]=e,t[1]=r,t[2]=n,t[3]=I,t},projectVector4=function(t,e){var r=1/e[3];return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t},transformVectorByMatrix=function(t,e,r){var n=e[0],I=e[1],E=e[2],_=e[3];return t[0]=r[0]*n+r[4]*I+r[8]*E+r[12]*_,t[1]=r[1]*n+r[5]*I+r[9]*E+r[13]*_,t[2]=r[2]*n+r[6]*I+r[10]*E+r[14]*_,t[3]=r[3]*n+r[7]*I+r[11]*E+r[15]*_,t},invertMatrix=function(t,e){var r=e[0],n=e[4],I=e[8],E=e[12],_=e[1],i=e[5],a=e[9],o=e[13],S=e[2],T=e[6],R=e[10],A=e[14],N=e[3],O=e[7],u=e[11],P=e[15],D=R*P,s=A*u,c=T*P,L=A*O,M=T*u,l=R*O,m=S*P,f=A*N,C=S*u,U=R*N,F=S*O,p=T*N,H=I*o,h=E*a,x=n*o,d=E*i,g=n*a,W=I*i,v=r*o,b=E*_,X=r*a,V=I*_,Z=r*i,G=n*_,w=D*i+L*a+M*o-(s*i+c*a+l*o),y=s*_+m*a+U*o-(D*_+f*a+C*o),B=c*_+f*i+F*o-(L*_+m*i+p*o),k=l*_+C*i+p*a-(M*_+U*i+F*a),Y=1/(r*w+n*y+I*B+E*k);return t[0]=Y*w,t[1]=Y*y,t[2]=Y*B,t[3]=Y*k,t[4]=Y*(s*n+c*I+l*E-(D*n+L*I+M*E)),t[5]=Y*(D*r+f*I+C*E-(s*r+m*I+U*E)),t[6]=Y*(L*r+m*n+p*E-(c*r+f*n+F*E)),t[7]=Y*(M*r+U*n+F*I-(l*r+C*n+p*I)),t[8]=Y*(H*O+d*u+g*P-(h*O+x*u+W*P)),t[9]=Y*(h*N+v*u+V*P-(H*N+b*u+X*P)),t[10]=Y*(x*N+b*O+Z*P-(d*N+v*O+G*P)),t[11]=Y*(W*N+X*O+G*u-(g*N+V*O+Z*u)),t[12]=Y*(x*R+W*A+h*T-(g*A+H*T+d*R)),t[13]=Y*(X*A+H*S+b*R-(v*R+V*A+h*S)),t[14]=Y*(v*T+G*A+d*S-(Z*A+x*S+b*T)),t[15]=Y*(Z*R+g*S+V*T-(X*T+G*R+W*S)),t},premultiplyMatrix=function(t,e,r){var n=r[0],I=r[4],E=r[8],_=r[12],i=r[1],a=r[5],o=r[9],S=r[13],T=r[2],R=r[6],A=r[10],N=r[14],O=r[3],u=r[7],P=r[11],D=r[15],s=e[0],c=e[1],L=e[2],M=e[3];return t[0]=n*s+I*c+E*L+_*M,t[1]=i*s+a*c+o*L+S*M,t[2]=T*s+R*c+A*L+N*M,t[3]=O*s+u*c+P*L+D*M,s=e[4],c=e[5],L=e[6],M=e[7],t[4]=n*s+I*c+E*L+_*M,t[5]=i*s+a*c+o*L+S*M,t[6]=T*s+R*c+A*L+N*M,t[7]=O*s+u*c+P*L+D*M,s=e[8],c=e[9],L=e[10],M=e[11],t[8]=n*s+I*c+E*L+_*M,t[9]=i*s+a*c+o*L+S*M,t[10]=T*s+R*c+A*L+N*M,t[11]=O*s+u*c+P*L+D*M,s=e[12],c=e[13],L=e[14],M=e[15],t[12]=n*s+I*c+E*L+_*M,t[13]=i*s+a*c+o*L+S*M,t[14]=T*s+R*c+A*L+N*M,t[15]=O*s+u*c+P*L+D*M,t},makePerspectiveMatrix=function(t,e,r,n,I){var E=Math.tan(.5*(Math.PI-e)),_=n-I;return t[0]=E/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=E,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=I/_,t[11]=-1,t[12]=0,t[13]=0,t[14]=n*I/_,t[15]=0,t},clamp=function(t,e,r){return Math.min(Math.max(t,e),r)},log2=function(t){return Math.log(t)/Math.log(2)},buildProgramWrapper=function(t,e,r,n){var I,E={},_=t.createProgram();for(I in t.attachShader(_,e),t.attachShader(_,r),n)t.bindAttribLocation(_,n[I],I);t.linkProgram(_);for(var i={},a=t.getProgramParameter(_,t.ACTIVE_UNIFORMS),o=0;o<a;o+=1){var S=t.getActiveUniform(_,o),T=t.getUniformLocation(_,S.name);i[S.name]=T}return E.program=_,E.uniformLocations=i,E},buildShader=function(t,e,r){var n=t.createShader(e);return t.shaderSource(n,r),t.compileShader(n),n},buildTexture=function(t,e,r,n,I,E,_,i,a,o,S){var T=t.createTexture();return t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,T),t.texImage2D(t.TEXTURE_2D,0,r,I,E,0,r,n,_),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,S),T},buildFramebuffer=function(t,e){var r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),r},epsilon=function(t){return Math.abs(t)<1e-6?0:t},toCSSMatrix=function(t){return"matrix3d("+epsilon(t[0])+","+-epsilon(t[1])+","+epsilon(t[2])+","+epsilon(t[3])+","+epsilon(t[4])+","+-epsilon(t[5])+","+epsilon(t[6])+","+epsilon(t[7])+","+epsilon(t[8])+","+-epsilon(t[9])+","+epsilon(t[10])+","+epsilon(t[11])+","+epsilon(t[12])+","+-epsilon(t[13])+","+epsilon(t[14])+","+epsilon(t[15])+")"},setPerspective=function(t,e){t.style.WebkitPerspective=e,t.style.perspective=e},setTransformOrigin=function(t,e){t.style.WebkitTransformOrigin=e,t.style.transformOrigin=e},setTransform=function(t,e){t.style.WebkitTransform=e,t.style.transform=e},setText=function(t,e,r){t.textContent=e.toFixed(r)},getMousePosition=function(t,e){var r=e.getBoundingClientRect();return{x:t.clientX-r.left,y:t.clientY-r.top}},hasWebGLSupportWithExtensions=function(t){var e=document.createElement("canvas"),r=null;try{r=e.getContext("webgl")||e.getContext("experimental-webgl")}catch(t){return!1}if(null===r)return!1;for(var n=0;n<t.length;++n)if(null===r.getExtension(t[n]))return!1;return!0},requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame;