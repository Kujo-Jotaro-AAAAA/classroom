declare module '*.css';
declare module '*.less';
declare module "*.png";
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}
// 给window对象添加属性
declare function onBackPress (): void
declare function voiceRecordStart (): void
declare function voiceRecordEnd (): void
declare function voiceRecordPlay (): void
declare function nextStep (): void
declare namespace onBackPress {
  export function postMessage (): void
}
declare namespace voiceRecordStart {
  export function postMessage (): void
}
declare namespace voiceRecordEnd {
  export function postMessage (): void
}
declare namespace voiceRecordPlay {
  export function postMessage (): void
}
declare namespace nextStep {
  export function postMessage (): void
}
