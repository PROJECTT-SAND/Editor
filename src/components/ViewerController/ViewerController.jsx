import style from './ViewerController.module.scss';
import React, { useEffect, useState } from 'react';
import useStore from '../../store';
import { system } from '../../system';

export default function ViewerController() {
  const [toolState, setToolState] = useState(0);
  const [optionsState, setOptionsState] = useState({
    "showGrid": false,
    "fullScreen": false
  });

  function PositionIndicator() {
    const {mouseIsEnterViewer} = useStore();
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
      document.addEventListener('mousemove', ({clientX: x, clientY: y}) => {
        setMouseX(x - 25);
        setMouseY(y - 25);
      })
    }, []);

    if (mouseIsEnterViewer) {
      return(
        <div className={style.positionIndicator}>
          <div>
            <span>X: </span>
            <i>{mouseX}</i>
          </div>
          <div>
            <span>Y: </span>
            <i>{mouseY}</i>
          </div>
        </div>
      );
    } else {
      return(null);
    }
  }

  function Player() {
    const [playerState, setPlayerState] = useState(1);
          
    const playerStates = [ // 0: 조작 불가, 1: 조작 가능, 2: 활성화
      [0, 0, 0], // 0 프로그램 로딩 상태.
      [1, 0, 0], // 1 최초 상태. 실행만 가능.
      [2, 0, 0], // 2 실행중인 상태. 조작 불가.
      [2, 1, 1], // 3 실행된 상태. 정지, 멈춤 가능.
      [1, 2, 1], // 4 멈춘 상태. 실행, 멈춤 가능.
      [0, 0, 2], // 5 정지중인 상태. 조작 불가.
    ]

    return(
      <div className={style.player}>
        <button
          className={`
            ${style.player_play}
            ${(playerStates[playerState][0] === 0) ? style.player_noActive : ""}
            ${(playerStates[playerState][0] === 2) ? style.player_play_active : ""}
          `} 
          onClick={()=>{
            if(playerStates[playerState][0] === 1) {
              setPlayerState(2);
              if(playerState === 1) {
                (async () => {
                  await system.run("sys start");
                  setPlayerState(3);
                })();
              } else if(playerState === 4) {
                (async () => {
                  await system.run("sys restart");
                  setPlayerState(3);
                })();
              }
            }
          }}>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>
        </button>

        <button
          className={`
            ${style.player_pause}
            ${(playerStates[playerState][1] === 0) ? style.player_noActive : ""}
            ${(playerStates[playerState][1] === 2) ? style.player_pause_active : ""}
          `}
          onClick={()=>{
            if(playerStates[playerState][1] === 1) {
              setPlayerState(4);
            }
          }}>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 24h-6v-24h6v24zm10-24h-6v24h6v-24z"/></svg>
        </button>

        <button
          className={`
            ${style.player_stop}
            ${(playerStates[playerState][2] === 0) ? style.player_noActive : ""}
            ${(playerStates[playerState][2] === 2) ? style.player_stop_active : ""}
          `}
          onClick={()=>{
            if(playerStates[playerState][2] === 1) {
              setPlayerState(5);
              if(playerState === 3) {
                (async () => {
                  await system.run("sys stop");
                  setPlayerState(1);
                })();
              } else if(playerState === 4) {
                (async () => {
                  await system.run("sys stop");
                  setPlayerState(1);
                })();
              }
            }
          }}>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h20v20h-20z"/></svg>
        </button>
      </div>
    )
  }

  return (
    <div className={style.viewerController}>
      <PositionIndicator />
      <div className={style.options}>
        <div className={style.showGrid}>
          <button
            className={(optionsState["showGrid"]) ? style.option_active : ""}
            onClick={()=>{
              const value = {...optionsState};
              value["showGrid"] = !value["showGrid"];
              setOptionsState(value);
            }}>
          
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.941 4v3.668h-4.941v2h4.941v4.664h-4.941v2h4.941v3.668h2v-3.668h6.059v3.668h2v-3.668h5v-2h-5v-4.664h5v-2h-5v-3.668h-2v3.668h-6.059v-3.668h-2zm2 5.668h6.059v4.664h-6.059v-4.664z"/></svg>
          </button>
        </div>
        <div className={style.fullScreen}>
          <button
            className={(optionsState["fullScreen"]) ? style.option_active : ""}
            onClick={()=>{
              const value = {...optionsState};
              value["fullScreen"] = !value["fullScreen"];
              setOptionsState(value);
            }}>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z"/></svg>
          </button>
        </div>
      </div>
      <div className={style.tool}>
        <button
          className={`
            ${style.tool_hand}
            ${(toolState === 0) ? style.tool_active : ""}
          `}
          onClick={()=>{ if(toolState === 1) {setToolState(0)} }}>

          <svg viewBox="0 0 173.756 202.641" xmlns="http://www.w3.org/2000/svg"><path d="M88.667.032c-3.275.212-6.497 1.497-9.07 3.965h-.002c.028-.027-.071.026-.695.598-.625.571-1.638 1.787-2.193 3.012-1.11 2.449-1.131 4.235-1.283 7.268-.305 6.065-.281 17.539-.371 42.877-.077 21.773-.125 33.163-.223 39.123-.048 2.923-.117 4.51-.172 5.187-.102 0-.342-.11-1.479-.039-2.297.143-2.129.109-2.414-.25l-.031-.855c-.041-1.531-.077-3.824-.105-6.857-.057-6.066-.085-15.112-.086-27.326-.001-12.294-.028-21.395-.086-27.594-.029-3.099-.065-5.469-.111-7.188-.023-.859-.048-1.551-.08-2.135-.032-.583.05-.696-.225-1.975-2.002-9.337-12.684-14.554-21.268-10.355-2.065 1.01-3.208 1.57-5.057 3.996-.146.191-1.651 2.116-2.207 4.178-.557 2.064-.638 3.88-.748 7.176-.221 6.592-.193 19.062-.193 45.395v46.939l-.156.307c-.16.315-.516.322-.697.295-.383-.475-.901-1.137-1.531-1.969-1.339-1.766-3.089-4.153-4.881-6.674-1.855-2.61-3.667-5.104-5.117-7.053-.725-.974-1.357-1.809-1.881-2.48-.524-.672-.558-.861-1.586-1.859-1.62-1.573-2.947-2.172-4.418-2.791-1.471-.619-2.769-1.184-5.193-1.184-4.819 0-6.9 1.471-9.787 4.012h-.002c-4.906 4.319-6.854 11.58-3.977 17.648.491 1.037.478.868.635 1.111l.545.826c.427.636 1 1.475 1.719 2.516 1.438 2.082 3.453 4.964 5.904 8.455 4.903 6.982 11.555 16.388 18.785 26.547l28.291 39.75 49.457.006 51.256.008 1.623-6.5-.002.002c.77-3.08 3.824-16.37 6.852-29.639 1.514-6.635 3.002-13.189 4.146-18.27 1.145-5.081 1.848-8.145 2.123-9.613v-.002c.347-1.857.596-3.895.701-8.936.105-5.041.142-13.627.201-30.098.112-30.675.577-33.698-.66-37.953v-.002c-1.829-6.289-7.583-10.148-13.182-10.547-5.599-.399-11.816 2.575-14.572 8.51-.236.509-.723 1.791-.916 2.902-.193 1.112-.256 2.138-.314 3.629-.117 2.982-.156 7.908-.234 17.535l-.146 18.006c-.298.556.333.553-2.6.352h-.004c-1.732-.118-1.219-.046-1.363-.281.001-.101.02.123-.057-1.305-.229-4.276-.253-14.081-.342-34.791l-.168-39.229-1.496-2.795c-2.804-5.239-8.267-8.156-13.561-8.09-5.293.066-10.747 3.197-13.273 8.602-.197.421-.822 2.198-.98 3.512-.158 1.313-.211 2.738-.266 5.273-.109 5.071-.149 14.47-.229 33.211-.089 20.791-.11 30.566-.332 34.76-.027.51-.065.644-.105.975-.121.007-.305.06-1.658.06-1.179 0-1.526 0-1.689.014-.243-.168-.447-.343-.57-.537l-.156-43.646-.168-47.271-1.82-3.096v-.002c-2.987-5.082-8.59-7.704-14.047-7.35z"/></svg>
        </button>

        <button
          className={`
            ${style.tool_move}
            ${(toolState === 1) ? style.tool_active : ""}
          `}
          onClick={()=>{ if(toolState === 0) {setToolState(1)} }}>

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 0l18 15h-11.081l-6.919 9z"/></svg>
        </button>
      </div>
      <Player />
    </div>
  );
}