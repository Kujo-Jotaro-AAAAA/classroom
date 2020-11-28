declare module '*.css';
declare module '*.less';
declare module "*.png";
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}
// declare function onBackPress (): void
// declare function voiceRecordStart (): void
// declare function voiceRecordEnd (): void
// declare function voiceRecordPlay (): void
// declare function nextStep (): void
declare namespace onBackPress {
  export function postMessage (str?: string): void
}
declare namespace voiceRecordStart {
  export function postMessage (str?: string): void
}
declare namespace voiceRecordEnd {
  export function postMessage (str?: string): void
}
declare namespace voiceRecordPlay {
  export function postMessage (str?: string): void
}
declare namespace nextStep {
  export function postMessage (str?: string): void
}
