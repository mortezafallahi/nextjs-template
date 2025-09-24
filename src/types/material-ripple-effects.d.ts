declare module 'material-ripple-effects' {
  export default class Ripple {
    create(event: React.MouseEvent, type?: 'light' | 'dark'): void;
  }
}
